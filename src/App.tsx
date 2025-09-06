import { useState } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [walletAddress, setWalletAddress] = useState("");

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
              <input
                type="text"
                placeholder="0x742d35Cc6634C0532925a3b8D25d9E6c0e5c8C8E"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                onClick={() => {
                  // TODO: Implement wallet analysis
                  console.log("Analyzing wallet:", walletAddress);
                }}
              >
                Analyze Wallet
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-slate-800/30 backdrop-blur-lg border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Deep Analytics
              </h3>
              <p className="text-gray-400">
                Comprehensive analysis of transaction patterns and wallet
                behavior
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-white"
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
              <h3 className="text-lg font-semibold text-white mb-2">
                AI Insights
              </h3>
              <p className="text-gray-400">
                Smart recommendations powered by machine learning algorithms
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-lg border border-pink-500/20 rounded-xl p-6 hover:border-pink-500/40 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Portfolio Tracking
              </h3>
              <p className="text-gray-400">
                Monitor portfolio performance and track asset allocation over
                time
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
