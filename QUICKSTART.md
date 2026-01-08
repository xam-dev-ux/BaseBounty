# BaseBounty Quick Start ⚡

Get BaseBounty running locally in 5 minutes.

## Prerequisites

- Node.js v18+
- Git
- MetaMask with Base network

## 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

## 2. Test Smart Contract

```bash
# Compile contracts
npm run compile

# Run tests
npm test
```

All tests should pass ✅

## 3. Run Frontend Locally

```bash
cd frontend
npm run dev
```

Open http://localhost:3000

**Note:** Without deployed contract, you can only see the UI. For full functionality, deploy the contract first.

## 4. Deploy Contract (Optional - Local Testing)

```bash
# Terminal 1: Start local Hardhat node
npm run node

# Terminal 2: Deploy to local network
npm run deploy:local
```

Copy the contract address and add to `frontend/.env`:
```env
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Restart frontend dev server.

## 5. Connect MetaMask

1. Open app at http://localhost:3000
2. Click "Connect Wallet"
3. For local testing: Add Hardhat network to MetaMask
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency: ETH

## Next Steps

- **Deploy to Base Mainnet**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Create Images**: See [frontend/public/IMAGES_README.md](frontend/public/IMAGES_README.md)
- **Full Documentation**: See [README.md](README.md)

## Common Issues

**"Cannot connect wallet"**
- Ensure MetaMask is installed
- Refresh the page
- Check you're on correct network

**"Module not found"**
- Run `npm install` in root
- Run `npm install` in frontend directory
- Clear cache: `rm -rf node_modules && npm install`

**Tests failing**
- Update to Node.js v18+
- Run `npm run clean` then `npm run compile`

## Project Structure

```
basebounty/
├── contracts/          # Solidity contracts
│   ├── BaseBounty.sol
│   └── test/
├── frontend/          # React app
│   ├── src/
│   └── public/
├── scripts/           # Deploy scripts
├── README.md          # Full documentation
├── DEPLOYMENT.md      # Deployment guide
└── QUICKSTART.md      # This file
```

## Key Commands

```bash
# Contracts
npm run compile        # Compile Solidity
npm test              # Run contract tests
npm run deploy:base   # Deploy to Base

# Frontend
cd frontend
npm run dev           # Development server
npm run build         # Production build
npm run preview       # Preview production build
```

## Need Help?

- Check [README.md](README.md) for detailed docs
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment steps
- Open an issue on GitHub
- Review contract tests for usage examples

---

**Ready to deploy? See [DEPLOYMENT.md](DEPLOYMENT.md)** 🚀
