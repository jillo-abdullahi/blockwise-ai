import { useQuery } from '@tanstack/react-query';
import { etherscanApi } from '../services/etherscanApi';
import type { EtherscanTransaction } from '../services/etherscanApi';

export const useWalletTransactions = (address: string, enabled = false) => {
  return useQuery<EtherscanTransaction[], Error>({
    queryKey: ['wallet-transactions', address],
    queryFn: () => etherscanApi.getTransactions(address),
    enabled: enabled && !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
  });
};
