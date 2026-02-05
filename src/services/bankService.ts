import type { Transaction } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface PlaidInstitution {
  institution_id: string;
  name: string;
}

export interface PlaidAccount {
  account_id: string;
  name: string;
  official_name: string | null;
  type: string;
  subtype: string | null;
  mask: string | null;
  balances: {
    available: number | null;
    current: number | null;
    limit: number | null;
  };
}

export interface PlaidTransaction {
  transaction_id: string;
  account_id: string;
  amount: number;
  date: string;
  name: string;
  merchant_name: string | null;
  category: string[] | null;
  pending: boolean;
}

export interface ConnectedInstitution {
  item_id: string;
  institution: PlaidInstitution;
  connected_at: string;
}

// Create a link token for Plaid Link initialization
export async function createLinkToken(): Promise<string> {
  const response = await fetch(`${API_URL}/api/plaid/create-link-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Failed to create link token');
  }

  const data = await response.json();
  return data.link_token;
}

// Exchange public token for access token after successful Plaid Link
export async function exchangeToken(
  publicToken: string,
  institution: PlaidInstitution
): Promise<{ item_id: string; institution: PlaidInstitution }> {
  const response = await fetch(`${API_URL}/api/plaid/exchange-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ public_token: publicToken, institution }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange token');
  }

  return response.json();
}

// Get accounts for a connected item
export async function getAccounts(
  itemId: string
): Promise<{ accounts: PlaidAccount[]; institution: PlaidInstitution }> {
  const response = await fetch(`${API_URL}/api/plaid/accounts/${itemId}`);

  if (!response.ok) {
    throw new Error('Failed to get accounts');
  }

  return response.json();
}

// Get transactions from Plaid
export async function getPlaidTransactions(
  itemId: string,
  startDate?: string,
  endDate?: string
): Promise<{
  transactions: PlaidTransaction[];
  accounts: PlaidAccount[];
  total_transactions: number;
}> {
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);

  const url = `${API_URL}/api/plaid/transactions/${itemId}${params.toString() ? '?' + params.toString() : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to get transactions');
  }

  return response.json();
}

// Get all connected institutions
export async function getConnectedInstitutions(): Promise<ConnectedInstitution[]> {
  const response = await fetch(`${API_URL}/api/plaid/institutions`);

  if (!response.ok) {
    throw new Error('Failed to get institutions');
  }

  const data = await response.json();
  return data.institutions;
}

// Remove a connected institution
export async function removeInstitution(itemId: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/plaid/item/${itemId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to remove institution');
  }
}

// Map Plaid category to app category
function mapPlaidCategoryToAppCategory(plaidCategories: string[] | null | undefined): string {
  if (!plaidCategories || plaidCategories.length === 0) return 'other';
  const primary = plaidCategories[0]?.toLowerCase() || '';
  const secondary = plaidCategories[1]?.toLowerCase() || '';

  // Map Plaid categories to our app categories
  const categoryMap: Record<string, string> = {
    'food and drink': 'food_dining',
    'restaurants': 'food_dining',
    'coffee shop': 'food_dining',
    'fast food': 'food_dining',
    'groceries': 'food_dining',
    'supermarkets and groceries': 'food_dining',
    'transportation': 'transportation',
    'gas stations': 'transportation',
    'taxi': 'transportation',
    'ride share': 'transportation',
    'public transportation': 'transportation',
    'shops': 'shopping',
    'clothing': 'shopping',
    'electronics': 'shopping',
    'entertainment': 'entertainment',
    'recreation': 'entertainment',
    'gyms and fitness centers': 'health',
    'travel': 'travel',
    'healthcare': 'health',
    'pharmacies': 'health',
    'medical': 'health',
    'rent': 'housing',
    'mortgage': 'housing',
    'utilities': 'utilities',
    'telecommunication services': 'utilities',
    'internet': 'utilities',
    'payment': 'other',
    'transfer': 'other',
    'bank fees': 'other',
  };

  // Try to match on primary category
  for (const [key, value] of Object.entries(categoryMap)) {
    if (primary.includes(key) || secondary.includes(key)) {
      return value;
    }
  }

  return 'other';
}

// Convert Plaid transactions to app transactions format
export function convertPlaidTransactions(
  plaidTransactions: PlaidTransaction[]
): Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>[] {
  return plaidTransactions
    .filter((t) => !t.pending) // Skip pending transactions
    .map((t) => ({
      // Plaid returns positive amounts for debits, negative for credits
      amount: Math.abs(t.amount),
      type: t.amount > 0 ? ('expense' as const) : ('income' as const),
      category: mapPlaidCategoryToAppCategory(t.category),
      merchant: t.merchant_name || t.name,
      description: t.name,
      date: new Date(t.date),
      notes: `Imported from bank${t.category ? ' - ' + t.category.join(' > ') : ''}`,
      tags: ['bank-import'],
      plaidTransactionId: t.transaction_id,
    }));
}
