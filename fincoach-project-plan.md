# FinCoach: AI-Powered Financial Wellness Coach
## Complete Execution Plan for Claude Code

---

## 🎯 Project Overview

**Project Name:** FinCoach  
**Goal:** Build an AI-powered conversational financial assistant that helps you understand spending, build better habits, achieve savings goals, and learn financial literacy  
**Tech Stack:** React + TypeScript, Claude API, TensorFlow.js, IndexedDB, Tailwind CSS  
**Timeline:** 12-16 weeks (part-time, grad school compatible)  
**Portfolio Value:** Showcases AI/ML, full-stack development, UX design for MSAI program

---

## 📋 Project Structure

```
fincoach/
├── frontend/                  # React + TypeScript app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat/
│   │   │   │   ├── ChatInterface.tsx
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   ├── InputBar.tsx
│   │   │   │   └── TypingIndicator.tsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── SpendingOverview.tsx
│   │   │   │   ├── BudgetProgress.tsx
│   │   │   │   ├── GoalTracker.tsx
│   │   │   │   └── QuickStats.tsx
│   │   │   ├── Transactions/
│   │   │   │   ├── TransactionList.tsx
│   │   │   │   ├── TransactionForm.tsx
│   │   │   │   ├── CategoryPicker.tsx
│   │   │   │   └── TransactionFilters.tsx
│   │   │   ├── Analytics/
│   │   │   │   ├── SpendingChart.tsx
│   │   │   │   ├── TrendAnalysis.tsx
│   │   │   │   ├── InsightsPanel.tsx
│   │   │   │   └── PatternVisualizer.tsx
│   │   │   ├── Budget/
│   │   │   │   ├── BudgetSetup.tsx
│   │   │   │   ├── CategoryBudget.tsx
│   │   │   │   └── BudgetAlerts.tsx
│   │   │   ├── Goals/
│   │   │   │   ├── GoalCreator.tsx
│   │   │   │   ├── GoalCard.tsx
│   │   │   │   └── ProgressTracker.tsx
│   │   │   └── Education/
│   │   │       ├── LearningModule.tsx
│   │   │       ├── Quiz.tsx
│   │   │       └── ResourceLibrary.tsx
│   │   ├── services/
│   │   │   ├── aiService.ts           # Claude API integration
│   │   │   ├── mlService.ts           # TensorFlow.js models
│   │   │   ├── transactionService.ts  # Transaction CRUD
│   │   │   ├── budgetService.ts       # Budget management
│   │   │   ├── goalService.ts         # Goal tracking
│   │   │   ├── analyticsService.ts    # Data analysis
│   │   │   └── educationService.ts    # Learning content
│   │   ├── models/
│   │   │   ├── categorization/
│   │   │   │   ├── categoryModel.ts
│   │   │   │   └── trainCategorizer.ts
│   │   │   ├── prediction/
│   │   │   │   ├── spendingPredictor.ts
│   │   │   │   └── budgetForecaster.ts
│   │   │   └── analysis/
│   │   │       ├── patternDetector.ts
│   │   │       ├── triggerAnalyzer.ts
│   │   │       └── personalityProfile.ts
│   │   ├── database/
│   │   │   ├── db.ts                  # IndexedDB setup
│   │   │   ├── schema.ts              # Database schema
│   │   │   └── migrations.ts          # Version management
│   │   ├── utils/
│   │   │   ├── nlp.ts                 # Text processing
│   │   │   ├── insights.ts            # Financial calculations
│   │   │   ├── formatters.ts          # Currency, date formatting
│   │   │   └── validators.ts          # Input validation
│   │   ├── types/
│   │   │   ├── transaction.ts
│   │   │   ├── budget.ts
│   │   │   ├── goal.ts
│   │   │   └── conversation.ts
│   │   ├── hooks/
│   │   │   ├── useTransactions.ts
│   │   │   ├── useBudget.ts
│   │   │   ├── useGoals.ts
│   │   │   ├── useChat.ts
│   │   │   └── useAnalytics.ts
│   │   ├── context/
│   │   │   ├── AppContext.tsx
│   │   │   └── ChatContext.tsx
│   │   └── App.tsx
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── ml-service/                # Optional Python microservice
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   │   ├── categorizer.py
│   │   │   ├── predictor.py
│   │   │   └── analyzer.py
│   │   └── utils/
│   ├── requirements.txt
│   └── Dockerfile
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── PROMPTS.md             # Claude prompt templates
└── README.md
```

