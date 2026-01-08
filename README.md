# BaseBounty 🎯

**Decentralized Marketplace for Micro-Tasks on Base L2**

BaseBounty is a fully decentralized platform where anyone can post small jobs with ETH payments, and workers can apply, complete tasks, and build onchain reputation. Built on Base L2 for low costs and integrated with Farcaster Mini Apps.

## 🌟 Features

### Core Functionality
- **Post Bounties**: Create tasks with ETH payments and deadlines
- **Apply & Work**: Browse tasks, apply, and submit completed work
- **Secure Payments**: Funds locked in smart contract, released on approval
- **Dispute Resolution**: Community-based voting system for disagreements
- **Onchain Reputation**: Ratings and reputation tracked permanently on Base
- **Multi-Category**: Design, development, writing, translation, research, and more

### Technical Highlights
- Smart contract optimized for Base L2 gas costs
- Reentrancy protection and comprehensive security measures
- 2% platform fee for sustainable ecosystem
- Full test coverage (>80%)
- Farcaster Mini App integration
- Responsive dark-mode UI with Tailwind CSS

## 🏗️ Architecture

```
BaseBounty/
├── contracts/           # Solidity smart contracts
│   ├── BaseBounty.sol  # Main contract (250+ lines)
│   └── test/           # Comprehensive test suite
├── frontend/           # React + TypeScript frontend
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── context/    # Web3 context
│   │   ├── types/      # TypeScript types
│   │   └── utils/      # Contract ABI and helpers
│   └── public/
│       └── .well-known/
│           └── farcaster.json  # Mini App manifest
├── scripts/            # Deploy, verify, interact scripts
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm or yarn
- MetaMask or compatible Web3 wallet
- ETH on Base network

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/basebounty.git
cd basebounty
```

2. **Install dependencies**
```bash
# Install root dependencies (Hardhat)
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

3. **Configure environment**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_basescan_api_key
PLATFORM_WALLET=your_platform_wallet_address
```

4. **Compile contracts**
```bash
npm run compile
```

5. **Run tests**
```bash
npm test
```

## 📝 Smart Contract

### Deploy to Base Mainnet

