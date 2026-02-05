import Anthropic from '@anthropic-ai/sdk';
import type { Message, ConversationContext } from '@/types';
import { getTransactionStats, getSpendingByCategory, getTransactions } from './transactionService';
import { getAllBudgetProgress } from './budgetService';
import { getGoalsByStatus } from './goalsService';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { formatCurrency } from '@/utils/formatters';

// Initialize Anthropic client
const getClient = () => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_ANTHROPIC_API_KEY is not set in environment variables');
  }
  return new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
};

// Build the system prompt with user context
function buildSystemPrompt(context: ConversationContext): string {
  const { currentMonth, recentTransactions, activeGoals, userProfile } = context;

  const budgetStatusText = Object.entries(currentMonth.budgetStatus)
    .map(([category, status]) =>
      `  - ${category}: ${formatCurrency(status.spent)} of ${formatCurrency(status.limit)} (${status.percentage.toFixed(0)}%)`
    )
    .join('\n') || '  No budgets set';

  const topCategoriesText = currentMonth.topCategories
    .slice(0, 5)
    .map((c) => `  - ${c.category}: ${formatCurrency(c.amount)} (${c.percentage.toFixed(1)}%)`)
    .join('\n') || '  No spending data';

  const recentTxText = recentTransactions
    .slice(0, 5)
    .map((t) => `  - ${t.merchant}: ${formatCurrency(t.amount)} (${t.category}) on ${format(new Date(t.date), 'MMM d')}`)
    .join('\n') || '  No recent transactions';

  const goalsText = activeGoals
    .map((g) => `  - ${g.name}: ${formatCurrency(g.currentAmount)} of ${formatCurrency(g.targetAmount)} (due ${format(new Date(g.deadline), 'MMM d, yyyy')})`)
    .join('\n') || '  No active goals';

  return `You are FinCoach, an AI-powered financial wellness coach designed to help users improve their spending habits, achieve financial goals, and build financial literacy.

PERSONALITY & TONE:
- Friendly, encouraging, and non-judgmental
- Enthusiastic about wins, constructive about setbacks
- Educational but not condescending
- Use occasional emojis sparingly for warmth (1-2 per message max)
- Adapt complexity to user's financial knowledge level: ${userProfile.financialKnowledge}

CORE CAPABILITIES:
1. Spending Analysis: Analyze transactions, identify patterns, spot anomalies
2. Budget Coaching: Help set realistic budgets, track progress, suggest adjustments
3. Goal Support: Break down financial goals, create action plans, celebrate milestones
4. Financial Education: Teach concepts in context, provide explanations
5. Behavioral Insights: Identify spending triggers, suggest habit changes

RESPONSE GUIDELINES:
- Keep responses concise (2-4 paragraphs unless detailed analysis requested)
- Always base insights on the actual user data provided below
- Provide specific, actionable recommendations with numbers when possible
- Ask clarifying questions when needed
- Celebrate progress and achievements
- Offer to dive deeper into any topic

CURRENT USER CONTEXT (${format(new Date(), 'MMMM yyyy')}):

Monthly Summary:
- Total Spent: ${formatCurrency(currentMonth.totalSpent)}
- Total Income: ${formatCurrency(currentMonth.totalIncome)}
- Net: ${formatCurrency(currentMonth.totalIncome - currentMonth.totalSpent)}

Budget Status:
${budgetStatusText}

Top Spending Categories:
${topCategoriesText}

Recent Transactions:
${recentTxText}

Active Goals:
${goalsText}

IMPORTANT LIMITATIONS:
- You're a coach, not a licensed financial advisor
- Don't provide specific investment advice, tax guidance, or legal counsel
- For complex financial planning, recommend consulting a certified financial planner
- Never make up data - only reference the actual numbers provided above
- If asked about data you don't have, acknowledge the limitation`;
}

// Build context from user's financial data
export async function buildConversationContext(): Promise<ConversationContext> {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Fetch all data in parallel
  const [stats, categorySpending, recentTx, budgetProgress, activeGoals] = await Promise.all([
    getTransactionStats(monthStart, monthEnd),
    getSpendingByCategory(monthStart, monthEnd),
    getTransactions({}).then((txs) => txs.slice(0, 10)),
    getAllBudgetProgress(),
    getGoalsByStatus('active'),
  ]);

  // Build budget status map
  const budgetStatus: ConversationContext['currentMonth']['budgetStatus'] = {};
  for (const bp of budgetProgress) {
    budgetStatus[bp.budget.category] = {
      spent: bp.spent,
      limit: bp.budget.monthlyLimit,
      percentage: bp.percentage,
    };
  }

  // Calculate category percentages
  const totalSpending = categorySpending.reduce((sum, c) => sum + c.amount, 0);
  const topCategories = categorySpending.map((c) => ({
    category: c.category,
    amount: c.amount,
    percentage: totalSpending > 0 ? (c.amount / totalSpending) * 100 : 0,
  }));

  return {
    currentMonth: {
      totalSpent: stats.totalExpenses,
      totalIncome: stats.totalIncome,
      budgetStatus,
      topCategories,
    },
    recentTransactions: recentTx.map((t) => ({
      merchant: t.merchant,
      amount: t.amount,
      category: t.category,
      date: t.date,
    })),
    activeGoals: activeGoals.map((g) => ({
      name: g.name,
      targetAmount: g.targetAmount,
      currentAmount: g.currentAmount,
      deadline: g.deadline,
    })),
    userProfile: {
      financialKnowledge: 'intermediate',
    },
  };
}

// Send a message to Claude and get a response
export async function sendMessage(
  userMessage: string,
  conversationHistory: Message[],
  context?: ConversationContext
): Promise<string> {
  const client = getClient();

  // Build context if not provided
  const ctx = context || await buildConversationContext();
  const systemPrompt = buildSystemPrompt(ctx);

  // Convert conversation history to Claude format
  const messages = conversationHistory
    .filter((m) => m.content.trim()) // Filter out empty messages
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

  // Add the new user message
  messages.push({
    role: 'user',
    content: userMessage,
  });

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    // Extract text content from response
    const textContent = response.content.find((block) => block.type === 'text');
    return textContent?.type === 'text' ? textContent.text : 'I apologize, but I was unable to generate a response.';
  } catch (error) {
    console.error('Error calling Claude API:', error);

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid API key. Please check your VITE_ANTHROPIC_API_KEY in .env.local');
      }
      if (error.message.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
    }

    throw new Error('Failed to get response from AI. Please try again.');
  }
}

// Stream a message response (for typing effect)
export async function streamMessage(
  userMessage: string,
  conversationHistory: Message[],
  onChunk: (chunk: string) => void,
  context?: ConversationContext
): Promise<string> {
  const client = getClient();

  const ctx = context || await buildConversationContext();
  const systemPrompt = buildSystemPrompt(ctx);

  const messages = conversationHistory
    .filter((m) => m.content.trim())
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

  messages.push({
    role: 'user',
    content: userMessage,
  });

  try {
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    let fullResponse = '';

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        const chunk = event.delta.text;
        fullResponse += chunk;
        onChunk(chunk);
      }
    }

    return fullResponse;
  } catch (error) {
    console.error('Error streaming from Claude API:', error);
    throw new Error('Failed to get response from AI. Please try again.');
  }
}

// Check if API key is configured
export function isApiKeyConfigured(): boolean {
  return Boolean(import.meta.env.VITE_ANTHROPIC_API_KEY);
}