---

## 🚀 Phase 1: Foundation & MVP (Weeks 1-3)

### **Week 1: Project Setup & Core Infrastructure**

#### Day 1-2: Initialize Project
```bash
# Claude Code Tasks:
1. Create React + TypeScript + Vite project
2. Install dependencies:
   - react, react-dom, react-router-dom
   - tailwindcss, @headlessui/react, lucide-react
   - dexie (IndexedDB wrapper)
   - date-fns (date utilities)
   - recharts (visualizations)
   - @anthropic-ai/sdk
   - zod (validation)
3. Set up Tailwind CSS configuration
4. Create folder structure as outlined above
5. Set up ESLint + Prettier
6. Initialize Git repository
```

**Prompt for Claude Code:**
```
Create a new React + TypeScript project using Vite for FinCoach, an AI-powered 
financial wellness coach. Set up:
1. Tailwind CSS with a financial/professional color scheme (blues, greens)
2. Project folder structure as specified in the plan
3. TypeScript strict mode configuration
4. Basic routing structure (Dashboard, Chat, Transactions, Analytics, Goals)
5. Dark mode support
```

#### Day 3-4: Database Schema & Services
```typescript
// Define database schema
interface Transaction {
  id: string;
  amount: number;
  category: string;
  subcategory?: string;
  description: string;
  merchant: string;
  date: Date;
  type: 'expense' | 'income';
  paymentMethod: string;
  tags: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Budget {
  id: string;
  category: string;
  monthlyLimit: number;
  currentSpending: number;
  alertThreshold: number; // percentage
  rollover: boolean;
  createdAt: Date;
}

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  priority: 'high' | 'medium' | 'low';
  category: string;
  motivations: string[];
  createdAt: Date;
}

interface Conversation {
  id: string;
  messages: Message[];
  context: ConversationContext;
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    transactionIds?: string[];
    insightGenerated?: boolean;
    actionTaken?: string;
  };
}
```

**Claude Code Task:**
```
Create the complete IndexedDB schema using Dexie.js with:
1. Transactions, Budgets, Goals, Conversations tables
2. Indexes for efficient querying (date, category, merchant)
3. CRUD service functions for each entity
4. Migration system for schema updates
5. Data export/import functionality (JSON)
```

#### Day 5-7: Basic UI Components
**Claude Code Tasks:**
1. Create reusable UI components library:
   - Button, Input, Card, Modal, Alert components
   - Layout components (Header, Sidebar, Footer)
2. Build Dashboard skeleton with placeholder data
3. Create Transaction form with category selection
4. Set up routing between pages
5. Implement responsive design (mobile-first)

---

### **Week 2: Transaction Management & Budgeting**

#### Day 1-3: Transaction Features
**Claude Code Tasks:**
```
Build complete transaction management system:
1. TransactionForm component:
   - Amount input with currency formatting
   - Category/subcategory hierarchical picker
   - Merchant autocomplete (learns from history)
   - Date picker (defaults to today)
   - Notes/tags field
   - Quick-add mode for rapid entry

2. TransactionList component:
   - Sortable table view
   - Filter by date range, category, merchant
   - Search functionality
   - Edit/delete actions
   - Bulk operations (categorize multiple)

3. Transaction service:
   - CRUD operations
   - Validation logic
   - Category suggestions based on description
   - Duplicate detection
   - Statistics calculations (totals, averages)
```

#### Day 4-5: Budget System
**Claude Code Tasks:**
```
Create budgeting system:
1. BudgetSetup wizard:
   - Category selection (predefined + custom)
   - Monthly limit setting
   - Alert threshold configuration
   - Rollover rules

2. BudgetProgress component:
   - Visual progress bars for each category
   - Color-coded status (green/yellow/red)
   - Remaining amount display
   - Trend indicators (up/down from last month)

3. Budget service:
   - Calculate current spending per category
   - Check if over/under budget
   - Generate budget alerts
   - Monthly budget reset logic
```

#### Day 6-7: Dashboard & Visualizations
**Claude Code Tasks:**
```
Build analytics dashboard:
1. SpendingOverview:
   - Monthly spending trend (line chart)
   - Category breakdown (pie/donut chart)
   - Income vs Expenses (bar chart)
   - Top merchants (list with totals)

2. QuickStats cards:
   - Total spent this month
   - Budget adherence percentage
   - Largest transaction
   - Days until next paycheck

3. Use Recharts for all visualizations
4. Make charts interactive (click to filter)
5. Export chart data to CSV
```

