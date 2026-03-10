# NGO Fund Management - Complete Demonstration Guide

This guide provides step-by-step instructions for demonstrating the blockchain-integrated NGO fund management application.

## Prerequisites Checklist

Before starting the demonstration, ensure:

- ✅ Node.js v18+ installed
- ✅ All dependencies installed (`npm install` in all directories)
- ✅ MetaMask browser extension installed
- ✅ Ganache running on `http://127.0.0.1:7545` with Chain ID 1337
- ✅ Ganache network added to MetaMask
- ✅ At least one test account in MetaMask with Ganache connection

---

## Demo Flow Overview

1. **Smart Contract Compilation & Testing**
2. **Contract Deployment to Ganache**  
3. **MetaMask Wallet Connection**
4. **Frontend Integration Verification**
5. **NGO Registration on Blockchain**
6. **Live Donation Transaction**
7. **Transaction Verification in Ganache UI**

---

## Part 1: Smart Contract Compilation & Testing

### 1.1 Compile the Contract

```bash
cd blockchain

# Compile the Solidity contract
npx hardhat compile
```

**Expected Output:**
```
Compiling 1 file with 0.8.20
Compilation finished successfully
```

**What to demonstrate:**
- Show the contract source code: `blockchain/contracts/NGOFund.sol`
- Explain the two main functions:
  - `registerNGO()` - Registers an NGO on the blockchain
  - `donate()` - Allows donors to send ETH and update donation records

### 1.2 Run Smart Contract Tests

```bash
cd blockchain

# Run the complete test suite
npx hardhat test --verbose
```

**Expected Output:**
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

  13 passing
```

**Key Points to Explain:**
- Tests verify all critical functionality
- Contract handles invalid inputs correctly
- Events are emitted for transparency (blockchain logging)
- Funds are properly transferred to NGO wallets

---

## Part 2: Contract Deployment to Ganache

### 2.1 Start Ganache

**Using Ganache GUI:**
1. Open the Ganache application
2. Click "New Workspace" or use default
3. Verify it's running on port 7545
4. Note the RPC endpoint: `http://127.0.0.1:7545`

**Using Ganache CLI:**
```bash
ganache --deterministic --host 0.0.0.0 --port 7545 --chain.chainId 1337
```

### 2.2 Deploy Contract

```bash
cd blockchain

npx hardhat run scripts/deploy.js --network ganache
```

**Expected Output:**
```
🚀 Deploying NGOFund contract...

📝 Deploying contract from account: 0x1234567890ABCDEF...

✅ NGOFund contract deployed successfully!
📍 Contract Address: 0xABCDEF1234567890...

📄 Deployment info saved to: blockchain/deployments/ganache-deployment.json

✅ Contract ABI exported

📦 Frontend config saved to: lib/contracts.json

🎉 Deployment complete!
```

### 2.3 Verify Deployment

**In Ganache UI:**
1. Click on the **Blocks** tab
2. You should see Block #1 with the deployment transaction
3. Click on **Transactions** tab
4. You should see one transaction (contract creation)
5. Click the transaction to see details:
   - Type: Contract Creation
   - From: Deployer account
   - Contract Address: The newly deployed contract
   - Status: Success

**Verify files created:**
```bash
# Check deployment info was saved
cat blockchain/deployments/ganache-deployment.json

# Check contract ABI was exported
cat blockchain/abi/NGOFund.json

# Check frontend config was updated
cat lib/contracts.json
```

---

## Part 3: MetaMask Setup & Wallet Connection

### 3.1 Add Ganache Network to MetaMask

1. Open MetaMask extension
2. Click the network dropdown (top of popup)
3. Click "Add Network" or "Add a network manually"
4. Fill in the details:
   - **Network Name:** Ganache
   - **RPC URL:** http://127.0.0.1:7545
   - **Chain ID:** 1337
   - **Currency Symbol:** ETH
5. Click "Save"

### 3.2 Import Test Account

1. In Ganache UI, find an account with 100 ETH
2. Click the key icon next to the account to copy the private key
3. In MetaMask:
   - Click account circle (top right)
   - Select "Import Account"
   - Paste private key
   - Click "Import"
4. Name the account (e.g., "Ganache Test Account")

**Result:** You now have a MetaMask account with 100 ETH on Ganache!

---

## Part 4: Frontend & Application Setup

### 4.1 Start the Backend

```bash
# In Terminal 1
cd backend

# Start the backend server
npm start
```

**Expected Output:**
```
🚀 Server running in development mode on port 5001
Connection to MongoDB established (or similar)
```

