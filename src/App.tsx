import { useState, useEffect } from "react";
import { isAddress } from "ethers";
import Navbar from "./components/Navbar";
import { useWalletTransactions, useWalletAnalysis } from "./hooks/useEtherscan";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [analyzedAddress, setAnalyzedAddress] = useState("");
  const [shouldAnalyze, setShouldAnalyze] = useState(false);
  const [validationError, setValidationError] = useState("");

  const { 
    data: transactions, 
    isLoading: isLoadingTransactions, 
    error: transactionError 
  } = useWalletTransactions(analyzedAddress, !!analyzedAddress);

  const { 
    data: aiAnalysis, 
    isLoading: isLoadingAnalysis, 
    error: analysisError 
  } = useWalletAnalysis(transactions, analyzedAddress, shouldAnalyze && !!transactions);

  const isAnalyzing = isLoadingTransactions || isLoadingAnalysis;

  // Reset analysis flag when address changes
  useEffect(() => {
    setShouldAnalyze(false);
  }, [analyzedAddress]);

  const validateAddress = (address: string): boolean => {
    if (!address.trim()) {
      setValidationError("Please enter an Ethereum address");
      return false;
    }
    
    if (!isAddress(address)) {
      setValidationError("Please enter a valid Ethereum address");
      return false;
    }
    
    setValidationError("");
    return true;
  };

  const handleAnalyzeWallet = () => {
    if (validateAddress(walletAddress)) {
      setAnalyzedAddress(walletAddress);
      setShouldAnalyze(true);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(e.target.value);
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      <Navbar />

      {/* Main Content */}
      <main className="mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Smart Insights for Your Wallet
          </h1>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Get AI-powered insights into Ethereum wallet activity. Analyze
            transaction patterns, portfolio performance, and blockchain
            interactions with smart analytics.
          </p>

          {/* Wallet Input Section */}
          <div className="bg-slate-800/50 backdrop-blur-lg border border-purple-500/20 rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Enter Ethereum Address
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="0x742d35Cc6634C0532925a3b8D25d9E6c0e5c8C8E"
                  value={walletAddress}
                  onChange={handleAddressChange}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                    validationError 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-600 focus:ring-blue-500'
                  }`}
                />
                <div className="h-6 mt-2">
                  {validationError && (
                    <p className="text-sm text-red-400">{validationError}</p>
                  )}
                </div>
              </div>
              <div className="sm:flex sm:items-start">
                <button
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  onClick={handleAnalyzeWallet}
                  disabled={isAnalyzing || !walletAddress.trim()}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Wallet"}
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Results Section */}
          <div className="bg-slate-800/50 backdrop-blur-lg border border-purple-500/20 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">AI-Powered Analysis Results</h2>
            
            {transactionError || analysisError ? (
              <div className="text-center py-6">
                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-red-400 mb-2">Error</h3>
                  <p className="text-red-300 text-sm">
                    {analysisError?.message?.includes('429') ? 
                      'Rate limit exceeded. Please wait a moment before trying again.' :
                      transactionError?.message || analysisError?.message || 'Failed to analyze wallet'
                    }
                  </p>
                  {analysisError?.message?.includes('429') && (
                    <p className="text-red-300 text-xs mt-2">
                      The AI analysis service is temporarily unavailable due to high demand.
                    </p>
                  )}
                </div>
              </div>
            ) : aiAnalysis ? (
              <div className="text-left space-y-6">
                {/* Summary */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Summary</h3>
                  <p className="text-gray-300">{aiAnalysis.summary}</p>
                </div>

                {/* Key Insights */}
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">Key Insights</h3>
                  <ul className="space-y-2">
                    {aiAnalysis.insights.map((insight, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span className="text-gray-300">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Behavior Pattern */}
                <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Behavior Pattern</h3>
                  <p className="text-gray-300">{aiAnalysis.behaviorPattern}</p>
                </div>

                {/* Risk Assessment */}
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-2">Risk Assessment</h3>
                  <p className="text-gray-300">{aiAnalysis.riskAssessment}</p>
                </div>

                {/* Recommendations */}
                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {aiAnalysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-cyan-400 mt-1">→</span>
                        <span className="text-gray-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : transactions && !shouldAnalyze ? (
              <div className="text-center py-6">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-blue-400 mb-2">Transactions Loaded</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Found {transactions.length} transactions. Click "Analyze Wallet" above to get AI insights.
                  </p>
                  <button
                    onClick={() => setShouldAnalyze(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                  >
                    Analyze with AI
                  </button>
                </div>
              </div>
            ) : transactions ? (
              <div className="text-center py-6">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-blue-400 mb-2">Analyzing with AI...</h3>
                  <p className="text-gray-300 text-sm">
                    Found {transactions.length} transactions. Running AI analysis...
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-400 mb-2">No Analysis Yet</h3>
                <p className="text-gray-500">
                  Enter an Ethereum wallet address above and click "Analyze Wallet" to see AI-powered insights.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