---

### **Week 3: Claude AI Integration - Chat Interface**

#### Day 1-3: AI Service Setup
**Claude Code Tasks:**
```
Set up Claude API integration:
1. Create aiService.ts with:
   - API key management (env variables)
   - Conversation history tracking
   - Context building from user data
   - Streaming response support
   - Error handling & retries
   - Rate limiting logic

2. Design conversation context structure:
   interface ConversationContext {
     userId: string;
     currentMonth: {
       totalSpent: number;
       budgetStatus: Record<string, BudgetStatus>;
       topCategories: CategorySpending[];
     };
     recentTransactions: Transaction[];
     activeGoals: Goal[];
     spendingPatterns: Pattern[];
     userProfile: {
       riskTolerance: string;
       spendingPersonality: string;
       financialKnowledge: 'beginner' | 'intermediate' | 'advanced';
     };
   }

3. Create system prompt template:
   - Define FinCoach personality
   - Set financial literacy education focus
   - Specify response format guidelines
   - Include safety guardrails
```

**System Prompt Template:**
```typescript
const FINCOACH_SYSTEM_PROMPT = `
You are FinCoach, an AI-powered financial wellness coach designed to help users 
improve their spending habits, achieve financial goals, and build financial literacy.

PERSONALITY & TONE:
- Friendly, encouraging, and non-judgmental
- Enthusiastic about wins, constructive about setbacks
- Educational but not condescending
- Use emojis sparingly for warmth (💰 📊 🎯)
- Adapt complexity to user's financial knowledge level

CORE CAPABILITIES:
1. Spending Analysis: Analyze transactions, identify patterns, spot anomalies
2. Budget Coaching: Help set realistic budgets, track progress, suggest adjustments
3. Goal Support: Break down financial goals, create action plans, celebrate milestones
4. Financial Education: Teach concepts in context, provide explanations, recommend resources
5. Behavioral Insights: Identify spending triggers, suggest habit changes

RESPONSE GUIDELINES:
- Keep responses concise (2-4 paragraphs unless detailed analysis requested)
- Always base insights on actual user data when available
- Provide specific, actionable recommendations
- Ask clarifying questions when needed
- Celebrate progress and achievements
- Offer to dive deeper into any topic

CURRENT USER CONTEXT:
{context}

Remember: You're a coach, not a financial advisor. Don't provide specific 
investment advice, tax guidance, or legal counsel. For complex financial 
planning, recommend consulting a certified financial planner.
`;
```

#### Day 4-5: Chat Interface
**Claude Code Tasks:**
```
Build conversational UI:
1. ChatInterface component:
   - Message list with auto-scroll
   - User/assistant message bubbles (different styles)
   - Typing indicator during API calls
   - Timestamp display
   - Message reactions (👍 👎 for feedback)

2. InputBar component:
   - Textarea with auto-resize
   - Send button + Enter-to-send
   - Character counter
   - Quick action buttons:
     - "Analyze this month"
     - "Set a goal"
     - "Explain my spending"
     - "Budget help"
   - Voice input support (later phase)

3. Suggested prompts:
   - Display contextual suggestions based on current state
   - Examples:
     - "I just added a big expense, what does this mean for my budget?"
     - "Help me understand why I overspend on weekends"
     - "Create a plan to save $1000 in 3 months"

4. Chat persistence:
   - Save conversations to IndexedDB
   - Load conversation history
   - Start new conversation
   - Delete conversations
```

#### Day 6-7: Conversational Features
**Claude Code Tasks:**
```
Implement intelligent chat features:
1. Context-aware responses:
   - Inject relevant transaction data into prompts
   - Reference budget status automatically
   - Include recent insights
   - Track conversation flow

2. Action execution:
   - Parse user intents (add transaction, set budget, etc.)
   - Execute actions from chat
   - Confirm actions with user
   - Examples:
     - "Add a $45 grocery expense" → creates transaction
     - "Set my food budget to $400" → updates budget
     - "Show me my coffee spending" → displays filtered transactions

3. Smart suggestions:
   - Analyze user query
   - Suggest follow-up questions
   - Recommend relevant analyses
   - Provide learning resources

4. Conversation memory:
   - Remember preferences mentioned in chat
   - Reference previous conversations
   - Build user profile over time
```

---

## 🧠 Phase 2: Machine Learning Intelligence (Weeks 4-7)

