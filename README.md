# Blockwise AI

**Smart insights for your wallet.**

Blockwise AI is a comprehensive Ethereum wallet analytics application that provides AI-powered insights into blockchain activity. Enter any Ethereum address or ENS name and get detailed analysis of wallet transactions, behavior patterns, risk assessment, and personalized recommendations.

## ✨ Features

### 🔍 **Advanced Wallet Analysis**
- Deep dive into any Ethereum address or ENS name
- Analysis of up to 100 most recent transactions
- Transparent data sampling with clear limitations disclosure
- Transaction pattern recognition and behavior analysis

### 🤖 **AI-Powered Insights**
- GPT-4 powered intelligent analysis of wallet activity
- Behavioral pattern identification (trading, DeFi, hodling, etc.)
- Risk assessment and security evaluation
- Personalized recommendations for optimization

### 🏷️ **ENS Support**
- Full Ethereum Name Service (ENS) resolution
- Support for .eth and other ENS domains
- Automatic address resolution with fallback providers
- Clear indication of resolved addresses

### 📊 **Comprehensive Analytics**
- Transaction frequency and timing patterns
- ETH flow analysis (sent vs received)
- Unique counterparty tracking
- Average transaction value calculations
- Net ETH flow and portfolio insights

### 💫 **Modern User Experience**
- Beautiful glassmorphism UI with dark crypto theme
- Smooth animations and transitions
- Loading states with progress indicators
- Error handling with helpful troubleshooting
- Auto-scroll to results for seamless flow

### 🔗 **Blockchain Integration**
- Real-time Ethereum data via Etherscan API
- Rate limiting for reliable API usage
- Comprehensive transaction data processing
- Smart contract and wallet type detection

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS with custom gradients
- **State Management**: TanStack Query for data fetching
- **AI Integration**: OpenAI GPT-4o-mini
- **Blockchain Data**: Etherscan API
- **ENS Resolution**: Multiple provider fallbacks
- **Web3**: Ethers.js for address validation

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- Etherscan API key
- OpenAI API key

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_ETHERSCAN_API_KEY=your_etherscan_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### Installation

```bash
# Clone the repository
git clone https://github.com/jillo-abdullahi/blockwise-ai.git
cd blockwise-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📝 Usage

1. **Enter Address or ENS**: Input any Ethereum address (0x...) or ENS name (vitalik.eth)
2. **Analyze**: Click "Analyze Wallet" to start the process
3. **Review Transactions**: View transaction loading progress in the modal
4. **Get AI Insights**: Receive comprehensive AI analysis with:
   - Executive summary of wallet activity
   - Key behavioral insights
   - Transaction patterns and frequency
   - Risk assessment
   - Personalized recommendations

## � Configuration

### API Rate Limits
- **Etherscan**: Built-in rate limiting to prevent 429 errors
- **OpenAI**: Request throttling for cost optimization
- **ENS**: Multiple provider fallbacks for reliability

### Transaction Sampling
- Analyzes up to 100 most recent transactions
- Clearly indicates when analysis is based on limited sample
- Transparent about data scope and limitations

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop and mobile
- **Loading States**: Animated progress indicators
- **Error Handling**: User-friendly error messages with solutions
- **Auto-scroll**: Smooth navigation to results
- **Address Display**: Smart truncation with copy functionality
- **Modal System**: Clean overlay for analysis progress

## 🔒 Security & Privacy

- **Client-side Processing**: No wallet data stored on servers
- **API Key Protection**: Environment variable configuration
- **Rate Limiting**: Prevents API abuse and ensures reliability
- **Address Validation**: Comprehensive input validation

## 📊 Analysis Capabilities

### Wallet Types Detected
- Personal wallets
- Exchange addresses
- Smart contracts
- Institutional wallets
- DeFi protocol interactions

### Behavior Patterns
- Trading activity
- DeFi usage patterns
- HODLing behavior
- Business operations
- Arbitrage activities

### Risk Assessment
- Transaction frequency analysis
- Counterparty diversity
- Value distribution patterns
- Temporal behavior analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Etherscan** for providing reliable blockchain data API
- **OpenAI** for GPT-4 AI analysis capabilities
- **ENS** for decentralized naming service
- **React** and **Vite** for the modern development experience
