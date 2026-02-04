import { useState, useCallback, useEffect } from 'react';
import { usePlaidLink, type PlaidLinkOptions, type PlaidLinkOnSuccess } from 'react-plaid-link';
import * as bankService from '@/services/bankService';
import * as transactionService from '@/services/transactionService';
import type { Transaction } from '@/types';

export interface ConnectedBank {
  itemId: string;
  institutionName: string;
  institutionId: string;
  connectedAt: Date;
  accounts: bankService.PlaidAccount[];
}

export function useBankConnection() {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [connectedBanks, setConnectedBanks] = useState<ConnectedBank[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch link token on mount
  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const token = await bankService.createLinkToken();
        setLinkToken(token);
      } catch (err) {
        console.error('Failed to create link token:', err);
        setError('Failed to initialize bank connection. Make sure the server is running.');
      }
    };

    fetchLinkToken();
  }, []);

  // Load connected banks on mount
  useEffect(() => {
    loadConnectedBanks();
  }, []);

  const loadConnectedBanks = async () => {
    try {
      setIsLoading(true);
      const institutions = await bankService.getConnectedInstitutions();

      const banks: ConnectedBank[] = await Promise.all(
        institutions.map(async (inst) => {
          const { accounts } = await bankService.getAccounts(inst.item_id);
          return {
            itemId: inst.item_id,
            institutionName: inst.institution.name,
            institutionId: inst.institution.institution_id,
            connectedAt: new Date(inst.connected_at),
            accounts,
          };
        })
      );

      setConnectedBanks(banks);
    } catch (err) {
      console.error('Failed to load connected banks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful Plaid Link connection
  const onSuccess: PlaidLinkOnSuccess = useCallback(async (publicToken, metadata) => {
    try {
      setIsLoading(true);
      setError(null);

      // Exchange public token for access token
      const { item_id } = await bankService.exchangeToken(publicToken, {
        institution_id: metadata.institution?.institution_id || '',
        name: metadata.institution?.name || 'Unknown Bank',
      });

      // Get accounts for the new connection
      const { accounts } = await bankService.getAccounts(item_id);

      // Add to connected banks
      const newBank: ConnectedBank = {
        itemId: item_id,
        institutionName: metadata.institution?.name || 'Unknown Bank',
        institutionId: metadata.institution?.institution_id || '',
        connectedAt: new Date(),
        accounts,
      };

      setConnectedBanks((prev) => [...prev, newBank]);
    } catch (err) {
      console.error('Failed to connect bank:', err);
      setError('Failed to connect bank account');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Plaid Link configuration
  const config: PlaidLinkOptions = {
    token: linkToken,
    onSuccess,
    onExit: (err) => {
      if (err) {
        console.error('Plaid Link exit error:', err);
      }
    },
  };

  const { open, ready } = usePlaidLink(config);

  // Sync transactions from a connected bank
  const syncTransactions = useCallback(async (itemId: string): Promise<Transaction[]> => {
    try {
      setIsSyncing(true);
      setError(null);

      // Get transactions from Plaid (last 30 days by default)
      const { transactions: plaidTransactions } = await bankService.getPlaidTransactions(itemId);

      // Convert to app format
      const convertedTransactions = bankService.convertPlaidTransactions(plaidTransactions);

      // Save to local database (skip duplicates by checking plaidTransactionId)
      const savedTransactions: Transaction[] = [];

      for (const txData of convertedTransactions) {
        // Check if transaction already exists
        const existing = await transactionService.getTransactionByPlaidId(
          txData.plaidTransactionId!
        );

        if (!existing) {
          const saved = await transactionService.createTransaction(txData);
          savedTransactions.push(saved);
        }
      }

      return savedTransactions;
    } catch (err) {
      console.error('Failed to sync transactions:', err);
      setError('Failed to sync transactions');
      return [];
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Sync all banks
  const syncAllBanks = useCallback(async (): Promise<Transaction[]> => {
    const allTransactions: Transaction[] = [];

    for (const bank of connectedBanks) {
      const transactions = await syncTransactions(bank.itemId);
      allTransactions.push(...transactions);
    }

    return allTransactions;
  }, [connectedBanks, syncTransactions]);

  // Disconnect a bank
  const disconnectBank = useCallback(async (itemId: string) => {
    try {
      setIsLoading(true);
      await bankService.removeInstitution(itemId);
      setConnectedBanks((prev) => prev.filter((b) => b.itemId !== itemId));
    } catch (err) {
      console.error('Failed to disconnect bank:', err);
      setError('Failed to disconnect bank');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Wrap open to provide proper type signature
  const openPlaidLink = useCallback(() => {
    open();
  }, [open]);

  return {
    connectedBanks,
    isLoading,
    isSyncing,
    error,
    linkReady: ready && !!linkToken,
    openPlaidLink,
    syncTransactions,
    syncAllBanks,
    disconnectBank,
    refreshBanks: loadConnectedBanks,
  };
}
