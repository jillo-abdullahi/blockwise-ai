import { useState } from "react";
import { isAddress } from "ethers";
import Navbar from "./components/Navbar";
import { useWalletTransactions } from "./hooks/useEtherscan";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [analyzedAddress, setAnalyzedAddress] = useState("");
  const [validationError, setValidationError] = useState("");

  const { 
    data: transactions, 
    isLoading: isAnalyzing, 
    error 
  } = useWalletTransactions(analyzedAddress, !!analyzedAddress);

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
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(e.target.value);
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError("");
    }
  };

  const formatTransactionValue = (valueWei: string) => {
    const ethValue = parseFloat(valueWei) / Math.pow(10, 18);
    return ethValue.toFixed(6);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  };

  const generateAnalysisResults = () => {
    if (!transactions) return null;

    const totalTransactions = transactions.length;
    const recentTransactions = transactions.slice(0, 10);
    
    let analysisText = `WALLET ANALYSIS RESULTS\n`;
    analysisText += `========================\n\n`;
    analysisText += `Address: ${analyzedAddress}\n`;
    analysisText += `Total Transactions Found: ${totalTransactions}\n\n`;
    
    if (totalTransactions > 0) {
      const totalValueOut = transactions
        .filter(tx => tx.from.toLowerCase() === analyzedAddress.toLowerCase())
        .reduce((sum, tx) => sum + parseFloat(tx.value), 0);
      
      const totalValueIn = transactions
        .filter(tx => tx.to.toLowerCase() === analyzedAddress.toLowerCase())
        .reduce((sum, tx) => sum + parseFloat(tx.value), 0);

      const outgoingTxCount = transactions.filter(tx => tx.from.toLowerCase() === analyzedAddress.toLowerCase()).length;
      const incomingTxCount = transactions.filter(tx => tx.to.toLowerCase() === analyzedAddress.toLowerCase()).length;

      analysisText += `TRANSACTION SUMMARY:\n`;
      analysisText += `- Outgoing Transactions: ${outgoingTxCount}\n`;
      analysisText += `- Incoming Transactions: ${incomingTxCount}\n`;
      analysisText += `- Total ETH Sent: ${formatTransactionValue(totalValueOut.toString())} ETH\n`;
      analysisText += `- Total ETH Received: ${formatTransactionValue(totalValueIn.toString())} ETH\n`;
      analysisText += `- Most Recent Transaction: ${formatTimestamp(transactions[0].timeStamp)}\n\n`;
      
      analysisText += `RECENT TRANSACTIONS (Last 10):\n`;
      analysisText += `====================================\n`;
      
      recentTransactions.forEach((tx, index) => {
        const isOutgoing = tx.from.toLowerCase() === analyzedAddress.toLowerCase();
        const direction = isOutgoing ? "OUT" : "IN ";
        const otherAddress = isOutgoing ? tx.to : tx.from;
        const value = formatTransactionValue(tx.value);
        
        analysisText += `${index + 1}. [${direction}] ${value} ETH\n`;
        analysisText += `   ${isOutgoing ? 'To' : 'From'}: ${otherAddress}\n`;
        analysisText += `   Date: ${formatTimestamp(tx.timeStamp)}\n`;
        analysisText += `   Hash: ${tx.hash}\n\n`;
      });
    } else {
      analysisText += `No transactions found for this address.\n`;
    }

    return analysisText;
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
          <div className="bg-slate-800/50 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8 mb-8">
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
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
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
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  onClick={handleAnalyzeWallet}
                  disabled={isAnalyzing || !walletAddress.trim()}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Wallet"}
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Results Section */}
          <div className="bg-slate-800/50 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Analysis Results</h2>
            
            {error ? (
              <div className="text-center py-6">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-red-400 mb-2">Error</h3>
                  <p className="text-red-300 text-sm">
                    {error.message || 'Failed to fetch wallet data'}
                  </p>
                </div>
              </div>
            ) : transactions ? (
              <div className="text-left">
                <div className="bg-slate-700/30 rounded-lg p-6 border border-gray-600">
                  <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {generateAnalysisResults()}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center mb-4 mx-auto">
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
