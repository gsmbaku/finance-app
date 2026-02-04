import { Building2, RefreshCw, Unlink, CreditCard, Wallet } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { formatCurrency } from '@/utils/formatters';
import type { ConnectedBank } from '@/hooks/useBankConnection';

interface ConnectedBankCardProps {
  bank: ConnectedBank;
  onSync: (itemId: string) => void;
  onDisconnect: (itemId: string) => void;
  isSyncing?: boolean;
}

export function ConnectedBankCard({
  bank,
  onSync,
  onDisconnect,
  isSyncing,
}: ConnectedBankCardProps) {
  const totalBalance = bank.accounts.reduce(
    (sum, acc) => sum + (acc.balances.current || 0),
    0
  );

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'depository':
        return <Wallet className="w-4 h-4" />;
      case 'credit':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <Building2 className="w-4 h-4" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {bank.institutionName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connected {bank.connectedAt.toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSync(bank.itemId)}
            disabled={isSyncing}
            leftIcon={
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            }
          >
            {isSyncing ? 'Syncing...' : 'Sync'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDisconnect(bank.itemId)}
            leftIcon={<Unlink className="w-4 h-4" />}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Disconnect
          </Button>
        </div>
      </div>

      {/* Accounts List */}
      <div className="space-y-3">
        {bank.accounts.map((account) => (
          <div
            key={account.account_id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-sm">
                {getAccountIcon(account.type)}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  {account.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {account.official_name || account.subtype} •••• {account.mask}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(account.balances.current || 0)}
              </p>
              {account.balances.available !== null &&
                account.balances.available !== account.balances.current && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatCurrency(account.balances.available)} available
                  </p>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* Total Balance */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Total Balance
        </span>
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          {formatCurrency(totalBalance)}
        </span>
      </div>
    </Card>
  );
}