### 4.2 Start the Frontend

```bash
# In Terminal 2 (from project root)
npm run dev
```

**Expected Output:**
```
⚡  Next.js started server on 0.0.0.0:3000, url: http://localhost:3000
```

### 4.3 Open the Application

1. Open browser to `http://localhost:3000`
2. You should see the NGO Fund Management landing page
3. Look for the "Connect Wallet" button in the top right navbar

---

## Part 5: Live Demonstration

### 5.1 Connect MetaMask

1. Click "Connect Wallet" button in navbar
2. MetaMask popup appears
3. Click "Next" and then "Connect"
4. You should see your shortened wallet address in the navbar (e.g., "0x1234...abcd")
5. If network is Ganache, you'll see a green checkmark ✓

**Demo Points:**
- Show the wallet connector is working
- Display the address format and balance indicator
- Explain that the connection is secure and local to Ganache

### 5.2 Navigate to Donation Page

1. Click "Donate" in the navigation menu
2. You should see a list of available NGOs
3. Click "Donate Now" on an NGO

**Page Elements:**
- NGO name and description
- Donation form with two fields:
  - Amount (in ETH)
  - Message (your reason for donating)

### 5.3 Make a Test Donation

**Fill the form:**
- Amount: `0.5` (half ETH)
- Message: "Supporting great work on [cause]"

**Click "Donate to [NGO Name]"**

**MetaMask Confirmation:**
1. MetaMask popup appears with transaction details:
   - From: Your wallet address
   - To: Smart contract address
   - Amount: 0.5 ETH
   - Gas fee: (calculated by Ganache, usually very small)

2. Click "Confirm" in MetaMask

**Frontend Feedback:**
- Loading indicator: "Processing Donation..."
- Success message: "🎉 Donation Successful!"
- Transaction hash displayed: "TX: 0x1234...abcd"

---

## Part 6: Transaction Verification in Ganache

### 6.1 View in Ganache UI

**Navigate to Ganache Dashboard:**
1. Open Ganache UI (if using GUI)
2. Click on **"Blocks"** tab
3. You should see new blocks created

**Key Observations:**
- Block numbers incrementing
- More transactions appearing
- Gas usage visualization

### 6.2 Inspect Transaction Details

**In Ganache Transactions Tab:**
1. Click **"Transactions"** tab
2. Find the most recent transaction (your donation)
3. Click the transaction to view details:

```
Transaction Details:
├── Hash: 0x... (unique identifier)
├── Block: 2 (which block contains this tx)
├── From: 0x... (your wallet)
├── To: 0x... (contract address)
├── Value: 0.5 ETH (amount transferred)
├── Gas Used: ~80,000 (computation cost)
├── Status: Success ✓
└── Timestamp: (when it was processed)
```

### 6.3 View Account Changes

**In Ganache Accounts Tab:**
1. Click **"Accounts"** tab
2. Your account should show:
   - Previous balance: 100 ETH
   - Current balance: ~99.5 ETH (0.5 donated + tiny gas fee)
3. NGO wallet account should show:
   - Increased balance by 0.5 ETH

**Demo Point:** Show the transparent fund transfer!

### 6.4 View Events/Logs

**In Ganache Logs Tab (if available):**
1. Click **"Logs"** tab
2. You should see events emitted:
   - `DonationMade` event
   - Parameters:
     - donor: Your address
     - ngoId: NGO ID
     - amount: 0.5 ETH
     - timestamp: When the donation happened

---

## Part 7: Advanced Features Demonstration

### 7.1 Multiple Donations

**Create another donation:**
1. Go back to donate page
2. Choose a different NGO (or same one)
3. Enter different amount (e.g., 0.25 ETH)
4. Write a different message
5. Confirm in MetaMask

**Show in Ganache:**
- New block created
- Multiple transactions visible
- Running transaction count increases
- Gas accumulates

### 7.2 Interact with Contract Directly

**Via Hardhat Console (for advanced demo):**

```bash
cd blockchain
npx hardhat console --network ganache
```

```javascript
// Connect to deployed contract
const NGOFund = await ethers.getContractFactory("NGOFund");
const address = "0x..."; // from lib/contracts.json
const contract = NGOFund.attach(address);

// Query blockchain data
const count = await contract.getDonationCount();
console.log("Total donations on blockchain:", count.toString());

// Get NGO details
const ngo = await contract.ngos("ngo-mongo-id");
console.log("NGO details:", ngo);

// Get donation details
const donation = await contract.donations(0);
console.log("First donation:", donation);
```