### **Week 4: Transaction Categorization ML**

#### Day 1-3: Training Data & Model
**Claude Code Tasks:**
```
Build ML categorization system:
1. Create training dataset:
   - Collect sample transactions with labels
   - Format: { description: string, category: string }
   - Include common merchants (Starbucks → Food & Dining → Coffee)
   - Add variations (typos, abbreviations)
   - Generate 500+ examples across all categories

2. Implement TensorFlow.js model:
   // categoryModel.ts
   import * as tf from '@tensorflow/tfjs';
   
   interface TrainingExample {
     description: string;
     category: string;
   }
   
   class TransactionCategorizer {
     private model: tf.LayersModel;
     private tokenizer: Tokenizer;
     private categories: string[];
     
     async train(examples: TrainingExample[]) {
       // Tokenize descriptions
       // Create embeddings
       // Train simple neural network
       // Save model to IndexedDB
     }
     
     async predict(description: string): Promise<{
       category: string;
       confidence: number;
       alternatives: Array<{ category: string; confidence: number }>;
     }> {
       // Tokenize input
       // Run prediction
       // Return top 3 predictions with confidence scores
     }
     
     async retrain(feedback: TrainingExample[]) {
       // Incorporate user corrections
       // Fine-tune model
     }
   }

3. Features to extract:
   - Keywords (coffee, grocery, gas, restaurant)
   - Merchant patterns
   - Amount ranges (coffee usually $3-8)
   - Time patterns (lunch vs dinner amounts)
   - Day of week
```

#### Day 4-5: Integration & Learning
**Claude Code Tasks:**
```
Integrate ML categorization:
1. Auto-categorize on transaction creation:
   - Run prediction
   - Pre-fill category with top prediction
   - Show alternatives as suggestions
   - Allow user to override

2. Learning from corrections:
   - Track when user changes category
   - Store as training example
   - Periodically retrain model (weekly)
   - Show improvement metrics

3. Confidence-based UX:
   - High confidence (>80%): Auto-categorize
   - Medium (50-80%): Suggest with "Is this correct?"
   - Low (<50%): Show top 3 options
```

#### Day 6-7: Merchant Intelligence
**Claude Code Tasks:**
```
Build merchant learning system:
1. Merchant database:
   - Track unique merchants from transactions
   - Learn typical categories
   - Calculate average transaction amounts
   - Identify visit frequency

2. Smart autocomplete:
   - Suggest merchants as user types
   - Show last transaction details
   - Pre-fill category and amount based on history

3. Merchant insights:
   - "You visit Starbucks 4x/week, averaging $5.50"
   - "Target purchases are usually $50-100"
   - "Most grocery shopping on Sundays"
```

---

### **Week 5: Spending Pattern Detection**

#### Day 1-3: Pattern Detection Algorithms
**Claude Code Tasks:**
```
Implement pattern analysis:
1. Time-based patterns:
   class TimePatternDetector {
     analyzeByDayOfWeek(transactions: Transaction[]) {
       // Calculate spending by day
       // Identify high-spend days
       // Detect weekly cycles
       return {
         highestDay: string;
         lowestDay: string;
         weekendVsWeekday: number;
         patterns: Pattern[];
       };
     }
     
     analyzeByTimeOfDay(transactions: Transaction[]) {
       // Morning, afternoon, evening spending
       // Late-night transactions (impulse?)
       // Lunch hour patterns
     }
     
     analyzeByMonthPeriod(transactions: Transaction[]) {
       // Beginning vs end of month
       // Payday correlation
       // Bill payment cycles
     }
   }

2. Category patterns:
   - Calculate category percentages
   - Identify growing/shrinking categories
   - Spot unusual category spikes
   - Compare to previous months

3. Trigger detection:
   - Stress spending (exam weeks for students)
   - Social spending (friend gatherings)
   - Seasonal patterns (holidays)
   - Location-based (near campus vs off-campus)
```

#### Day 4-5: Anomaly Detection
**Claude Code Tasks:**
```
Build anomaly detection:
1. Statistical outliers:
   - Calculate mean and std dev per category
   - Flag transactions >2 std dev from mean
   - Identify unusual merchants
   - Detect duplicate transactions

2. Behavioral anomalies:
   - Spending at unusual times
   - Uncharacteristic categories
   - Rapid succession of purchases
   - Large transactions without history

3. Budget anomalies:
   - Pace tracking: "You're 75% through budget with 10 days left"
   - Category explosions: "Dining up 200% from last month"
   - Silent categories: "No transportation spending this month"
```

