import { useState, useEffect, useRef } from "react";
import { isAddress } from "ethers";
import Navbar from "./components/Navbar";
import AnalysisModal from "./components/AnalysisModal";
import { useWalletTransactions } from "./hooks/useEtherscan";
import { isValidENSName, resolveENSName } from "./services/ensService";
import type { WalletAnalysis } from "./services/openaiApi";

function App() {
  const [walletInput, setWalletInput] = useState(""); // What user types (address or ENS)
  const [analyzedAddress, setAnalyzedAddress] = useState("");
  const [analyzedInput, setAnalyzedInput] = useState(""); // Store the original input (ENS name or address)
  const [validationError, setValidationError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<WalletAnalysis | null>(
    null
  );
  const resultsRef = useRef<HTMLDivElement>(null);

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

  // Scroll to results when analysis is complete
  useEffect(() => {
    if (analysisResults && resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [analysisResults]);

  const validateAndResolveInput = async (
    input: string
  ): Promise<{ isValid: boolean; address?: string; error?: string }> => {
    if (!input.trim()) {
      return {
        isValid: false,
        error: "Please enter an Ethereum address or ENS name",
      };
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
          return {
            isValid: false,
            error:
              result.error ||
              "Failed to resolve ENS name. Please check the name and try again.",
          };
        }
      } catch (error) {
        return {
          isValid: false,
          error:
            "Failed to resolve ENS name. Please check the name and try again.",
        };
      }
    }

    return {
      isValid: false,
      error:
        "Please enter a valid Ethereum address or ENS name (e.g., vitalik.eth)",
    };
  };

  const handleAnalyzeWallet = async () => {
    setValidationError(""); // Clear any previous errors

    const result = await validateAndResolveInput(walletInput);
    if (result.isValid && result.address) {
      setAnalyzedAddress(result.address);
      setAnalyzedInput(walletInput); // Store the original input
      setAnalysisResults(null); // Clear previous results
    } else {
      setValidationError(result.error || "Invalid input");
    }
  };

  const handleAnalysisComplete = (analysis: WalletAnalysis) => {
    setAnalysisResults(analysis);
    // Close the modal when analysis is complete so user can see results
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTryAgain = () => {
    setAnalyzedAddress("");
    setAnalyzedInput("");
    setValidationError("");
    setAnalysisResults(null);
    setWalletInput("");
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
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent py-4">
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
                    <p className="text-sm text-red-400">{validationError}</p>
                  )}
                </div>
              </div>
              <div className="sm:flex sm:items-start">
                <button
                  className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  onClick={handleAnalyzeWallet}
                  disabled={isAnalyzing || !walletInput.trim()}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Wallet"}
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Results Section */}
          {(analysisResults || transactionError) && (
            <div
              ref={resultsRef}
              className="bg-slate-800/50 backdrop-blur-lg border border-purple-500/20 rounded-3xl p-8"
            >
              {analysisResults ? (
              <>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  AI-Powered Analysis Results
                </h2>
                <div className="mb-6">
                  <p className="text-sm text-gray-400">
                    Analysis for:{" "}
                    <span className="text-blue-400 font-mono break-all">
                      {analyzedInput}
                    </span>
                  </p>
                  {analyzedInput !== analyzedAddress && (
                    <p className="text-xs text-gray-500 mt-1">
                      Resolved to: <span className="font-mono">{analyzedAddress.slice(0, 6)}...
                      {analyzedAddress.slice(-4)}</span>
                    </p>
                  )}
                </div>
                <div className="text-left space-y-6">
                  {/* Summary */}
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">
                      Summary
                    </h3>
                    <p className="text-gray-300 break-words">{analysisResults.summary}</p>
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
                            <span className="text-purple-400 mt-1 flex-shrink-0">•</span>
                            <span className="text-gray-300 break-words">{insight}</span>
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
                    <p className="text-gray-300 break-words">
                      {analysisResults.behaviorPattern}
                    </p>
                  </div>

                  {/* Risk Assessment */}
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                      Risk Assessment
                    </h3>
                    <p className="text-gray-300 break-words">
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
                            <span className="text-cyan-400 mt-1 flex-shrink-0">→</span>
                            <span className="text-gray-300 break-words">{rec}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </>
            ) : transactionError ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-700/20 rounded-full flex items-center justify-center mb-6 mx-auto border border-red-500/30">
                  <svg
                    className="w-10 h-10 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-red-400 mb-4">
                  Analysis Error
                </h3>
                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 max-w-md mx-auto">
                  <p className="text-red-300 mb-4 leading-relaxed">
                    {transactionError.message || "Failed to fetch wallet data"}
                  </p>
                  <div className="bg-red-800/30 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-medium text-red-200 mb-2">
                      Possible reasons:
                    </h4>
                    <ul className="text-xs text-red-300 space-y-1">
                      <li>• Network connectivity issues</li>
                      <li>• Invalid wallet address</li>
                      <li>• Etherscan API rate limits</li>
                      <li>• Wallet has no transaction history</li>
                    </ul>
                  </div>
                  <button
                    onClick={handleTryAgain}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 text-sm"
                  >
                    Try Another Address
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mb-8 mx-auto border border-blue-500/30 relative">
                  <svg
                    className="w-12 h-12 text-blue-400"
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
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-300 mb-4">
                  Ready for Analysis
                </h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                  Enter an Ethereum wallet address or ENS name above and click
                  "Analyze Wallet" to unlock AI-powered insights about
                  transaction patterns, behavior analysis, and personalized
                  recommendations.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                      <svg
                        className="w-4 h-4 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-sm font-medium text-blue-400 mb-1">
                      Fast Analysis
                    </h4>
                    <p className="text-xs text-gray-400">
                      Get insights in seconds
                    </p>
                  </div>
                  <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                      <svg
                        className="w-4 h-4 text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-sm font-medium text-purple-400 mb-1">
                      AI Powered
                    </h4>
                    <p className="text-xs text-gray-400">
                      Smart pattern detection
                    </p>
                  </div>
                  <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                      <svg
                        className="w-4 h-4 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-sm font-medium text-green-400 mb-1">
                      Secure
                    </h4>
                    <p className="text-xs text-gray-400">
                      Privacy-first approach
                    </p>
                  </div>
                </div>
              </div>
            )}
            </div>
          )}
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
