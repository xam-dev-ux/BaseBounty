# BaseBounty Deployment Guide

Complete step-by-step guide to deploy BaseBounty to production.

## Prerequisites Checklist

Before starting deployment:
- [ ] Node.js v18+ installed
- [ ] Git installed
- [ ] GitHub account created
- [ ] Vercel account created
- [ ] MetaMask installed with Base network added
- [ ] ~0.02 ETH on Base Mainnet for deployment
- [ ] Basescan API key (get from https://basescan.org/myapikey)
- [ ] All images created (see frontend/public/IMAGES_README.md)

## Part 1: Smart Contract Deployment

### Step 1: Clone and Setup

```bash
# Clone repository
git clone https://github.com/yourusername/basebounty.git
cd basebounty

# Install dependencies
npm install
cd frontend && npm install && cd ..
```

### Step 2: Configure Environment

```bash
# Copy environment file
cp .env.example .env

# Edit .env file
nano .env
```

Add your values:
```env
PRIVATE_KEY=your_wallet_private_key
PLATFORM_WALLET=your_wallet_address_for_fees
BASESCAN_API_KEY=your_basescan_api_key
```

**Security Warning:** Never commit your `.env` file to Git!

### Step 3: Compile and Test

```bash
# Compile contracts
npm run compile

# Run tests
npm test
```

Expected output: All tests should pass ✅

### Step 4: Deploy to Base Mainnet

```bash
# Deploy contract
npm run deploy:base
```

You'll see output like:
```
🚀 Deploying BaseBounty contract to base
📝 Deploying with account: 0x...
💰 Account balance: 0.05 ETH
🏦 Platform wallet: 0x...

✅ BaseBounty deployed successfully!
📍 Contract address: 0xABC123...
```

**IMPORTANT:** Copy the contract address! You'll need it.

### Step 5: Verify on Basescan

```bash
# Replace with your contract address and platform wallet
npm run verify:base -- 0xYourContractAddress 0xYourPlatformWallet
```

Wait for verification to complete. Check on Basescan:
```
https://basescan.org/address/0xYourContractAddress
```

### Step 6: Test Contract Interaction

```bash
# Set contract address and test
CONTRACT_ADDRESS=0xYourContractAddress npm run interact
```

Should show contract info without errors.

---

## Part 2: Frontend Deployment to Vercel

### Step 1: Update Frontend Environment

```bash
cd frontend
cp .env.example .env
nano .env
```

Add your contract address:
```env
VITE_CONTRACT_ADDRESS=0xYourContractAddress
VITE_BASE_RPC_URL=https://mainnet.base.org
```

### Step 2: Update Placeholder Images

**Option A: Use Real Images** (Recommended)
- Create images as described in `frontend/public/IMAGES_README.md`
- Place them in `frontend/public/`

**Option B: Use Placeholders** (Quick test)
- Temporary SVG logo already created
- Create simple placeholder PNGs or use online generators

### Step 3: Test Locally

```bash
# From frontend directory
npm run dev
```

Open http://localhost:3000 and test:
- [ ] Connect wallet works
- [ ] Can view bounties list
- [ ] Can create bounty (test with small amount)
- [ ] UI looks correct
- [ ] No console errors

### Step 4: Build for Production

```bash
# From frontend directory
npm run build
```

Should complete without errors.

### Step 5: Push to GitHub

```bash
# From project root
git add .
git commit -m "Initial BaseBounty deployment"
git branch -M main
git remote add origin https://github.com/yourusername/basebounty.git
git push -u origin main
```

### Step 6: Deploy to Vercel

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Import your `basebounty` repository

3. **Configure Project**
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add:
     ```
     VITE_CONTRACT_ADDRESS = 0xYourContractAddress
     VITE_BASE_RPC_URL = https://mainnet.base.org
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get your URL: `https://basebounty-xxxxx.vercel.app`

### Step 7: Update URLs in Code

Now that you have your Vercel URL, update it everywhere:

1. **Update farcaster.json**
```bash
# Edit frontend/public/.well-known/farcaster.json
# Replace all instances of https://basebounty.vercel.app
# with your actual Vercel URL
```

2. **Update index.html**
```bash
# Edit frontend/index.html
# Update meta tags with your Vercel URL
```

3. **Commit and Push**
```bash
git add .
git commit -m "Update URLs with production domain"
git push
```

Vercel will automatically redeploy (takes ~2 minutes).

---

## Part 3: Farcaster Mini App Setup

### Step 1: Verify Manifest Accessibility

Visit in browser:
```
https://your-vercel-url.vercel.app/.well-known/farcaster.json
```

Should see JSON with your Mini App config.

If 404 error:
- Check `vercel.json` exists in frontend directory
- Verify `.well-known` folder has correct path
- Redeploy on Vercel

### Step 2: Generate Account Association

1. Go to https://www.base.dev/preview

2. Look for "Account association" section

3. Enter your Vercel URL (full URL with https://)

4. Click "Verify" and follow wallet signing prompts

5. Copy the generated values:
   - `header`
   - `payload`
   - `signature`

6. Update `frontend/public/.well-known/farcaster.json`:
```json
{
  "accountAssociation": {
    "header": "eyJmaWQ...",
    "payload": "eyJkb21...",
    "signature": "MHg0ZG..."
  },
  "miniapp": {
    ...
  }
}
```

7. Commit and push:
```bash
git add frontend/public/.well-known/farcaster.json
git commit -m "Add account association"
git push
```

### Step 3: Test Mini App

1. Go to https://www.base.dev/preview

2. Enter your Vercel URL

3. Click "Preview"

4. Test thoroughly:
   - [ ] Mini App frame loads
   - [ ] Splash screen appears
   - [ ] App content displays correctly
   - [ ] Wallet connection works
   - [ ] All features functional
   - [ ] No console errors

### Step 4: Publish on Base App

1. Go to https://base.app

2. Create a new post

3. Include your Vercel URL in the post text

4. Add description: "Check out BaseBounty - a decentralized micro-tasks marketplace on Base! 🎯"

5. Post it

6. Your Mini App should appear as an interactive card!

Users can now launch your Mini App directly from the Base feed.

---

## Part 4: Post-Deployment

### Monitor Your Contract

1. **Add to Portfolio**
   - Add contract address to your MetaMask
   - Monitor on Basescan
   - Set up alerts for large transactions

2. **Check Logs**
   - Monitor Vercel deployment logs
   - Check browser console for errors
   - Review Basescan for failed transactions

### Test End-to-End

Create a test bounty with real ETH:

1. Connect wallet to your deployed app
2. Create a small bounty (0.000001 ETH)
3. Use a second wallet to apply
4. Submit work
5. Accept work
6. Verify payment received
7. Test rating system

### Promote Your App

- Share on Twitter/X with #Base #Farcaster
- Post in Base Discord
- Share in Farcaster channels
- Add to Base ecosystem lists
- Write a blog post/tutorial

---

## Troubleshooting

### Contract Deployment Fails

**Error: Insufficient funds**
- Need more ETH on Base
- Bridge at bridge.base.org

**Error: Invalid private key**
- Check PRIVATE_KEY in .env
- Must be 64 hex characters
- No "0x" prefix

### Vercel Deployment Fails

**Build fails**
- Check all dependencies installed
- Run `npm run build` locally first
- Check logs for specific error

**Environment variables not working**
- Must start with `VITE_`
- Redeploy after adding variables
- Check spelling exactly

### Mini App Not Working

**.well-known/farcaster.json 404**
- Verify `vercel.json` in frontend root
- Check `.well-known` folder path
- Clear Vercel cache and redeploy

**Mini App doesn't launch**
- Verify account association complete
- Check all URLs are correct
- Test manifest at base.dev/preview
- Verify images are accessible

### Wallet Connection Issues

**"Please switch to Base network"**
- Add Base network to MetaMask
- Chain ID: 8453
- RPC: https://mainnet.base.org

**Transactions failing**
- Verify correct network (Base mainnet)
- Check contract address is correct
- Ensure sufficient ETH for gas
- Check transaction on Basescan

---

## Maintenance

### Regular Tasks

- Monitor contract activity on Basescan
- Check Vercel analytics
- Review error logs
- Update dependencies monthly
- Backup important data

### Updating the App

```bash
# Make changes
git add .
git commit -m "Description of changes"
git push

# Vercel auto-deploys
```

### Emergency Procedures

**If contract has critical bug:**
- Deploy new version
- Update frontend with new address
- Notify users
- Consider migration script

**If frontend down:**
- Check Vercel status
- Review deployment logs
- Rollback if needed
- Have backup deployment ready

---

## Success Checklist

Your deployment is complete when:

- [ ] Contract deployed and verified on Basescan
- [ ] Frontend live on Vercel
- [ ] `.well-known/farcaster.json` accessible
- [ ] Account association generated and added
- [ ] Mini App tested at base.dev/preview
- [ ] Posted on Base App successfully
- [ ] End-to-end test completed with real transaction
- [ ] All images displaying correctly
- [ ] No console errors in production
- [ ] Contract interaction working
- [ ] Wallet connection functioning

## Need Help?

- Open issue on GitHub
- Ask in Base Discord: discord.gg/base
- Join Farcaster: warpcast.com
- Check Base docs: docs.base.org

---

**Congratulations! Your BaseBounty app is now live! 🎉**

Share your deployment:
- Tweet: "Just deployed BaseBounty on @base! 🎯"
- Tag: @base, @farcaster
- Add screenshots
- Share your Vercel URL