#### Day 6-7: Insight Generation
**Claude Code Tasks:**
```
Create insights engine:
1. Automated insights:
   interface Insight {
     id: string;
     type: 'pattern' | 'anomaly' | 'opportunity' | 'achievement';
     severity: 'info' | 'warning' | 'critical';
     title: string;
     description: string;
     actionable: boolean;
     suggestedAction?: string;
     relatedData: any;
     createdAt: Date;
   }
   
   class InsightGenerator {
     generateDailyInsights() {
       // Run all detection algorithms
       // Rank insights by importance
       // Return top 5-10 insights
     }
     
     generateWeeklyReport() {
       // Summary of the week
       // Compare to previous week
       // Highlight wins and areas to improve
     }
   }

2. Insight templates:
   - "💰 Great job! You're $50 under budget in Dining this month"
   - "⚠️ Warning: You've spent $280 of $300 dining budget with 12 days left"
   - "📊 Pattern detected: You spend 3x more on Fridays than other weekdays"
   - "🎯 Opportunity: Switching to meal prep could save $160/month"
   - "🏆 Achievement unlocked: 3 months of staying under budget!"
```

---

### **Week 6: Predictive Models**

#### Day 1-3: Spending Prediction
**Claude Code Tasks:**
```
Build forecasting models:
1. Monthly spending predictor:
   class SpendingPredictor {
     predictMonthEnd(
       currentDate: Date,
       monthToDateTransactions: Transaction[]
     ): Prediction {
       // Calculate daily average
       // Account for known upcoming expenses
       // Factor in historical patterns
       // Consider day-of-month trends
       
       return {
         predictedTotal: number;
         confidence: number;
         breakdown: Record<string, number>;
         budgetStatus: 'under' | 'on-track' | 'over';
         daysRemaining: number;
       };
     }
   }

2. Category forecasting:
   - Predict per-category spending
   - Identify categories likely to go over
   - Estimate remaining budget at current pace
   - Calculate recommended daily spending

3. Alert system:
   - "At this pace, you'll exceed dining budget by $80"
   - "You have $15/day left for discretionary spending"
   - "Warning: High spending detected - adjust or exceed by month-end"
```

#### Day 4-5: Goal Progress Prediction
**Claude Code Tasks:**
```
Build goal prediction engine:
1. Goal feasibility analysis:
   class GoalPredictor {
     analyzeFeasibility(goal: Goal): FeasibilityReport {
       // Current savings rate
       // Time remaining
       // Required monthly savings
       // Budget flexibility
       
       return {
         achievable: boolean;
         confidence: number;
         requiredMonthlySavings: number;
         currentPace: number;
         gap: number;
         recommendations: string[];
         milestones: Milestone[];
       };
     }
   }

2. Savings recommendations:
   - Identify categories to cut
   - Calculate impact of changes
   - Suggest specific actions
   - Create automated savings rules

3. Progress tracking:
   - Weekly progress updates
   - Milestone celebrations
   - Pace adjustments
   - Risk alerts (falling behind)
```

#### Day 6-7: Behavioral Prediction
**Claude Code Tasks:**
```
Build behavior models:
1. Trigger prediction:
   - Learn what triggers overspending
   - Predict high-risk situations
   - Provide preventive alerts
   - Suggest coping strategies
   
2. Success prediction:
   - Predict likelihood of meeting budgets
   - Identify success factors
   - Recommend behavioral changes
   - Track improvement over time

3. Personalization:
   - Build user spending profile
   - Adapt predictions to individual patterns
   - Learn from user feedback
   - Improve accuracy over time
```

---

### **Week 7: Financial Education System**

#### Day 1-3: Content Library
**Claude Code Tasks:**
```
Create educational content system:
1. Learning modules:
   interface LearningModule {
     id: string;
     title: string;
     category: 'budgeting' | 'saving' | 'investing' | 'debt' | 'credit';
     level: 'beginner' | 'intermediate' | 'advanced';
     estimatedTime: number; // minutes
     sections: Section[];
     quiz?: Quiz;
     resources: Resource[];
   }
   
   const MODULES = [
     {
       id: 'budgeting-101',
       title: 'Budgeting Fundamentals',
       sections: [
         { title: '50/30/20 Rule', content: '...', examples: [...] },
         { title: 'Zero-Based Budgeting', content: '...', examples: [...] },
         { title: 'Envelope Method', content: '...', examples: [...] },
       ]
     },
     // ... more modules
   ];

2. Content topics:
   - Budgeting strategies (50/30/20, zero-based, envelope)
   - Emergency fund building
   - Debt payoff strategies (avalanche, snowball)
   - Credit score basics
   - Student loan management
   - Investing fundamentals (index funds, 401k)
   - Tax basics for students
   - Negotiating bills
   - Side income strategies

3. Interactive elements:
   - Calculators (emergency fund, debt payoff, compound interest)
   - Quizzes to test understanding
   - Real-world scenarios
   - Action checklists
```

