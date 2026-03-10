# Blockchain Integration - NFO Fund Management

## Overview

This document provides a quick summary of the blockchain integration added to the NGO Fund Management application.

## What's New 🚀

### ✨ Key Features

1. **MetaMask Integration**
   - Wallet connection directly in the navbar
   - Safe, client-side transaction signing
   - Network switching for Ganache compatibility

2. **Smart Contracts (Solidity)**
   - `NGOFund.sol` - Main donation contract
   - Register NGOs on blockchain
   - Process donations with fund transfers
   - Immutable transaction records

3. **Blockchain Transactions**
   - Real Ethereum transactions on Ganache
   - Each donation creates a permanent blockchain record
   - Transaction hashes for verification
   - Event logging for transparency

4. **Frontend Web3 Integration**
   - Ethers.js for blockchain interaction
   - React Context for wallet state management
   - Donation form with blockchain execution
   - Real-time transaction feedback

5. **Local Testing Environment**
   - Ganache for private Ethereum network
   - 10 pre-funded test accounts (100 ETH each)
   - Fast block confirmation
   - Complete transaction visibility

## Getting Started

### Quick Setup (5 minutes)

```bash
# 1. Ensure Ganache is running on port 7545
# macOS: brew install ganache-cli && ganache
# or use Ganache GUI from https://trufflesuite.com/ganache/

# 2. Install dependencies
npm install
cd blockchain && npm install && cd ..

# 3. Deploy smart contracts
cd blockchain
npx hardhat run scripts/deploy.js --network ganache
cd ..

# 4. Start backend
cd backend && npm start

# 5. Start frontend (in new terminal)
npm run dev

# 6. Open http://localhost:3000
# Connect MetaMask and make a test donation!
```

**For detailed setup instructions, see [BLOCKCHAIN_SETUP.md](./BLOCKCHAIN_SETUP.md)**

## Architecture

```
Frontend (Next.js + React)
    ↓
Web3 Context Provider
    ↓
MetaMask (Wallet & Transactions)
    ↓
Ethers.js (Web3 Library)
    ↓
Ganache (Local Ethereum Network)
    ↓
NGOFund Smart Contract (Solidity)
    ↓
Backend API (Express + MongoDB)
```

## Key Files

### Smart Contracts
- `blockchain/contracts/NGOFund.sol` - Main donation contract (100 lines)
- `blockchain/scripts/deploy.js` - Deployment script with ABI export
- `blockchain/test/NGOFund.test.js` - Comprehensive test suite (200+ lines)

### Frontend Integration
- `lib/web3-context.tsx` - React Context for Web3 state (300 lines)
- `lib/blockchain-utils.ts` - Utility functions (200 lines)
- `components/wallet-connector.tsx` - MetaMask connection UI
- `components/donation-form.tsx` - Enhanced donation form with blockchain

### Configuration
- `blockchain/hardhat.config.js` - Hardhat configuration
- `blockchain/package.json` - Hardhat and Ethers.js dependencies
- `.env.example` - Environment variables template

## Smart Contract Details

### NGOFund.sol

**Main Functions:**

```solidity
// Register an NGO on the blockchain
function registerNGO(
    string memory _mongoId,
    string memory _name,
    address _wallet
) external

// Process a donation
function donate(
    string memory _ngoId,
    string memory _message
) external payable

// Get donation count
function getDonationCount() external view returns (uint256)
```

**Events:**

```solidity
event NGORegistered(
    string indexed mongoId,
    string name,
    address indexed wallet
);

event DonationMade(
    address indexed donor,
    string indexed ngoId,
    uint256 amount,
    uint256 timestamp
);
```

See [blockchain/contracts/NGOFund.sol](./blockchain/contracts/NGOFund.sol) for full contract.

## Testing

### Run Smart Contract Tests

```bash
cd blockchain
npx hardhat test

# Expected: 13 tests passing
```

### Test Coverage

- ✅ NGO registration
- ✅ Duplicate prevention
- ✅ Donation acceptance
- ✅ Fund transfers
- ✅ Donation tracking
- ✅ Input validation
- ✅ Event emission
- ✅ Error handling

## Workflows

### User Flow: Making a Donation

1. **Connect Wallet**
   ```
   User clicks "Connect Wallet"
   → MetaMask popup appears
   → User authorizes connection
   → Wallet address shown in navbar
   ```

2. **Switch to Ganache**
   ```
   User must be on Ganache network
   → If not, "Switch to Ganache" button appears
   → Click to switch
   → MetaMask shows confirmation
   ```

3. **Fill Donation Form**
   ```
   Amount: 0.5 ETH
   Message: "Support your education programs"
   Click: "Donate to [NGO Name]"
   ```

4. **Confirm Transaction**
   ```
   MetaMask shows transaction details
   User reviews and clicks "Confirm"
   Transaction is signed and sent to blockchain
   ```

5. **Process and Verify**
   ```
   Frontend shows "Processing..."
   Ganache mines block with transaction
   Success message shown with transaction hash
   ```

### Developer Flow: Deploying Contract

```bash
# 1. Compile
npx hardhat compile

# 2. Test
npx hardhat test

# 3. Deploy
npx hardhat run scripts/deploy.js --network ganache

# 4. Verify in Ganache UI
# - Check Transactions tab
# - Verify contract was created
# - Note the contract address
```

