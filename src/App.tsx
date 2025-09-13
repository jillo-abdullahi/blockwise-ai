import { useState, useEffect } from "react";
import { isAddress } from "ethers";
import Navbar from "./components/Navbar";
import AnalysisModal from "./components/AnalysisModal";
import { useWalletTransactions } from "./hooks/useEtherscan";
import { isValidENSName, resolveENSName } from "./services/ensService";
import type { WalletAnalysis } from "./services/openaiApi";

function App() {
  const [walletInput, setWalletInput] = useState(""); // What user types (address or ENS)
  const [analyzedAddress, setAnalyzedAddress] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<WalletAnalysis | null>(
    null
  );

  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    error: transactionError,
  } = useWalletTransactions(analyzedAddress, !!analyzedAddress);

  const isAnalyzing = isLoadingTransactions;

  // Open modal when transactions are loaded successfully
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      setIsModalOpen(true);
    }
  }, [transactions]);

  const validateAndResolveInput = async (input: string): Promise<{ isValid: boolean; address?: string; error?: string }> => {
    if (!input.trim()) {
      return { isValid: false, error: "Please enter an Ethereum address or ENS name" };
    }

    // Check if it's a valid Ethereum address
    if (isAddress(input)) {
      return { isValid: true, address: input };
    }

    // Check if it's a valid ENS name
    if (isValidENSName(input)) {
      try {
        const result = await resolveENSName(input);
        if (result.isValid && result.address) {
          return { isValid: true, address: result.address };
        } else {
          return { isValid: false, error: result.error || "Failed to resolve ENS name. Please check the name and try again." };
        }
      } catch (error) {
        return { isValid: false, error: "Failed to resolve ENS name. Please check the name and try again." };
      }
    }

    return { 
      isValid: false, 
      error: "Please enter a valid Ethereum address or ENS name (e.g., vitalik.eth)" 
    };
  };

  const handleAnalyzeWallet = async () => {
    setValidationError(""); // Clear any previous errors
    
    const result = await validateAndResolveInput(walletInput);
    if (result.isValid && result.address) {
      setAnalyzedAddress(result.address);
      setAnalysisResults(null); // Clear previous results
    } else {
      setValidationError(result.error || "Invalid input");
    }
  };

  const handleAnalysisComplete = (analysis: WalletAnalysis) => {
    setAnalysisResults(analysis);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWalletInput(e.target.value);
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
            interactions with smart analytics. Supports both wallet addresses
            and ENS names.
          </p>

          {/* Wallet Input Section */}
          <div className="bg-slate-800/50 backdrop-blur-lg border border-purple-500/20 rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Enter Ethereum Address or ENS Name
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="0x742d...8C8E or vitalik.eth"
                  value={walletInput}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                    validationError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-600 focus:ring-blue-500"
                  }`}
                />
                <div className="h-6 mt-2">
                  {validationError && (
                    <p className="text-sm text-red-400">
                      {validationError}
                    </p>
                  )}
                </div>
              </div>
              <div className="sm:flex sm:items-start">
                <button
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  onClick={handleAnalyzeWallet}
                  disabled={isAnalyzing || !walletInput.trim()}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Wallet"}
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Results Section */}
          <div className="bg-slate-800/50 backdrop-blur-lg border border-purple-500/20 rounded-3xl p-8">
            {analysisResults ? (
              <>
                <h2 className="text-2xl font-semibold text-white mb-6">
                  AI-Powered Analysis Results
                </h2>
                <div className="text-left space-y-6">
                  {/* Summary */}
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">
                      Summary
                    </h3>
                    <p className="text-gray-300">{analysisResults.summary}</p>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-purple-400 mb-3">
                      Key Insights
                    </h3>
                    <ul className="space-y-2">
                      {analysisResults.insights.map(
                        (insight: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <span className="text-purple-400 mt-1">•</span>
                            <span className="text-gray-300">{insight}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Behavior Pattern */}
                  <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-green-400 mb-2">
                      Behavior Pattern
                    </h3>
                    <p className="text-gray-300">
                      {analysisResults.behaviorPattern}
                    </p>
                  </div>

                  {/* Risk Assessment */}
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                      Risk Assessment
                    </h3>
                    <p className="text-gray-300">
                      {analysisResults.riskAssessment}
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-cyan-400 mb-3">
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {analysisResults.recommendations.map(
                        (rec: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <span className="text-cyan-400 mt-1">→</span>
                            <span className="text-gray-300">{rec}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </>
            ) : transactionError ? (
              <div className="text-center py-6">
                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-red-400 mb-2">
                    Error
                  </h3>
                  <p className="text-red-300 text-sm">
                    {transactionError.message || "Failed to fetch wallet data"}
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
                <h3 className="text-lg font-medium text-gray-400 mb-2">
                  No Analysis Yet
                </h3>
                <p className="text-gray-500">
                  Enter an Ethereum wallet address or ENS name above and click
                  "Analyze Wallet" to see AI-powered insights.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Analysis Modal */}
      {transactions && (
        <AnalysisModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          transactions={transactions}
          walletAddress={analyzedAddress}
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}
    </div>
  );
}

export default App;
