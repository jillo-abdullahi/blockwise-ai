import React, { useEffect, useState } from 'react';
import { useWalletAnalysis } from '../hooks/useEtherscan';
import type { EtherscanTransaction } from '../services/etherscanApi';
import type { WalletAnalysis } from '../services/openaiApi';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: EtherscanTransaction[];
  walletAddress: string;
  onAnalysisComplete: (analysis: WalletAnalysis) => void;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  onClose,
  transactions,
  walletAddress,
  onAnalysisComplete,
}) => {
  const [shouldStartAnalysis, setShouldStartAnalysis] = useState(false);

  const {
    data: aiAnalysis,
    isLoading: isLoadingAnalysis,
    error: analysisError,
  } = useWalletAnalysis(transactions, walletAddress, shouldStartAnalysis && isOpen);

  // Handle successful analysis
  useEffect(() => {
    if (aiAnalysis) {
      onAnalysisComplete(aiAnalysis);
      onClose();
    }
  }, [aiAnalysis, onAnalysisComplete, onClose]);

  // Reset analysis state when modal opens
  useEffect(() => {
    if (isOpen) {
      setShouldStartAnalysis(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm modal-backdrop"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-800 border border-purple-500/30 rounded-3xl p-8 mx-4 max-w-lg w-full shadow-2xl modal-content"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          {isLoadingAnalysis ? (
            <>
              {/* Loading State */}
              <div className="mb-6">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  {/* Animated rings */}
                  <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
                  <div className="absolute inset-2 rounded-full border-4 border-blue-500/30 animate-spin border-t-blue-500"></div>
                  <div className="absolute inset-4 rounded-full border-4 border-cyan-500/40 animate-spin animate-reverse border-t-cyan-500"></div>
                  
                  {/* AI sparkle icon in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-white mb-3">
                AI Analysis in Progress
              </h3>
              <p className="text-gray-300 mb-4">
                Analyzing {transactions.length} transactions with advanced AI algorithms...
              </p>
              
              {/* Progress steps */}
              <div className="space-y-3 text-left bg-slate-700/30 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Transaction data processed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">Running behavioral analysis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">Generating insights</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">Preparing recommendations</span>
                </div>
              </div>

              <div className="mt-6 text-xs text-gray-500">
                This may take a few moments...
              </div>
            </>
          ) : analysisError ? (
            <>
              {/* Error State */}
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-red-400 mb-3">
                Analysis Failed
              </h3>
              
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-6">
                <p className="text-red-300 text-sm">
                  {analysisError.message?.includes('429') ? 
                    'Rate limit exceeded. Please wait a moment before trying again.' :
                    analysisError.message?.includes('Rate limit:') ?
                    analysisError.message :
                    'Failed to analyze wallet. Please try again.'
                  }
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                >
                  Try Again
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Initial State */}
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z"/>
                  </svg>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-white mb-3">
                Ready for AI Analysis
              </h3>
              <p className="text-gray-300 mb-6">
                Found {transactions.length} transactions ready for analysis. Click below to start AI-powered insights.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShouldStartAnalysis(true)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all transform hover:scale-105"
                >
                  Start Analysis
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
