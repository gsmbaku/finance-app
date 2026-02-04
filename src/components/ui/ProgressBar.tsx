interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'auto';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const colorStyles = {
  primary: 'bg-primary-600',
  success: 'bg-accent-600',
  warning: 'bg-warning-500',
  danger: 'bg-expense-600',
};

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  color = 'auto',
  showLabel = false,
  label,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Auto color based on percentage
  const getAutoColor = () => {
    if (percentage >= 100) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  const barColor = color === 'auto' ? getAutoColor() : color;

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
          {showLabel && (
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`
          w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden
          ${sizeStyles[size]}
        `}
      >
        <div
          className={`
            ${sizeStyles[size]} rounded-full
            ${colorStyles[barColor]}
            ${animated ? 'transition-all duration-500 ease-out' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
