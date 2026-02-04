# FinCoach - AI-Powered Financial Wellness Coach

A personal finance management app with an AI coach powered by Claude. Track spending, manage budgets, set goals, and get personalized financial insights.

## Features

- **Dashboard**: Overview of spending, income, budget progress, and recent activity
- **Transactions**: Add, edit, and categorize income and expenses with filtering
- **Bank Connections**: Connect bank accounts via Plaid to automatically import transactions
- **Budgets**: Set category budgets with progress tracking and alerts
- **AI Coach**: Chat with Claude for personalized financial advice and insights
- **Analytics**: Visualize spending patterns with charts
- **Goals**: Track savings goals (coming soon)

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom financial theme
- **Database**: IndexedDB via Dexie.js (local-first, offline capable)
- **AI**: Claude API via @anthropic-ai/sdk
- **Banking**: Plaid API for bank connections
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm or yarn
- Anthropic API key (for AI features)

### Installation

1. Clone the repository:
```bash
cd finance-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Anthropic API key to `.env.local`:
```
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

Get your API key from [console.anthropic.com](https://console.anthropic.com/)

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components (Button, Card, Modal, etc.)
│   ├── layout/       # Layout components (Sidebar, Header, Navigation)
│   ├── transactions/ # Transaction-related components
│   ├── budget/       # Budget management components
│   ├── chat/         # AI chat interface components
│   └── charts/       # Recharts wrapper components
├── pages/            # Route page components
├── hooks/            # Custom React hooks
├── services/         # Business logic and API services
├── database/         # IndexedDB setup with Dexie
├── types/            # TypeScript type definitions
└── utils/            # Utility functions (formatters, validators, etc.)
```

## Usage

### Adding Transactions

1. Navigate to the **Transactions** page
2. Click **Add Transaction**
3. Fill in amount, category, merchant, and date
4. Toggle between Expense/Income
5. Click **Add Transaction** to save

### Creating Budgets

1. Navigate to the **Budgets** page
2. Click **Create Budget**
3. Select a category and set a monthly limit
4. Optionally adjust alert threshold (default: 75%)
5. Click **Create Budget** to save

### Connecting Bank Accounts

1. Get Plaid API credentials from [dashboard.plaid.com](https://dashboard.plaid.com)
2. Add credentials to `.env.local`:
```
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret
PLAID_ENV=sandbox
```
3. Start the backend server:
```bash
cd server && npm install && npm run dev
```
4. Navigate to the **Bank Accounts** page in the app
5. Click **Connect Bank Account** and follow the Plaid Link flow
6. Once connected, click **Sync** to import transactions

### Using the AI Coach

1. Navigate to the **AI Coach** page
2. Make sure your API key is configured in `.env.local`
3. Ask questions about your finances or use quick action buttons
4. The AI has context about your transactions, budgets, and spending patterns

Example prompts:
- "How am I doing this month?"
- "What patterns do you see in my spending?"
- "Help me create a budget for dining out"
- "What can I cut back on to save more?"

## Data Privacy

All financial data is stored locally in your browser using IndexedDB. No data is sent to external servers except:
- Chat messages are sent to Claude API for AI responses
- The AI receives anonymized context about your financial summary (totals, categories) to provide relevant advice
- When using bank connections, Plaid accesses your bank data to import transactions (your bank credentials are never stored by FinCoach)

## License

MIT
