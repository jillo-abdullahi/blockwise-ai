import { useQuery } from '@tanstack/react-query';
import { etherscanApi } from '../services/etherscanApi';
import { analyzeWalletWithAI } from '../services/openaiApi';
import type { EtherscanTransaction } from '../services/etherscanApi';
import type { WalletAnalysis } from '../services/openaiApi';

export const useWalletTransactions = (address: string, enabled = false) => {
  return useQuery<EtherscanTransaction[], Error>({
    queryKey: ['wallet-transactions', address],
    queryFn: () => etherscanApi.getTransactions(address),
    enabled: enabled && !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
  });
};

export const useWalletAnalysis = (transactions: EtherscanTransaction[] | undefined, address: string, enabled = false) => {
  // Create a stable hash of the transaction data to avoid unnecessary re-runs
  const transactionHash = transactions ? 
    transactions.map(tx => `${tx.hash}-${tx.timeStamp}`).join('|') : '';
  
  return useQuery<WalletAnalysis, Error>({
    queryKey: ['wallet-analysis', address, transactionHash],
    queryFn: () => {
      if (!transactions || transactions.length === 0) {
        throw new Error('No transactions available for analysis');
      }
      return analyzeWalletWithAI(transactions, address);
    },
    enabled: enabled && !!transactions && transactions.length > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes - AI analysis doesn't change frequently
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 1, // Only retry once for rate limit errors
    retryDelay: 60000, // Wait 1 minute before retry
  });
};