1. **Make sure you have ETH on Base**
   - Bridge ETH to Base via [bridge.base.org](https://bridge.base.org)
   - Minimum recommended: 0.01 ETH for deployment

2. **Deploy contract**
```bash
npm run deploy:base
```

3. **Copy contract address** from the output

4. **Verify on Basescan**
```bash
npm run verify:base -- <CONTRACT_ADDRESS> <PLATFORM_WALLET>
```

### Test Locally

```bash
# Start local Hardhat node
npm run node

# In another terminal, deploy to local network
npm run deploy:local

# Run interaction script
CONTRACT_ADDRESS=0x... npm run interact
```

### Contract Functions

#### For Creators
- `createBounty()` - Create new bounty with ETH payment
- `acceptWork()` - Accept submitted work and release payment
- `rejectWork()` - Reject work with reason
- `cancelBounty()` - Cancel if no applications
- `rateUser()` - Rate worker after completion

#### For Workers
- `applyToBounty()` - Apply to bounty with cover letter
- `submitWork()` - Submit completed work (URL/IPFS)
- `createDispute()` - Create dispute if work unfairly rejected
- `rateUser()` - Rate creator after completion

#### For Community
- `voteOnDispute()` - Vote on active disputes
- `resolveDispute()` - Execute dispute resolution after timeout

## 🎨 Frontend

### Local Development

1. **Set up environment**
```bash
cd frontend
cp .env.example .env
```

2. **Update `.env`**
```env
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
VITE_BASE_RPC_URL=https://mainnet.base.org
```

3. **Start development server**
```bash
npm run dev
```

4. **Open browser**
   - Navigate to http://localhost:3000
   - Connect MetaMask to Base network

### Build for Production

```bash
cd frontend
npm run build
```

## 🚢 Deploy to Vercel

### Step-by-Step Deployment

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/basebounty.git
git push -u origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Build Settings**
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variables**
   - `VITE_CONTRACT_ADDRESS` - Your deployed contract address
   - `VITE_BASE_RPC_URL` - `https://mainnet.base.org` (optional)

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your Vercel URL (e.g., `https://basebounty.vercel.app`)

6. **Update URLs in code**
   - Update URLs in `frontend/public/.well-known/farcaster.json`
   - Update URLs in `frontend/index.html` meta tags
   - Replace `https://basebounty.vercel.app` with your actual URL

7. **Redeploy**
   - Push changes to GitHub
   - Vercel will automatically redeploy

## 📱 Farcaster Mini App Setup

### Prerequisites
- Deployed frontend on Vercel
- Farcaster account

### Configuration Steps

1. **Install Farcaster SDK** (already done)
```bash
cd frontend
npm install @farcaster/miniapp-sdk
```

2. **SDK Integration** (already done)
   - SDK is imported and initialized in `App.tsx`
   - `sdk.actions.ready()` called on component mount

3. **Create Required Images**

You need to create these images and place them in `frontend/public/`:

- **logo.png** (512x512px)
  - App icon shown in lists
  - Clean, simple design representing tasks/bounties
  - Transparent or solid background

- **splash.png** (1080x1920px)
  - Vertical splash screen shown while loading
  - Include BaseBounty branding
  - Background color: #10b981 (emerald green)

- **embed.png** (1200x630px)
  - OG image for social sharing
  - Horizontal orientation
  - Include key value proposition

- **hero.png** (any size, ~1200x600px recommended)
  - Hero image for landing
  - Showcase main features

- **screenshots/** (3 images, ~1170x2532px each)
  - `1.png` - Bounty list view
  - `2.png` - Bounty detail with applications
  - `3.png` - User profile with reputation

**Design Tips:**
- Use consistent color scheme (emerald green #10b981, dark grays)
- Keep text readable on mobile
- Show actual UI elements
- Use tools like Figma, Canva, or Photoshop

4. **Generate Account Association**

After deploying to Vercel:

1. Go to [https://www.base.dev/preview](https://www.base.dev/preview)
2. Click on "Account association" tool
3. Enter your Vercel domain: `https://basebounty.vercel.app`
4. Click "Verify" and follow instructions
5. Copy the generated `header`, `payload`, and `signature`
6. Update `frontend/public/.well-known/farcaster.json`:

```json
{
  "accountAssociation": {
    "header": "eyJ...",
    "payload": "eyJ...",
    "signature": "MHg..."
  },
  "miniapp": {
    ...
  }
}
```

7. Commit and push changes to trigger redeploy

5. **Test Your Mini App**

1. Go to [https://www.base.dev/preview](https://www.base.dev/preview)
2. Enter your Vercel URL
3. Test all features:
   - Mini App launches correctly
   - Splash screen displays
   - App loads without errors
   - Wallet connection works
   - All interactions function

6. **Publish on Base App**

1. Create a post on [Base App](https://base.app)
2. Include your Vercel URL in the post
3. Your Mini App will automatically appear as an interactive card
4. Users can launch your Mini App directly from Base

## 💰 Gas Costs (Base L2)

Typical transaction costs on Base:

| Action | Estimated Gas | Cost (~0.1 gwei) |
|--------|--------------|------------------|
| Create Bounty | ~150k gas | ~$0.01-0.02 |
| Apply to Bounty | ~80k gas | ~$0.005-0.01 |
| Submit Work | ~60k gas | ~$0.003-0.006 |
| Accept/Reject | ~100k gas | ~$0.006-0.012 |
| Create Dispute | ~120k gas | ~$0.007-0.014 |
| Vote on Dispute | ~70k gas | ~$0.004-0.008 |
| Rate User | ~90k gas | ~$0.005-0.01 |

*Costs are significantly lower than Ethereum mainnet (100-1000x cheaper)*

## 📊 Bounty Categories

- **Design** - Logos, graphics, UI/UX, illustrations
- **Development** - Coding, smart contracts, bug fixes, features
- **Writing** - Articles, blog posts, documentation, copywriting
- **Translation** - Language translation, localization
- **Research** - Market research, data gathering, analysis
- **Marketing** - Social media, content creation, campaigns
- **Data Entry** - Data input, spreadsheet work, organization
- **Review** - Code review, content review, testing
- **Other** - Miscellaneous tasks

## 🔒 Security Features

- **Reentrancy Protection**: Guards on all state-changing functions
- **Checks-Effects-Interactions**: Proper pattern implementation
- **Access Control**: Only authorized users can perform actions
- **Input Validation**: Comprehensive validation of all inputs
- **Custom Errors**: Gas-efficient error handling
- **Locked Funds**: Payments secured in contract until completion
- **Dispute System**: Fair resolution mechanism
- **Deadline Enforcement**: Prevents expired bounty manipulation

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run with gas reporting
npm run test:gas

# Run with coverage
npx hardhat coverage
```

Tests cover:
- Bounty creation and validation
- Application process
- Work submission and review
- Payment distribution
- Dispute creation and voting
- Rating system
- Edge cases and error conditions

## 🛠️ Development

### Project Structure

```
contracts/
├── BaseBounty.sol          # Main smart contract
└── test/
    └── BaseBounty.test.js  # Test suite

frontend/src/
├── components/             # React components
│   ├── Header.tsx
│   ├── BountyList.tsx
│   ├── BountyDetail.tsx
│   ├── CreateBountyForm.tsx
│   └── UserProfile.tsx
├── context/
│   └── Web3Context.tsx    # Web3 connection management
├── hooks/
│   ├── useBounties.ts     # Fetch bounties
│   └── useReputation.ts   # User reputation
├── types/
│   └── index.ts           # TypeScript definitions
└── utils/
    └── BaseBountyABI.json # Contract ABI

scripts/
├── deploy.js              # Deploy contract
├── verify.js              # Verify on Basescan
└── interact.js            # Interact with contract
```

### Tech Stack

**Smart Contract**
- Solidity 0.8.20
- Hardhat
- Ethers.js v6
- Base L2 optimizations

**Frontend**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Ethers.js v6
- @farcaster/miniapp-sdk

**Deployment**
- Vercel (frontend)
- Base Mainnet (contract)

## 🐛 Troubleshooting

### Common Issues

**1. "Invalid Amount" error when creating bounty**
- Ensure payment is at least 0.000001 ETH
- Check you have enough ETH for payment + gas

**2. "Please switch to Base network"**
- MetaMask: Click network dropdown → Add Base Mainnet
- Or use the "Switch to Base" button in the app

**3. "Failed to connect wallet"**
- Ensure MetaMask is installed
- Refresh the page
- Try disconnecting and reconnecting

**4. ".well-known/farcaster.json not found"**
- Verify file exists in `frontend/public/.well-known/`
- Check `vercel.json` has correct rewrites
- Clear Vercel cache and redeploy

**5. "Transaction failed" errors**
- Check you're on Base network
- Verify contract address is correct
- Ensure you have enough ETH for gas
- Check transaction on Basescan for specific error

**6. Mini App not displaying in Farcaster**
- Verify manifest URL is accessible
- Check accountAssociation is filled
- Test at base.dev/preview first
- Ensure all image URLs are valid

### Get Help

- Open an issue on GitHub
- Check contract on Basescan
- Review transaction logs
- Test on Base Sepolia first

## 📚 Additional Resources

- [Base Documentation](https://docs.base.org)
- [Base Mini Apps Guide](https://docs.base.org/mini-apps)
- [Basescan Explorer](https://basescan.org)
- [Base Bridge](https://bridge.base.org)
- [Farcaster](https://www.farcaster.xyz)
- [Vercel Documentation](https://vercel.com/docs)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🎉 Acknowledgments

- Built on [Base](https://base.org) L2
- Integrated with [Farcaster](https://www.farcaster.xyz)
- Deployed on [Vercel](https://vercel.com)

---

**Built with ❤️ for the Base ecosystem**

For questions or support, please open an issue on GitHub.
