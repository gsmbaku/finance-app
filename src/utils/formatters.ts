import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns';

// Currency formatting
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCurrencyCompact(amount: number): string {
  if (Math.abs(amount) >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(amount) >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
}

// Percentage formatting
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

// Number formatting
export function formatNumber(value: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value);
}

// Date formatting
export function formatDate(date: Date | string, formatStr: string = 'MMM d, yyyy'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, formatStr);
}

export function formatDateRelative(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isToday(d)) {
    return `Today at ${format(d, 'h:mm a')}`;
  }

  if (isYesterday(d)) {
    return `Yesterday at ${format(d, 'h:mm a')}`;
  }

  if (isThisWeek(d)) {
    return format(d, "EEEE 'at' h:mm a");
  }

  if (isThisYear(d)) {
    return format(d, "MMM d 'at' h:mm a");
  }

  return format(d, "MMM d, yyyy 'at' h:mm a");
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isToday(d)) {
    return 'Today';
  }

  if (isYesterday(d)) {
    return 'Yesterday';
  }

  if (isThisYear(d)) {
    return format(d, 'MMM d');
  }

  return format(d, 'MMM d, yyyy');
}

export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

// Duration formatting
export function formatDaysRemaining(days: number): string {
  if (days < 0) {
    return `${Math.abs(days)} days overdue`;
  }
  if (days === 0) {
    return 'Due today';
  }
  if (days === 1) {
    return '1 day left';
  }
  if (days < 7) {
    return `${days} days left`;
  }
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} left`;
  }
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} left`;
}

// Merchant name cleanup
export function formatMerchantName(name: string): string {
  // Remove common suffixes and clean up
  return name
    .replace(/\s+#\d+$/, '') // Remove store numbers
    .replace(/\s+\d{5,}$/, '') // Remove long numbers
    .replace(/\*+/g, '') // Remove asterisks
    .trim();
}

// Transaction amount with sign
export function formatTransactionAmount(
  amount: number,
  type: 'expense' | 'income'
): string {
  const formatted = formatCurrency(Math.abs(amount));
  return type === 'expense' ? `-${formatted}` : `+${formatted}`;
}
