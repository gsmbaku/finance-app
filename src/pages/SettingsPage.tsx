import { useState, useEffect, useRef } from 'react';
import {
  Moon,
  Sun,
  Monitor,
  Download,
  Upload,
  Trash2,
  Database,
  Shield,
  Info,
} from 'lucide-react';
import { Card, CardHeader, CardContent, Button } from '@/components/ui';
import { exportData, importData, clearAllData, db } from '@/database/db';

type ThemeMode = 'light' | 'dark' | 'system';

function getThemeMode(): ThemeMode {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return 'system';
}

function applyTheme(mode: ThemeMode) {
  if (mode === 'system') {
    localStorage.removeItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
  } else {
    localStorage.setItem('theme', mode);
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }
}

export function SettingsPage() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getThemeMode);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [dataCounts, setDataCounts] = useState({ transactions: 0, budgets: 0, goals: 0, conversations: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadCounts() {
      const [transactions, budgets, goals, conversations] = await Promise.all([
        db.transactions.count(),
        db.budgets.count(),
        db.goals.count(),
        db.conversations.count(),
      ]);
      setDataCounts({ transactions, budgets, goals, conversations });
    }
    loadCounts();
  }, []);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    applyTheme(mode);
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const json = await exportData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fincoach-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showStatus('success', 'Data exported successfully.');
    } catch {
      showStatus('error', 'Failed to export data.');
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      const text = await file.text();
      await importData(text);

      const [transactions, budgets, goals, conversations] = await Promise.all([
        db.transactions.count(),
        db.budgets.count(),
        db.goals.count(),
        db.conversations.count(),
      ]);
      setDataCounts({ transactions, budgets, goals, conversations });
      showStatus('success', 'Data imported successfully. Refresh the page to see changes.');
    } catch {
      showStatus('error', 'Failed to import data. Make sure the file is a valid FinCoach backup.');
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearData = async () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }

    try {
      setClearing(true);
      await clearAllData();
      setDataCounts({ transactions: 0, budgets: 0, goals: 0, conversations: 0 });
      setConfirmClear(false);
      showStatus('success', 'All data has been cleared. Refresh the page to see changes.');
    } catch {
      showStatus('error', 'Failed to clear data.');
    } finally {
      setClearing(false);
    }
  };

  const themeOptions: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
    { mode: 'light', label: 'Light', icon: Sun },
    { mode: 'dark', label: 'Dark', icon: Moon },
    { mode: 'system', label: 'System', icon: Monitor },
  ];

  const totalRecords = dataCounts.transactions + dataCounts.budgets + dataCounts.goals + dataCounts.conversations;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-3xl">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your preferences and data.
        </p>
      </div>

      {/* Status message */}
      {statusMessage && (
        <div
          className={`p-3 rounded-lg text-sm font-medium ${
            statusMessage.type === 'success'
              ? 'bg-accent-50 text-accent-700 dark:bg-accent-900/20 dark:text-accent-400'
              : 'bg-expense-50 text-expense-700 dark:bg-expense-900/20 dark:text-expense-400'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Appearance */}
      <Card>
        <CardHeader title="Appearance" subtitle="Customize how FinCoach looks" />
        <CardContent>
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map(({ mode, label, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => handleThemeChange(mode)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                    themeMode === mode
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      themeMode === mode
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      themeMode === mode
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader title="Data Management" subtitle="Export, import, or clear your data" />
        <CardContent>
          <div className="space-y-6">
            {/* Data summary */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <Database className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {totalRecords} records stored locally
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {dataCounts.transactions} transactions, {dataCounts.budgets} budgets, {dataCounts.goals} goals, {dataCounts.conversations} conversations
                </p>
              </div>
            </div>

            {/* Export */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Export Data</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Download all your data as a JSON file
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={handleExport}
                disabled={exporting || totalRecords === 0}
              >
                {exporting ? 'Exporting...' : 'Export'}
              </Button>
            </div>

            {/* Import */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Import Data</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Restore from a FinCoach backup file
                </p>
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Upload className="w-4 h-4" />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={importing}
                >
                  {importing ? 'Importing...' : 'Import'}
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700" />

            {/* Clear data */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-expense-600 dark:text-expense-400">Clear All Data</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Permanently delete all your data. This cannot be undone.
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={handleClearData}
                disabled={clearing || totalRecords === 0}
              >
                {clearing ? 'Clearing...' : confirmClear ? 'Confirm Clear' : 'Clear Data'}
              </Button>
            </div>
            {confirmClear && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-expense-600 dark:text-expense-400">
                  Are you sure? This will delete everything.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmClear(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader title="Privacy & Security" subtitle="How your data is handled" />
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Local-first storage</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  All your financial data is stored in your browser's IndexedDB. Nothing is sent to a server unless you use the AI Coach or connect a bank account.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">AI Coach conversations</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  When you use the AI Coach, your financial context is sent to the Claude API for processing. Conversation history is stored locally.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader title="About" />
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">App</span>
              <span className="text-gray-900 dark:text-white font-medium">FinCoach</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Version</span>
              <span className="text-gray-900 dark:text-white font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Storage</span>
              <span className="text-gray-900 dark:text-white font-medium">IndexedDB (Browser)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
