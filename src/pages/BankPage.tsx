import { useState } from 'react';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { ConnectedBankCard, EmptyBankState, PlaidLinkButton } from '@/components/bank';
import { useBankConnection } from '@/hooks/useBankConnection';

export function BankPage() {
  const {
    connectedBanks,
    isLoading,
    isSyncing,
    error,
    linkReady,
    openPlaidLink,
    syncTransactions,
    syncAllBanks,
    disconnectBank,
  } = useBankConnection();

  const [syncResult, setSyncResult] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [syncingItemId, setSyncingItemId] = useState<string | null>(null);

  const handleSync = async (itemId: string) => {
    setSyncingItemId(itemId);
    setSyncResult(null);

    try {
      const transactions = await syncTransactions(itemId);
      setSyncResult({
        type: 'success',
        message: `Imported ${transactions.length} new transaction${transactions.length !== 1 ? 's' : ''}`,
      });
    } catch {
      setSyncResult({
        type: 'error',
        message: 'Failed to sync transactions',
      });
    } finally {
      setSyncingItemId(null);
    }
  };

  const handleSyncAll = async () => {
    setSyncResult(null);

    try {
      const transactions = await syncAllBanks();
      setSyncResult({
        type: 'success',
        message: `Imported ${transactions.length} new transaction${transactions.length !== 1 ? 's' : ''} from all banks`,
      });
    } catch {
      setSyncResult({
        type: 'error',
        message: 'Failed to sync transactions',
      });
    }
  };

  const handleDisconnect = async (itemId: string) => {
    if (confirm('Are you sure you want to disconnect this bank account?')) {
      await disconnectBank(itemId);
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bank Connections
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Connect your bank accounts to automatically import transactions
          </p>
        </div>
        {connectedBanks.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleSyncAll}
              disabled={isSyncing}
              leftIcon={
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              }
            >
              Sync All
            </Button>
            <PlaidLinkButton
              onClick={openPlaidLink}
              disabled={!linkReady || isLoading}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="p-4 mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800 dark:text-red-200">{error}</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Make sure the server is running with `npm run dev` in the server directory.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Sync Result Alert */}
      {syncResult && (
        <Card
          className={`p-4 mb-6 ${
            syncResult.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}
        >
          <div className="flex items-center gap-3">
            {syncResult.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <p
              className={`font-medium ${
                syncResult.type === 'success'
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200'
              }`}
            >
              {syncResult.message}
            </p>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && connectedBanks.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && connectedBanks.length === 0 && (
        <Card>
          <EmptyBankState onConnect={openPlaidLink} disabled={!linkReady} />
        </Card>
      )}

      {/* Connected Banks */}
      {connectedBanks.length > 0 && (
        <div className="space-y-4">
          {connectedBanks.map((bank) => (
            <ConnectedBankCard
              key={bank.itemId}
              bank={bank}
              onSync={handleSync}
              onDisconnect={handleDisconnect}
              isSyncing={syncingItemId === bank.itemId || isSyncing}
            />
          ))}
        </div>
      )}

      {/* Setup Instructions */}
      {!linkReady && !error && (
        <Card className="p-6 mt-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
            Server Setup Required
          </h3>
          <div className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
            <p>To connect bank accounts, you need to:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>
                Get Plaid API credentials from{' '}
                <a
                  href="https://dashboard.plaid.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  dashboard.plaid.com
                </a>
              </li>
              <li>
                Add credentials to <code className="bg-amber-100 dark:bg-amber-800 px-1 rounded">.env.local</code>:
                <pre className="mt-1 p-2 bg-amber-100 dark:bg-amber-800/50 rounded text-xs overflow-x-auto">
                  {`PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret
PLAID_ENV=sandbox`}
                </pre>
              </li>
              <li>Start the backend server:</li>
            </ol>
            <pre className="p-2 bg-amber-100 dark:bg-amber-800/50 rounded text-xs overflow-x-auto ml-2">
              cd server && npm run dev
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
}
