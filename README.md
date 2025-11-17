This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# OpenRouter API Key (required)
# Get your key from https://openrouter.ai/keys
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Optional: Your site info for OpenRouter analytics
YOUR_SITE_URL=http://localhost:3000
YOUR_SITE_NAME=Judica
```

**Important:** The project uses [OpenRouter](https://openrouter.ai) to access LLM models. You'll need to:
1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Get your API key from [openrouter.ai/keys](https://openrouter.ai/keys)
3. Add credits to your OpenRouter account

### 3. Model Configuration (Optional)

The app currently uses `openai/gpt-4-turbo` by default. To change the model, edit `app/api/judge/route.ts` line 65:

```typescript
model: "openai/gpt-4-turbo", // Change this to your preferred model
```

**Available models on OpenRouter:**
- `openai/gpt-4-turbo` - Balanced performance and cost
- `openai/gpt-3.5-turbo` - Faster and cheaper
- `anthropic/claude-3-opus` - Very high quality
- `google/gemini-pro` - Google's model
- See all models at [openrouter.ai/models](https://openrouter.ai/models)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
