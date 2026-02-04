import {
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Zap,
  Film,
  Heart,
  GraduationCap,
  Briefcase,
  Gift,
  Plane,
  CreditCard,
  PiggyBank,
  DollarSign,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  subcategories?: string[];
}

export const EXPENSE_CATEGORIES: Category[] = [
  {
    id: 'food_dining',
    name: 'Food & Dining',
    icon: Utensils,
    color: '#f97316', // orange
    subcategories: ['Groceries', 'Restaurants', 'Coffee', 'Fast Food', 'Delivery'],
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: ShoppingBag,
    color: '#ec4899', // pink
    subcategories: ['Clothing', 'Electronics', 'Home Goods', 'Personal Care', 'Online Shopping'],
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: Car,
    color: '#3b82f6', // blue
    subcategories: ['Gas', 'Public Transit', 'Uber/Lyft', 'Parking', 'Car Maintenance'],
  },
  {
    id: 'housing',
    name: 'Housing',
    icon: Home,
    color: '#8b5cf6', // purple
    subcategories: ['Rent', 'Mortgage', 'Insurance', 'Repairs', 'Furniture'],
  },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: Zap,
    color: '#eab308', // yellow
    subcategories: ['Electric', 'Gas', 'Water', 'Internet', 'Phone'],
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: Film,
    color: '#06b6d4', // cyan
    subcategories: ['Movies', 'Games', 'Streaming', 'Events', 'Hobbies'],
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: Heart,
    color: '#ef4444', // red
    subcategories: ['Medical', 'Pharmacy', 'Gym', 'Mental Health', 'Vision/Dental'],
  },
  {
    id: 'education',
    name: 'Education',
    icon: GraduationCap,
    color: '#10b981', // green
    subcategories: ['Tuition', 'Books', 'Courses', 'Supplies', 'Student Loans'],
  },
  {
    id: 'work',
    name: 'Work & Business',
    icon: Briefcase,
    color: '#6366f1', // indigo
    subcategories: ['Office Supplies', 'Software', 'Equipment', 'Professional Services'],
  },
  {
    id: 'gifts',
    name: 'Gifts & Donations',
    icon: Gift,
    color: '#f43f5e', // rose
    subcategories: ['Gifts', 'Charity', 'Donations'],
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: Plane,
    color: '#0ea5e9', // sky
    subcategories: ['Flights', 'Hotels', 'Vacation', 'Travel Insurance'],
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions',
    icon: CreditCard,
    color: '#a855f7', // purple
    subcategories: ['Streaming', 'Software', 'Memberships', 'News/Media'],
  },
  {
    id: 'other',
    name: 'Other',
    icon: MoreHorizontal,
    color: '#6b7280', // gray
    subcategories: ['Miscellaneous'],
  },
];

export const INCOME_CATEGORIES: Category[] = [
  {
    id: 'salary',
    name: 'Salary',
    icon: Briefcase,
    color: '#10b981',
    subcategories: ['Regular Pay', 'Bonus', 'Commission'],
  },
  {
    id: 'freelance',
    name: 'Freelance',
    icon: DollarSign,
    color: '#3b82f6',
    subcategories: ['Consulting', 'Gig Work', 'Side Projects'],
  },
  {
    id: 'investments',
    name: 'Investments',
    icon: PiggyBank,
    color: '#8b5cf6',
    subcategories: ['Dividends', 'Interest', 'Capital Gains'],
  },
  {
    id: 'gifts_income',
    name: 'Gifts',
    icon: Gift,
    color: '#f43f5e',
    subcategories: ['Family', 'Friends', 'Other'],
  },
  {
    id: 'other_income',
    name: 'Other Income',
    icon: MoreHorizontal,
    color: '#6b7280',
    subcategories: ['Refunds', 'Reimbursements', 'Miscellaneous'],
  },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function getCategoryById(id: string): Category | undefined {
  return ALL_CATEGORIES.find((cat) => cat.id === id);
}

export function getCategoryColor(categoryId: string): string {
  const category = getCategoryById(categoryId);
  return category?.color || '#6b7280';
}

export function getCategoryIcon(categoryId: string): LucideIcon {
  const category = getCategoryById(categoryId);
  return category?.icon || MoreHorizontal;
}

export const GOAL_CATEGORIES = [
  'Emergency Fund',
  'Vacation',
  'Major Purchase',
  'Debt Payoff',
  'Investment',
  'Education',
  'Home',
  'Vehicle',
  'Retirement',
  'Other',
];
