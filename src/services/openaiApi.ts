import OpenAI from 'openai';
import { aiAnalysisLimiter } from '../utils/rateLimiter';
import type { EtherscanTransaction } from './etherscanApi';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for demo purposes
});

export interface WalletAnalysis {
  summary: string;
  insights: string[];
  behaviorPattern: string;
  riskAssessment: string;
  recommendations: string[];
}

export interface TransactionSummary {
  address: string;
  totalTransactions: number;
  totalEthSent: number;
  totalEthReceived: number;
  outgoingCount: number;
  incomingCount: number;
  firstTransactionDate: string;
  lastTransactionDate: string;
  averageTransactionValue: number;
  uniqueCounterparties: number;
  transactionFrequency: string;
  recentTransactions: Array<{
    type: 'incoming' | 'outgoing';
    value: number;
    counterparty: string;
    date: string;
    hash: string;
  }>;
  isLimitedSample: boolean;
  sampleSize: number;
}

export const analyzeWalletWithAI = async (transactions: EtherscanTransaction[], walletAddress: string): Promise<WalletAnalysis> => {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
  }

  // Check rate limiting
  if (!aiAnalysisLimiter.canMakeRequest()) {
    const waitTime = Math.ceil(aiAnalysisLimiter.getTimeUntilNextRequest() / 1000);
    throw new Error(`Rate limit: Please wait ${waitTime} seconds before making another analysis request.`);
  }

  // Prepare structured transaction data for AI analysis
  const transactionSummary = prepareTransactionData(transactions, walletAddress);
  
  const prompt = createAnalysisPrompt(transactionSummary);

  try {
    // Record the request
    aiAnalysisLimiter.recordRequest();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-effective model for analysis
      messages: [
        {
          role: "system",
          content: `You are an expert blockchain analyst specializing in Ethereum wallet behavior analysis. 
          Your role is to provide comprehensive, actionable insights about wallet activity patterns, 
          user behavior, and potential use cases based on transaction history. 
          
          IMPORTANT: Be transparent about data limitations. If you're analyzing a limited sample of recent transactions, 
          clearly state this in your analysis and note that the wallet may have a much longer history.
          
          Always structure your response as a JSON object with the following format:
          {
            "summary": "A concise 2-3 sentence overview of the wallet's primary characteristics, noting if analysis is based on limited data",
            "insights": ["Array of 3-5 key behavioral insights, mentioning data limitations when relevant"],
            "behaviorPattern": "Detailed analysis of transaction patterns and user behavior, acknowledging sample limitations if applicable",
            "riskAssessment": "Assessment of wallet activity from security and compliance perspective",
            "recommendations": ["Array of 2-4 actionable recommendations for the wallet holder"]
          }`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent analysis
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const analysis = completion.choices[0]?.message?.content;
    if (!analysis) {
      throw new Error('No analysis received from OpenAI');
    }

    return JSON.parse(analysis) as WalletAnalysis;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Handle rate limit errors specifically
    if (error instanceof Error && error.message.includes('429')) {
      throw new Error('Rate limit exceeded. Please wait before making another request.');
    }
    
    // Handle other API errors
    if (error instanceof Error && error.message.includes('401')) {
      throw new Error('Invalid OpenAI API key. Please check your configuration.');
    }
    
    throw new Error('Failed to analyze wallet with AI. Please try again later.');
  }
};

const prepareTransactionData = (transactions: EtherscanTransaction[], walletAddress: string): TransactionSummary => {
  const outgoingTxs = transactions.filter(tx => tx.from.toLowerCase() === walletAddress.toLowerCase());
  const incomingTxs = transactions.filter(tx => tx.to.toLowerCase() === walletAddress.toLowerCase());
  
  const totalEthSent = outgoingTxs.reduce((sum, tx) => sum + parseFloat(tx.value), 0) / Math.pow(10, 18);
  const totalEthReceived = incomingTxs.reduce((sum, tx) => sum + parseFloat(tx.value), 0) / Math.pow(10, 18);
  
  const allValues = transactions.map(tx => parseFloat(tx.value) / Math.pow(10, 18));
  const averageValue = allValues.reduce((a, b) => a + b, 0) / allValues.length;
  
  // Get unique counterparties
  const counterparties = new Set([
    ...outgoingTxs.map(tx => tx.to),
    ...incomingTxs.map(tx => tx.from)
  ]);
  
  // Calculate transaction frequency
  const firstTx = transactions[transactions.length - 1];
  const lastTx = transactions[0];
  const daysDiff = (parseInt(lastTx.timeStamp) - parseInt(firstTx.timeStamp)) / (24 * 60 * 60);
  const frequency = daysDiff > 0 ? (transactions.length / daysDiff).toFixed(2) + ' tx/day' : 'Single day activity';
  
  // Prepare recent transactions (last 10)
  const recentTxs = transactions.slice(0, 10).map(tx => ({
    type: tx.from.toLowerCase() === walletAddress.toLowerCase() ? 'outgoing' as const : 'incoming' as const,
    value: parseFloat(tx.value) / Math.pow(10, 18),
    counterparty: tx.from.toLowerCase() === walletAddress.toLowerCase() ? tx.to : tx.from,
    date: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
    hash: tx.hash
  }));

  return {
    address: walletAddress,
    totalTransactions: transactions.length,
    totalEthSent,
    totalEthReceived,
    outgoingCount: outgoingTxs.length,
    incomingCount: incomingTxs.length,
    firstTransactionDate: new Date(parseInt(firstTx.timeStamp) * 1000).toISOString(),
    lastTransactionDate: new Date(parseInt(lastTx.timeStamp) * 1000).toISOString(),
    averageTransactionValue: averageValue,
    uniqueCounterparties: counterparties.size,
    transactionFrequency: frequency,
    recentTransactions: recentTxs,
    isLimitedSample: transactions.length >= 100, // If we got 100+ transactions, likely hitting API limit
    sampleSize: transactions.length
  };
};

const createAnalysisPrompt = (data: TransactionSummary): string => {
  const sampleNote = data.isLimitedSample 
    ? `\n⚠️  IMPORTANT: This analysis is based on the most recent ${data.sampleSize} transactions only. The wallet may have significantly more transaction history.`
    : '';

  return `Analyze this Ethereum wallet's transaction history and provide comprehensive insights:

WALLET OVERVIEW:
- Address: ${data.address}
- Transactions Analyzed: ${data.totalTransactions}${data.isLimitedSample ? ` (limited sample - wallet likely has more history)` : ` (complete history)`}
- Active Period: ${data.firstTransactionDate.split('T')[0]} to ${data.lastTransactionDate.split('T')[0]}
- Transaction Frequency: ${data.transactionFrequency}${sampleNote}

TRANSACTION SUMMARY:
- Total ETH Sent: ${data.totalEthSent.toFixed(4)} ETH (${data.outgoingCount} transactions)
- Total ETH Received: ${data.totalEthReceived.toFixed(4)} ETH (${data.incomingCount} transactions)
- Average Transaction Value: ${data.averageTransactionValue.toFixed(6)} ETH
- Unique Counterparties: ${data.uniqueCounterparties}
- Net ETH Flow: ${(data.totalEthReceived - data.totalEthSent).toFixed(4)} ETH

RECENT TRANSACTION PATTERNS (Last 10):
${data.recentTransactions.map((tx, i) => 
  `${i + 1}. ${tx.type.toUpperCase()}: ${tx.value.toFixed(6)} ETH ${tx.type === 'outgoing' ? 'to' : 'from'} ${tx.counterparty.slice(0, 8)}...${tx.counterparty.slice(-6)} on ${tx.date.split('T')[0]}`
).join('\n')}

ANALYSIS REQUIREMENTS:
1. Identify the primary use case/behavior pattern (e.g., trading, DeFi, hodling, business operations, etc.)
2. Assess transaction timing patterns and frequency
3. Evaluate the risk profile based on transaction patterns
4. Determine if this appears to be a personal wallet, exchange, smart contract, or institutional wallet
5. Identify any notable patterns in counterparty interactions
6. Provide actionable insights for optimization or security
${data.isLimitedSample ? '\n7. IMPORTANT: Acknowledge in your analysis that this is based on recent transaction history only' : ''}

Please provide a comprehensive analysis focusing on behavioral patterns, usage characteristics, and practical recommendations.${data.isLimitedSample ? ' Note that your analysis is based on recent transactions and the wallet may have a much longer history.' : ''}`;
};