#### Day 4-5: Contextual Learning
**Claude Code Tasks:**
```
Integrate education with usage:
1. Just-in-time learning:
   - User adds large expense → "Want to learn about emergency funds?"
   - Budget exceeded → "Learn strategies to stay on track"
   - Setting first goal → "Goal-setting best practices"
   - Credit card payment → "Understanding credit scores"

2. AI-powered teaching:
   - Claude explains concepts conversationally
   - Tailored to user's situation
   - Uses user's actual data as examples
   - Answers follow-up questions
   - Progressive disclosure (basic → advanced)

3. Learning paths:
   - Beginner track (budgeting basics)
   - Intermediate track (saving & investing)
   - Advanced track (tax optimization, wealth building)
   - Track progress through modules
   - Earn badges for completion
```

#### Day 6-7: Gamification & Motivation
**Claude Code Tasks:**
```
Add motivational features:
1. Achievement system:
   - First budget created
   - 7-day tracking streak
   - Stay under budget for a month
   - Reach first savings goal
   - 100 transactions logged
   - Learn 5 modules

2. Progress visualization:
   - Financial health score (0-100)
   - Budget adherence percentage
   - Savings rate trend
   - Goal completion percentage
   - Learning progress

3. Accountability features:
   - Weekly check-ins
   - Monthly reviews
   - Goal reminders
   - Budget alerts
   - Celebration of wins
```

---

## ⚡ Phase 3: Advanced Features (Weeks 8-11)

### **Week 8: Receipt Scanning & OCR**

**Claude Code Tasks:**
```
Implement receipt processing:
1. Camera integration:
   - Use device camera API
   - Image capture interface
   - Preview before processing

2. OCR using Tesseract.js:
   import Tesseract from 'tesseract.js';
   
   class ReceiptProcessor {
     async processReceipt(image: File): Promise<Transaction> {
       // Extract text from image
       const { data: { text } } = await Tesseract.recognize(image);
       
       // Parse receipt data
       const parsed = this.parseReceipt(text);
       
       // Return transaction object
       return {
         merchant: parsed.merchant,
         amount: parsed.total,
         date: parsed.date,
         items: parsed.lineItems,
         category: await this.categorize(parsed.merchant)
       };
     }
     
     parseReceipt(text: string) {
       // Extract merchant name (usually at top)
       // Find total amount (keywords: total, amount due)
       // Extract date
       // Parse line items
       // Handle various receipt formats
     }
   }

3. User experience:
   - Scan receipt flow
   - Confirmation screen (edit before saving)
   - Image storage for reference
   - Bulk scanning mode
```

---

### **Week 9: Voice Interface**

**Claude Code Tasks:**
```
Add voice capabilities:
1. Speech-to-text:
   - Use Web Speech API
   - Real-time transcription
   - Voice command parsing
   - Examples:
     - "Add a $50 grocery expense"
     - "How much have I spent on food this month?"
     - "Show my budget status"

2. Text-to-speech:
   - Read out FinCoach responses
   - Configurable voice
   - Speak alerts and notifications

3. Voice-first UX:
   - Push-to-talk button
   - Hands-free mode
   - Voice shortcuts
   - Confirmation prompts
```

---

### **Week 10: Bank Integration (Optional)**

**Claude Code Tasks:**
```
Integrate Plaid for bank connections:
1. Plaid Link setup:
   - Create Plaid developer account
   - Implement OAuth flow
   - Handle bank authentication
   - Manage access tokens securely

2. Transaction sync:
   - Fetch transactions from connected accounts
   - Auto-categorize using ML
   - Detect duplicates
   - Mark as verified vs manual

3. Account aggregation:
   - Show balances across accounts
   - Net worth calculation
   - Cash flow tracking
   - Account-specific insights

Note: This is optional for MVP. Manual entry works fine initially.
```

---