### 7.3 Explain Web3 Integration

**Show the technical implementation:**

1. **Wallet Connection** - `components/wallet-connector.tsx`
   - MetaMask integration
   - Address display and management
   - Network switching

2. **Smart Contract Interaction** - `lib/web3-context.tsx`
   - Contract methods (donate, registerNGO)
   - Error handling
   - Event listening

3. **Utilities** - `lib/blockchain-utils.ts`
   - Address formatting
   - Currency conversion
   - Validation functions

---

## Part 8: Key Features to Highlight

### ✅ Transparency
- Every donation is permanently recorded on the blockchain
- Transaction hashes provide immutable proof
- Anyone can verify donations in Ganache UI

### ✅ Security  
- Smart contracts handle fund transfers
- MetaMask provides secure signing
- Ganache provides controlled test environment

### ✅ Integration
- Frontend connects seamlessly to blockchain
- Backend logs donations for off-chain analytics
- Real-time transaction feedback to users

### ✅ User Experience
- Simple donation form
- Wallet connection in navbar
- Clear transaction status and confirmation
- Error handling with helpful messages

---

## Troubleshooting During Demo

### MetaMask Won't Connect
```bash
# Check MetaMask is on Ganache network
# Check Ganache is running: lsof -i :7545
# Try hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Linux/Windows)
```

### Transaction Fails
```bash
# Check account has sufficient ETH (should have 100 ETH)
# Check Ganache is running
# Check contract address in lib/contracts.json matches what was deployed
```

### Can't Find Transaction in Ganache
```bash
# Refresh Ganache UI (F5)
# Check you're on the correct network in MetaMask
# Check the transaction was actually confirmed (look for success popup)
```

---

## Demo Script Timeline

**~45 minutes total:**

1. **5 min** - Explain blockchain & smart contracts
2. **5 min** - Show smart contract compilation and tests
3. **5 min** - Deploy contract and verify in Ganache
4. **5 min** - Setup MetaMask and connect wallet
5. **10 min** - Make donation and verify transaction
6. **5 min** - Make second donation showing scaling
7. **3 min** - Q&A and technical discussion

---

## Key Metrics to Track

| Metric | Value |
|--------|-------|
| Contracts Deployed | 1 (NGOFund) |
| Test Coverage | 13/13 passing |
| Blockchain Network | Ganache (Chain ID: 1337) |
| Test Accounts | Multiple (Ganache provides 10) |
| Initial Account Balance | 100 ETH each |
| Average Gas Usage | ~50,000-100,000 gas |
| Transaction Time | <1 second on local network |
| Total Account Balance After Demo | 98-99 ETH (after donations + fees) |

---

## Success Indicators

✅ **Smart Contract:**
- Compiles without errors
- All tests pass
- Deploys successfully to Ganache

✅ **MetaMask:**
- Connects to application
- Shows correct account and balance
- Signs transactions

✅ **Donation Flow:**
- Form accepts input
- Transaction created successfully
- MetaMask shows confirmation
- Ganache records transaction
- Balances update correctly

✅ **Blockchain Transparency:**
- Transaction visible in Ganache UI
- Events emitted correctly
- Fund transfer confirmed
- All data immutable

---

## Next Steps for Production

1. **Deploy to Testnet** (Sepolia, Goerli)
2. **Add more NGOs** and test data
3. **Implement event tracking** off-chain
4. **Add donation history** view
5. **Create admin dashboard** for NGO management
6. **Security audit** before mainnet deployment

---

## Questions to Answer During Demo

**Q: Why use blockchain for donations?**
A: Immutability, transparency, and accountability. Every donation is permanently recorded and verifiable.

**Q: Is this real cryptocurrency?**
A: On Ganache (test), no - it's test ETH. On mainnet, yes - real values.

**Q: How secure is this?**
A: Smart contracts are audited code. MetaMask provides secure key management. The blockchain provides immutability.

**Q: Can anyone see my donations?**
A: Yes, all blockchain data is public. You can remain anonymous by using different wallet addresses for different donations.

**Q: What happens if you want to change a donation?**
A: You can't - this is a feature, not a bug. It ensures accountability and prevents manipulation.

---

## Resources

- **Ganache UI Documentation:** https://trufflesuite.com/docs/ganache/ganache-guide/
- **MetaMask Documentation:** https://docs.metamask.io/
- **Ethers.js Documentation:** https://docs.ethers.org/
- **Hardhat Documentation:** https://hardhat.org/docs

---

**Ready to showcase blockchain transparency! 🚀**
