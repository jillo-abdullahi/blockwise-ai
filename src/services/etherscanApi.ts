import axios from 'axios';

const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/api';
const API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;

export interface EtherscanTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId: string;
  functionName: string;
}

export interface EtherscanResponse {
  status: string;
  message: string;
  result: EtherscanTransaction[];
}

export const etherscanApi = {
  async getTransactions(address: string, page = 1, offset = 50): Promise<EtherscanTransaction[]> {
    if (!API_KEY) {
      throw new Error('Etherscan API key is not configured. Please add VITE_ETHERSCAN_API_KEY to your .env file.');
    }

    try {
      const response = await axios.get<EtherscanResponse>(ETHERSCAN_BASE_URL, {
        params: {
          module: 'account',
          action: 'txlist',
          address: address,
          startblock: 0,
          endblock: 99999999,
          page: page,
          offset: offset,
          sort: 'desc',
          apikey: API_KEY,
        },
      });

      if (response.data.status === '0') {
        throw new Error(response.data.message || 'Failed to fetch transactions');
      }

      return response.data.result || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  },
};