### **Week 11: Cloud Sync & Mobile PWA**

**Claude Code Tasks:**
```
Add cloud features:
1. Supabase integration:
   - Set up authentication
   - Create database schema
   - Implement real-time sync
   - Conflict resolution

2. PWA capabilities:
   - Service worker for offline mode
   - App manifest
   - Install prompts
   - Push notifications
   - Background sync

3. Cross-device sync:
   - Sync transactions, budgets, goals
   - Preserve conversation history
   - Merge data from multiple devices
   - Handle offline edits
```

---

## 🎨 Phase 4: Polish & Launch (Weeks 12-14)

### **Week 12: UI/UX Refinement**

**Claude Code Tasks:**
```
Polish the interface:
1. Design improvements:
   - Consistent spacing and typography
   - Smooth animations and transitions
   - Loading states and skeletons
   - Empty states with helpful prompts
   - Error states with recovery options

2. Responsive design:
   - Mobile-first optimization
   - Tablet layout
   - Desktop multi-column layout
   - Touch-friendly controls

3. Accessibility:
   - Keyboard navigation
   - Screen reader support
   - Color contrast (WCAG AA)
   - Focus indicators
   - Alt text for images
```

---

### **Week 13: Testing & Documentation**

**Claude Code Tasks:**
```
Comprehensive testing:
1. Unit tests:
   - Service functions
   - ML model predictions
   - Calculation utilities
   - Data validation

2. Integration tests:
   - Database operations
   - API calls
   - Component interactions

3. E2E tests:
   - User workflows
   - Chat conversations
   - Transaction management
   - Budget setup

4. Documentation:
   - README with setup instructions
   - API documentation
   - User guide
   - Architecture diagrams
   - Deployment guide
```

---

### **Week 14: Deployment & Portfolio**

**Claude Code Tasks:**
```
Deploy and showcase:
1. Production build:
   - Optimize bundle size
   - Configure caching
   - Set up CDN
   - Environment variables

2. Deployment:
   - Vercel/Netlify hosting
   - Custom domain (optional)
   - Analytics setup
   - Error tracking (Sentry)

3. Portfolio presentation:
   - Project showcase page
   - Demo video
   - Screenshots
   - Technical write-up
   - Blog post about ML/AI aspects

4. GitHub:
   - Clean commit history
   - Comprehensive README
   - License
   - Contributing guidelines
   - Issue templates
```

---

## 🔧 Technical Implementation Details

### **Environment Variables**
```env
# .env.local
VITE_ANTHROPIC_API_KEY=your_key_here
VITE_PLAID_CLIENT_ID=your_client_id (optional)
VITE_PLAID_SECRET=your_secret (optional)
VITE_SUPABASE_URL=your_url (optional)
VITE_SUPABASE_ANON_KEY=your_key (optional)
```

