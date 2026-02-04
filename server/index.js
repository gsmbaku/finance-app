import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';

dotenv.config({ path: '../.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

// Plaid configuration
const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

// Store access tokens in memory (in production, use a database)
const accessTokens = new Map();

// Create a link token for Plaid Link initialization
app.post('/api/plaid/create-link-token', async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'user-' + Date.now() },
      client_name: 'FinCoach',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
    });
    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error('Error creating link token:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create link token' });
  }
});

// Exchange public token for access token
app.post('/api/plaid/exchange-token', async (req, res) => {
  try {
    const { public_token, institution } = req.body;

    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Store the access token (in production, encrypt and store in database)
    accessTokens.set(itemId, {
      accessToken,
      institution,
      createdAt: new Date(),
    });

    res.json({
      item_id: itemId,
      institution,
    });
  } catch (error) {
    console.error('Error exchanging token:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to exchange token' });
  }
});

// Get accounts for a connected item
app.get('/api/plaid/accounts/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const tokenData = accessTokens.get(itemId);

    if (!tokenData) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const response = await plaidClient.accountsGet({
      access_token: tokenData.accessToken,
    });

    res.json({
      accounts: response.data.accounts,
      institution: tokenData.institution,
    });
  } catch (error) {
    console.error('Error getting accounts:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get accounts' });
  }
});

// Get transactions for a connected item
app.get('/api/plaid/transactions/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { startDate, endDate } = req.query;
    const tokenData = accessTokens.get(itemId);

    if (!tokenData) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Default to last 30 days
    const end = endDate || new Date().toISOString().split('T')[0];
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const response = await plaidClient.transactionsGet({
      access_token: tokenData.accessToken,
      start_date: start,
      end_date: end,
      options: {
        count: 500,
        offset: 0,
      },
    });

    res.json({
      transactions: response.data.transactions,
      accounts: response.data.accounts,
      total_transactions: response.data.total_transactions,
    });
  } catch (error) {
    console.error('Error getting transactions:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

// Sync transactions (for incremental updates)
app.post('/api/plaid/transactions/sync/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { cursor } = req.body;
    const tokenData = accessTokens.get(itemId);

    if (!tokenData) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const response = await plaidClient.transactionsSync({
      access_token: tokenData.accessToken,
      cursor: cursor || undefined,
    });

    res.json({
      added: response.data.added,
      modified: response.data.modified,
      removed: response.data.removed,
      next_cursor: response.data.next_cursor,
      has_more: response.data.has_more,
    });
  } catch (error) {
    console.error('Error syncing transactions:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to sync transactions' });
  }
});

// Get all connected institutions
app.get('/api/plaid/institutions', (req, res) => {
  const institutions = [];
  for (const [itemId, data] of accessTokens) {
    institutions.push({
      item_id: itemId,
      institution: data.institution,
      connected_at: data.createdAt,
    });
  }
  res.json({ institutions });
});

// Remove a connected item
app.delete('/api/plaid/item/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const tokenData = accessTokens.get(itemId);

    if (!tokenData) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await plaidClient.itemRemove({
      access_token: tokenData.accessToken,
    });

    accessTokens.delete(itemId);

    res.json({ success: true });
  } catch (error) {
    console.error('Error removing item:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`FinCoach server running on port ${PORT}`);
  console.log(`Plaid environment: ${process.env.PLAID_ENV || 'sandbox'}`);
});
