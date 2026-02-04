import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui';

interface PlaidLinkButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function PlaidLinkButton({
  onClick,
  disabled,
  isLoading,
}: PlaidLinkButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      leftIcon={isLoading ? undefined : <Plus className="w-5 h-5" />}
      className="gap-2"
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Connecting...
        </>
      ) : (
        'Connect Bank Account'
      )}
    </Button>
  );
}

export function EmptyBankState({
  onConnect,
  disabled,
}: {
  onConnect: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="text-center py-12 px-4">
      <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Building2 className="w-8 h-8 text-primary-600 dark:text-primary-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Connect Your Bank
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
        Link your bank accounts to automatically import transactions and get a complete
        view of your finances.
      </p>
      <PlaidLinkButton onClick={onConnect} disabled={disabled} />
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
        Powered by Plaid. Your credentials are never stored by FinCoach.
      </p>
    </div>
  );
}