### **Key Dependencies**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@anthropic-ai/sdk": "^0.9.0",
    "dexie": "^3.2.4",
    "dexie-react-hooks": "^1.1.7",
    "@tensorflow/tfjs": "^4.15.0",
    "date-fns": "^2.30.0",
    "recharts": "^2.10.0",
    "zod": "^3.22.4",
    "lucide-react": "^0.294.0",
    "@headlessui/react": "^1.7.17",
    "tesseract.js": "^5.0.3",
    "react-hook-form": "^7.48.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.42",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.2",
    "vite": "^5.0.5",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "eslint": "^8.54.0",
    "prettier": "^3.1.0",
    "vitest": "^1.0.4"
  }
}
```

---

## 📊 Success Metrics

Track these KPIs for your app:

1. **Technical:**
   - ML categorization accuracy (target: >85%)
   - Prediction accuracy (target: ±10% of actual)
   - Chat response time (<2 seconds)
   - App performance (Lighthouse score >90)

2. **User Experience:**
   - Daily active usage
   - Transactions logged per week
   - Budget adherence rate
   - Goals achieved
   - Learning modules completed

3. **AI Quality:**
   - Chat satisfaction (thumbs up/down)
   - Insight relevance
   - Recommendation follow-through
   - Educational effectiveness

---

## 🎯 Portfolio Positioning

**For UT Austin MSAI Program:**

1. **AI/ML Demonstration:**
   - Custom TensorFlow.js models
   - NLP for transaction parsing
   - Predictive analytics
   - Pattern recognition
   - Behavioral modeling

2. **Full-Stack Skills:**
   - React + TypeScript
   - Modern web architecture
   - Database design
   - API integration
   - Responsive design

3. **Real-World Application:**
   - Solves actual problem (your spending habits)
   - User-centered design
   - Privacy-focused (local-first)
   - Production-ready code
   - Scalable architecture

4. **Research Potential:**
   - Financial behavior prediction
   - Conversational AI for finance
   - Personalized recommendations
   - Financial literacy gamification

**Write-Up Topics:**
- "Building an AI Financial Coach: Combining LLMs with Predictive ML"
- "Local-First Architecture for Privacy-Preserving Financial Apps"
- "Behavioral Pattern Recognition in Personal Finance"
- "Conversational AI for Financial Education"

---

## 📝 Weekly Execution with Claude Code

### **How to Use This Plan with Claude Code:**

1. **Start Each Week:**
```
Open Claude Code and say:
"I'm working on Week X of the FinCoach project. Here's what we need to build:
[paste weekly tasks]. Let's start with [specific task]."
```

2. **Iterate on Features:**
```
"The transaction form is working but I want to add merchant autocomplete. 
Here's the current code: [paste]. Help me implement autocomplete that learns 
from transaction history."
```

3. **Debug Issues:**
```
"I'm getting this error when trying to save a transaction: [error]. 
Here's my service code: [paste]. What's wrong?"
```

4. **Request Reviews:**
```
"I've completed the budget progress component. Can you review the code for:
1. TypeScript best practices
2. Performance optimizations
3. Accessibility
4. Edge cases I might have missed"
```

5. **Expand Features:**
```
"The ML categorization is working well. Now I want to add merchant intelligence. 
How should I structure this feature to integrate with the existing system?"
```

---

## 🚀 Getting Started

**First Claude Code Prompt:**
```
I want to build FinCoach, an AI-powered financial wellness coach app. 
This is a portfolio project for my MSAI program at UT Austin.

Tech stack: React + TypeScript + Vite, Tailwind CSS, Claude API, 
TensorFlow.js, IndexedDB (Dexie), Recharts.

Let's start by:
1. Creating the project structure with Vite
2. Setting up Tailwind with a professional financial theme
3. Installing all necessary dependencies
4. Creating the basic routing structure (Dashboard, Chat, Transactions, Analytics, Goals)
5. Setting up a basic layout with header and navigation

Create the complete initial project setup.
```

---

## 💡 Tips for Success

1. **Start Simple:** Get MVP working before adding ML complexity
2. **Use Real Data:** Track your own spending from day 1
3. **Iterate Fast:** Build → Test → Improve → Repeat
4. **Document Everything:** Future you (and portfolio reviewers) will thank you
5. **Test with Real Usage:** Use the app daily to find UX issues
6. **Version Control:** Commit frequently with clear messages
7. **Ask Claude for Help:** When stuck, provide context and ask specific questions
8. **Celebrate Wins:** Track your progress and enjoy building!

---

## 📚 Additional Resources

- **Claude API Docs:** https://docs.anthropic.com
- **TensorFlow.js:** https://www.tensorflow.org/js
- **Dexie.js:** https://dexie.org
- **Recharts:** https://recharts.org
- **Tailwind CSS:** https://tailwindcss.com
- **React Hook Form:** https://react-hook-form.com
- **Plaid Quickstart:** https://plaid.com/docs/quickstart
- **Financial Literacy:** https://www.khanacademy.org/economics-finance-domain

---

## ✅ Checklist

Phase 1 (Weeks 1-3):
- [ ] Project setup complete
- [ ] Database schema implemented
- [ ] Transaction CRUD working
- [ ] Budget system functional
- [ ] Dashboard with charts
- [ ] Claude API integrated
- [ ] Chat interface working

Phase 2 (Weeks 4-7):
- [ ] ML categorization trained
- [ ] Pattern detection working
- [ ] Anomaly detection implemented
- [ ] Insights generated automatically
- [ ] Spending predictions accurate
- [ ] Goal feasibility analysis
- [ ] Educational content created

Phase 3 (Weeks 8-11):
- [ ] Receipt scanning working
- [ ] Voice interface implemented
- [ ] Bank integration (optional)
- [ ] Cloud sync (optional)
- [ ] PWA features added

Phase 4 (Weeks 12-14):
- [ ] UI polished
- [ ] Tests written
- [ ] Documentation complete
- [ ] Deployed to production
- [ ] Portfolio page created

---

**Ready to build your AI financial coach? Let's start with Week 1!** 🚀
