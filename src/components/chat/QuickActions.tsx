interface QuickActionsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

const quickPrompts = [
  {
    label: 'Monthly summary',
    prompt: "How am I doing this month? Give me a summary of my spending and any insights.",
  },
  {
    label: 'Budget help',
    prompt: "Can you help me understand my budget situation? Which areas need attention?",
  },
  {
    label: 'Spending patterns',
    prompt: "What patterns do you see in my spending? Are there any areas where I could cut back?",
  },
  {
    label: 'Savings tips',
    prompt: "Based on my spending, what are some practical ways I could save more money?",
  },
];

export function QuickActions({ onSelect, disabled = false }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {quickPrompts.map((item) => (
        <button
          key={item.label}
          onClick={() => onSelect(item.prompt)}
          disabled={disabled}
          className="px-3 py-1.5 text-sm rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
