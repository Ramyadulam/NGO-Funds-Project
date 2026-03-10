# NGO Fund Management - Blockchain Integration Guide

Complete guide for setting up, deploying, and testing the blockchain-integrated NGO fund management application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Ganache Setup](#ganache-setup)
4. [MetaMask Configuration](#metamask-configuration)
5. [Smart Contract Deployment](#smart-contract-deployment)
6. [Testing](#testing)
7. [Frontend Setup](#frontend-setup)
8. [Running the Application](#running-the-application)
9. [Making a Donation](#making-a-donation)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)
- **MetaMask Browser Extension** - [Download](https://metamask.io/)
- **Ganache CLI or GUI** - [Download](https://trufflesuite.com/ganache/)

### System Requirements

- macOS 12+, Windows 10+, or Linux with 4GB RAM minimum
- Internet connection for initial setup

---

## Installation

### 1. Install Dependencies

#### Backend Setup

```bash
cd backend
npm install
```

#### Blockchain Setup

```bash
cd blockchain
npm install
```

#### Frontend Setup (Root)

```bash
# From project root
npm install
```

### 2. Verify Installation

```bash
# Check Node version
node --version  # Should be v18.0.0 or higher

# Check npm version
npm --version   # Should be v9.0.0 or higher

# Check Hardhat
cd blockchain
npx hardhat --version  # Should show Hardhat version
```

---

## Ganache Setup

### Option 1: Using Ganache GUI (Recommended for Beginners)

1. **Download and Install Ganache**
   - Visit [Truffle Suite](https://trufflesuite.com/ganache/)
   - Download the appropriate version for your OS
   - Install following the installer instructions

2. **Start Ganache**
   - Open the Ganache application
   - Click "New Workspace" or use the default workspace
   - Configure the following settings:
     - **RPC Server**: `http://127.0.0.1:7545` (default)
     - **Network ID**: `1337`
     - **Chain ID**: `1337`

3. **Ganache UI Features**
   - View all accounts with their balances (each starts with 100 ETH)
   - Monitor transactions in real-time
   - View contract deployments
   - Inspect transaction logs

### Option 2: Using Ganache CLI

```bash
# Install globally
npm install -g ganache

# Start Ganache on port 7545
ganache --deterministic --host 0.0.0.0 --port 7545 --chain.chainId 1337

# Optional: Save output to file
ganache --deterministic --chain.chainId 1337 > ganache.log 2>&1 &
```

### Verify Ganache is Running

```bash
# Check if port 7545 is listening
lsof -i :7545  # macOS/Linux
netstat -ano | findstr :7545  # Windows

# Or test the RPC endpoint
curl -X POST http://127.0.0.1:7545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

Expected response:
```json
{"jsonrpc":"2.0","result":"0x539","id":1}
```

---

## MetaMask Configuration

### 1. Install MetaMask

- Go to [MetaMask](https://metamask.io/)
- Click "Download"
- Select your browser (Chrome, Firefox, Edge, etc.)
- Add extension to your browser

### 2. Create or Import MetaMask Account

**If New to MetaMask:**
- Click "Get Started"
- Choose "Create a Wallet"
- Set a strong password
- Save your Secret Recovery Phrase securely

**If Existing Account:**
- Click extension icon
- Choose "Import using account seed phrase"

### 3. Add Ganache Network

1. **Open MetaMask** and click the network dropdown (top of popup)
2. **Click "Add Network"** (or "Add a network manually")
3. **Fill in the Network Details:**
   - Network Name: `Ganache`
   - RPC URL: `http://127.0.0.1:7545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`
   - Block Explorer URL: (leave empty - Ganache has no block explorer)

4. **Save and Switch** to the Ganache network

### 4. Import Ganache Accounts (Optional but Recommended)

To easily test with funded accounts:

1. In Ganache, copy the private key of any account (click the key icon)
2. In MetaMask:
   - Click the account icon (top right)
   - Select "Import Account"
   - Paste the private key
   - Click "Import"
   - Name the account (e.g., "Ganache Account 1")

Now this account has 100 ETH and can make transactions!

---

## Smart Contract Deployment

### 1. Verify Contract Compiles

```bash
cd blockchain
npx hardhat compile
```

Expected output:
```
Compiling 1 file with 0.8.20
Compilation finished successfully
```

### 2. Update Hardhat Config (Already Done)

The hardhat config includes Ganache network:

```javascript
// blockchain/hardhat.config.js
module.exports = {
    solidity: "0.8.20",
    networks: {
        ganache: {
            url: "http://127.0.0.1:7545",
        },
        localhost: {
            url: "http://127.0.0.1:8545"
        }
    }
};
```

### 3. Deploy to Ganache

```bash
cd blockchain

# Deploy to Ganache (requires Ganache to be running)
npx hardhat run scripts/deploy.js --network ganache
```

Expected output:
```
🚀 Deploying NGOFund contract...

📝 Deploying contract from account: 0x... (your account)

✅ NGOFund contract deployed successfully!
📍 Contract Address: 0x... (save this!)

📄 Deployment info saved to: blockchain/deployments/ganache-deployment.json

✅ Contract ABI exported

📦 Frontend config saved to: lib/contracts.json

🎉 Deployment complete!
```

### 4. Save Contract Address

```bash
# The deployment script creates a file with contract info
cat blockchain/deployments/ganache-deployment.json

# Output example:
{
  "contractAddress": "0x1234567890123456789012345678901234567890",
  "deployerAddress": "0x...",
  "network": "ganache",
  "timestamp": "2026-02-13T...",
  "blockNumber": 1
}
```

**Important**: Copy the `contractAddress` to your notes.

---

## Testing

### Run Solidity Tests

```bash
cd blockchain

# Run all tests
npx hardhat test

# Run with verbose output
npx hardhat test --verbose

# Run specific test file
npx hardhat test test/NGOFund.test.js
```

Expected test output:
```
NGOFund Contract
  NGO Registration
    ✓ Should register a new NGO
    ✓ Should store NGO details correctly
    ✓ Should prevent duplicate NGO registration
    ✓ Should reject invalid wallet address
  Donations
    ✓ Should accept a donation
    ✓ Should transfer funds to NGO wallet
    ✓ Should record donation details
    ✓ Should reject donation to unregistered NGO
    ✓ Should reject zero-value donations
    ✓ Should support multiple donations to same NGO
    ✓ Should emit event with timestamp
  Donation Count
    ✓ Should return 0 donations initially
    ✓ Should increment donation count correctly

  13 passing (0.5s)
```

### Interact with Contract via Hardhat Console

```bash
cd blockchain

npx hardhat console --network ganache
```

```javascript
// In the console:
> const NGOFund = await ethers.getContractFactory("NGOFund")
> const contract = NGOFund.attach("0x... CONTRACT_ADDRESS")
> 
> // Get donation count
> await contract.getDonationCount()
> 
> // Get NGO details
> await contract.ngos("507f1f77bcf86cd799439011")
```

---

## Frontend Setup

### 1. Install Dependencies

```bash
# From project root
npm install
```

### 2. Verify Contract Configuration

The deployment script automatically creates `lib/contracts.json`. Verify it exists:

```bash
ls -la lib/contracts.json
cat lib/contracts.json
```

Should contain:
```json
{
  "NGOFund": {
    "address": "0x...",
    "abi": [...]
  }
}
```

### 3. Environment Variables (Optional)

Create `.env.local` in the root directory:

```env
# Blockchain Configuration
NEXT_PUBLIC_GANACHE_RPC_URL=http://127.0.0.1:7545
NEXT_PUBLIC_GANACHE_CHAIN_ID=1337

# Backend Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api
```

---

## Running the Application

### 1. Start Backend Server

```bash
cd backend

# Install dependencies if not done
npm install

# Start the server (make sure MongoDB is running)
npm start

# Expected output:
# 🚀 Server running in development mode on port 5000
# (or the port specified in .env)
```

### 2. Start Frontend Dev Server

```bash
# From project root (in a new terminal)
npm run dev

# Expected output:
# ⚡  Next.js### Option 3: VS Code Tasks (Preferred)

1. **Press**: `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
2. **Type**: `Tasks: Run Task`
3. **Select**: `Start All Services`

This will automatically open separate terminal panels for Ganache, Backend, and Frontend.

---

### 3. Verify Everything is Running

- **Ganache**: Running on port 7545
- **Backend**: Running on port 5001 (or configured port)
- **Frontend**: Running on port 3000
- **MetaMask**: Connected to Ganache network

```bash
# Test connectivity in another terminal
curl http://localhost:3000        # Frontend
curl http://localhost:5001/api/health  # Backend
curl -X POST http://127.0.0.1:7545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'  # Ganache
```

---

## Making a Donation

### Step-by-Step Guide

#### 1. Open the Application

- Navigate to `http://localhost:3000`
- You should see the NGO Fund Management landing page

#### 2. Register or Login

- Click "Sign up" to create a new account, or "Login" if you have one
- Fill in your details

#### 3. Connect MetaMask

- Look for the "Connect Wallet" button in the top navigation bar
- Click it
- MetaMask will pop up
- Review the connection request and approve it
- Your wallet address should now appear in the navbar

#### 4. Verify Network

- Check the navbar - it should show a green checkmark next to your address if you're on Ganache
- If not green, click the dropdown and select "Switch to Ganache"

#### 5. Visit an NGO

- Click "Donate" in the navigation or go to the donate page
- Browse available NGOs
- Click "Donate Now" for an NGO

#### 6. Fill Donation Form

- **Amount**: Enter an amount in ETH (e.g., 0.5)
- **Message**: Write why you're supporting this NGO
- Review the information
- Click "Donate to [NGO Name]"

#### 7. Confirm in MetaMask

- MetaMask will show a transaction confirmation
- Review the details
- Adjust gas (usually not needed on Ganache)
- Click "Confirm"

#### 8. Monitor Ganache

- Open Ganache UI
- You should see a new block created
- The transaction should appear in the **Transactions** tab
- Watch the account balances update

#### 9. View Success

- After confirmation (1-2 seconds), you'll see a success message
- The transaction hash will be displayed
- Your donation is now on the blockchain!

---

## Monitoring Transactions in Ganache

### Ganache UI Dashboard

1. **Blocks Tab**
   - View each block created
   - See transaction count
   - Check gas usage

2. **Transactions Tab**
   - See all transactions
   - Click a transaction to view details
   - Monitor:
     - From address
     - To address
     - Value transferred
     - Gas used
     - Status (Success/Failed)

3. **Accounts Tab**
   - View account balances
   - See ETH distribution
   - Copy private keys (for testing)

4. **Logs Tab**
   - View contract events
   - See emitted events from smart contract
   - Monitor "NGORegistered" and "DonationMade" events

---

## Key Files and Locations

```
blockchain-ngo-fund-management/
├── blockchain/
│   ├── contracts/
│   │   └── NGOFund.sol          # Main smart contract
│   ├── scripts/
│   │   └── deploy.js             # Deployment script
│   ├── test/
│   │   └── NGOFund.test.js        # Contract tests
│   ├── deployments/
│   │   └── ganache-deployment.json # Deployment info (auto-created)
│   ├── abi/
│   │   └── NGOFund.json           # Contract ABI (auto-created)
│   └── hardhat.config.js
├── lib/
│   ├── web3-context.tsx           # Web3/MetaMask context provider
│   ├── blockchain-utils.ts        # Utility functions
│   ├── contracts.json             # Frontend contract config (auto-created)
│   └── api.ts
├── components/
│   ├── wallet-connector.tsx        # MetaMask connector button
│   ├── donation-form.tsx           # Updated donation form with blockchain
│   └── ui/
│       └── alert.tsx              # Alert component
├── app/
│   ├── layout.tsx                 # Updated with Web3 provider
│   ├── providers.tsx              # Client-side providers
│   ├── donate/
│   │   └── page.tsx               # Donation page
│   └── ...
└── backend/                        # Backend server
```

---

## Troubleshooting

### MetaMask Issues

**Problem**: MetaMask shows "Network Error" or "Unable to connect"

**Solution**:
```bash
# 1. Verify Ganache is running
lsof -i :7545

# 2. Check the RPC URL in MetaMask settings matches:
# http://127.0.0.1:7545 (not localhost or 127.0.0.1:8545)

# 3. Try switching networks:
# MetaMask → Choose a different network → Back to Ganache

# 4. Restart MetaMask by clicking the extension icon
```

### Contract Deployment Fails

**Problem**: `Error: cannot estimate gas` or deployment fails

**Solution**:
```bash
# 1. Verify Ganache is running
curl http://127.0.0.1:7545

# 2. Clear artifacts and recompile
cd blockchain
rm -rf artifacts cache
npx hardhat compile

# 3. Check hardhat.config.js has correct network
# url: "http://127.0.0.1:7545"

# 4. Try deployment again
npx hardhat run scripts/deploy.js --network ganache
```

### Wallet Not Connecting

**Problem**: "Connect Wallet" button doesn't work or MetaMask doesn't open

**Solution**:
```bash
# 1. Verify MetaMask is installed
# Check browser extensions

# 2. Try opening MetaMask directly before clicking button
# Click extension icon → Ensure connected

# 3. Clear browser cache and refresh
# Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)

# 4. Check browser console for errors
# Press F12 → Console tab → Look for red errors
```

### Transaction Rejected

**Problem**: Transaction fails with error message

**Common Errors**:
- "NGO not registered on blockchain" → Register NGO first via admin
- "Invalid wallet address" → Use proper Ethereum address format (0x...)
- "Insufficient balance" → Make sure account has enough ETH

**Solution**:
```bash
# View transaction details in Ganache
# Transactions tab → Click transaction → View error logs
```

### Frontend Can't Find Contract

**Problem**: "Cannot read properties of null (reading 'donate')"

**Solution**:
```bash
# 1. Verify deployment created lib/contracts.json
ls -la lib/contracts.json

# 2. Check contract address is correct
cat lib/contracts.json

# 3. Redeploy if needed
cd blockchain
npx hardhat run scripts/deploy.js --network ganache

# 4. Restart frontend dev server
# Kill process: Ctrl+C
# Restart: npm run dev
```

### Backend Connection Issues

**Problem**: Frontend can't reach backend API

**Solution**:
```bash
# 1. Verify backend is running
curl http://localhost:5001/api/health

# 2. Check CORS is enabled (should be in backend/index.js)

# 3. Verify MongoDB is running if needed

# 4. Check environment variables match the API URL
# In .env.local or hardcoded in lib/api.ts
```

### Port Already in Use

**Problem**: "Port 3000 already in use" or similar

**Solution**:
```bash
# Find and kill the process
# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- -p 3001
```

---

## Advanced: Manual Transaction Testing

### Using Hardhat Console

```bash
cd blockchain
npx hardhat console --network ganache
```

```javascript
// Get the accounts
const accounts = await ethers.getSigners()
const [deployer, donor, ngo] = accounts

// Get contract
const NGOFund = await ethers.getContractFactory("NGOFund")
const contract = NGOFund.attach("0x... YOUR_CONTRACT_ADDRESS")

// Register an NGO
const mongoId = "507f1f77bcf86cd799439011"
const tx1 = await contract.registerNGO(
  mongoId,
  "Test NGO",
  ngo.address
)
await tx1.wait()

// Make a donation
const tx2 = await donor.sendTransaction({
  to: contract.address,
  data: contract.interface.encodeFunctionData("donate", [
    mongoId,
    "Great work!"
  ]),
  value: ethers.parseEther("1.0")
})
await tx2.wait()

// Check donation count
const count = await contract.getDonationCount()
console.log("Donation count:", count.toString())

// Get donation details
const donation = await contract.donations(0)
console.log("Donation:", donation)
```

---

## Success Checklist

- [ ] Node.js v18+ installed
- [ ] Ganache running on port 7545
- [ ] MetaMask installed and Ganache network added
- [ ] MetaMask account imported with test funds
- [ ] Backend dependencies installed
- [ ] Blockchain dependencies installed
- [ ] Frontend dependencies installed
- [ ] Smart contract compiles successfully
- [ ] Smart contract deploys to Ganache
- [ ] Contract address saved
- [ ] `lib/contracts.json` created
- [ ] Backend server running on port 5001
- [ ] Frontend dev server running on port 3000
- [ ] MetaMask connected in browser
- [ ] Test donation processed successfully
- [ ] Transaction visible in Ganache UI

---

## Next Steps

1. **Customize Smart Contract**: Modify NGOFund.sol for additional features
2. **Add More Tests**: Expand test/NGOFund.test.js coverage
3. **Integrate with Backend**: Sync blockchain data with MongoDB
4. **Deploy to Testnet**: Move from Ganache to Ethereum testnet (Sepolia, etc.)
5. **Production Deployment**: Deploy to mainnet with proper security audits

---

## Support and Resources

- **Hardhat Docs**: https://hardhat.org/docs
- **Ethers.js Docs**: https://docs.ethers.org/
- **MetaMask Docs**: https://docs.metamask.io/
- **Solidity Docs**: https://docs.soliditylang.org/
- **Ganache Docs**: https://trufflesuite.com/docs/ganache/

---

## License

MIT - See LICENSE file for details