## Deployed Contract Interface

After deployment:

1. **Contract Address** - Saved in `lib/contracts.json`
2. **Contract ABI** - Saved in `blockchain/abi/NGOFund.json`
3. **Deployment Info** - Saved in `blockchain/deployments/ganache-deployment.json`

The deployment script automatically syncs contract data to the frontend.

## Web3 Context Usage

### Connect Wallet

```typescript
import { useWeb3 } from '@/lib/web3-context';

export function MyComponent() {
  const { connectWallet, isConnected } = useWeb3();
  
  return (
    <button onClick={connectWallet}>
      {isConnected ? 'Connected' : 'Connect Wallet'}
    </button>
  );
}
```

### Make Donation

```typescript
const { donateToNGO, isCorrectNetwork } = useWeb3();

const submit = async () => {
  if (!isCorrectNetwork) return alert('Switch to Ganache');
  
  const txHash = await donateToNGO(ngoId, '0.5', 'Great work!');
  console.log('Donation hash:', txHash);
};
```

### Check Network

```typescript
const { isCorrectNetwork, switchToGanache } = useWeb3();

if (!isCorrectNetwork) {
  return <button onClick={switchToGanache}>Switch Network</button>;
}
```

## Ganache Features for Testing

### View Transactions

1. Open Ganache UI
2. Click "Transactions" tab
3. See all operations:
   - Contract deployments
   - Donations
   - Event logs

### Monitor Accounts

1. Click "Accounts" tab
2. See all 10 test accounts
3. View balances before/after donations
4. Verify funds transferred correctly

### Inspect Blocks

1. Click "Blocks" tab
2. See each mined block
3. Number of transactions per block
4. Gas usage for each operation

## Ganache Network Details

| Setting | Value |
|---------|-------|
| RPC URL | http://127.0.0.1:7545 |
| Chain ID | 1337 |
| Currency | ETH |
| Block Time | 0 seconds (instant) |
| Accounts | 10 pre-funded |
| Initial Balance | 100 ETH per account |
| Gas Price | 2 gwei (configurable) |

## Transaction Example

```json
{
  "hash": "0xabc123...",
  "from": "0x1234567890123456789012345678901234567890",
  "to": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  "value": "500000000000000000",
  "gasUsed": "75000",
  "status": "success",
  "blockNumber": 2,
  "logs": [
    {
      "event": "DonationMade",
      "donor": "0x1234567890...",
      "ngoId": "507f1f77bcf86cd799439011",
      "amount": "500000000000000000",
      "timestamp": 1676275200
    }
  ]
}
```

## Troubleshooting

### MetaMask Connection Issues

```bash
# Verify Ganache is running
lsof -i :7545

# Check MetaMask network settings
# RPC: http://127.0.0.1:7545
# Chain ID: 1337

# Hard refresh browser
Cmd+Shift+R  # Mac
Ctrl+Shift+R # Linux/Windows
```

### Transaction Failures

```bash
# Check account balance has at least 0.01 ETH
# Verify contract address is correct in lib/contracts.json
# Check Ganache Transactions tab for error details
# Redeploy if contract code changed
```

### Contract Not Found

```bash
# Re-deploy: npx hardhat run scripts/deploy.js --network ganache
# Verify lib/contracts.json exists and has correct address
# Restart frontend: npm run dev
```

## Next Steps

1. **Add More NGO Functions**
   - Withdraw funds
   - Set donation limits
   - Create fundraising goals

2. **Enhance Frontend**
   - Donation history page
   - Transaction explorer
   - Analytics dashboard

3. **Production Deployment**
   - Deploy to Sepolia testnet
   - Deploy to Ethereum mainnet
   - Consider Layer 2 solutions (Polygon, Arbitrum)

4. **Security**
   - Professional smart contract audit
   - Implement access controls
   - Add admin functions

5. **Advanced Features**
   - Multi-token support (USDC, DAI)
   - Recurring donations
   - Donation matching
   - DAO governance

## Resources

- **Hardhat Docs**: https://hardhat.org/
- **Ethers.js Docs**: https://docs.ethers.org/
- **Solidity Docs**: https://docs.soliditylang.org/
- **MetaMask Docs**: https://docs.metamask.io/
- **Ganache Docs**: https://trufflesuite.com/docs/ganache/

## Support

For issues or questions:

1. Check [BLOCKCHAIN_SETUP.md](./BLOCKCHAIN_SETUP.md) for detailed setup instructions
2. Review [DEMO_GUIDE.md](./DEMO_GUIDE.md) for demonstration steps
3. Check test files: `blockchain/test/NGOFund.test.js`
4. Review utility functions: `lib/blockchain-utils.ts`

---

## Demo Checklist

- [ ] Ganache running on port 7545
- [ ] MetaMask installed and configured
- [ ] Dependencies installed
- [ ] Smart contract deployed
- [ ] Backend server running
- [ ] Frontend dev server running
- [ ] Wallet connected in browser
- [ ] Test donation successful
- [ ] Transaction visible in Ganache UI
- [ ] Contract ABI and addresses exported

**Everything ready? Let's make blockchain-powered donations! 🚀**
