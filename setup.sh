#!/bin/bash

# Blockchain NGO Fund Management Platform Setup Script

echo "🚀 Starting setup for Blockchain NGO Fund Management Platform..."

# 1. Install root dependencies (Frontend)
echo "📦 Installing frontend dependencies..."
npm install

# 2. Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install
cd ..

# 3. Install blockchain dependencies
echo "📦 Installing blockchain dependencies..."
cd blockchain && npm install && npm install --save-dev ganache
echo "🏗️ Compiling smart contracts..."
npx hardhat compile
cd ..

# 4. Setup Environment Variables
echo "⚙️ Setting up environment variables..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    # Ensure PORT is 5001 to match frontend api.ts
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' 's/PORT=5000/PORT=5001/' backend/.env
    else
        sed -i 's/PORT=5000/PORT=5001/' backend/.env
    fi
    echo "✅ Created backend/.env and set PORT=5001"
else
    echo "ℹ️ backend/.env already exists, skipping."
fi

# Add blockchain variables to backend/.env if they don't exist
if ! grep -q "RPC_URL" backend/.env; then
    echo "RPC_URL=http://127.0.0.1:8545" >> backend/.env
    echo "PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" >> backend/.env
    echo "CONTRACT_ADDRESS=" >> backend/.env
    echo "✅ Added blockchain variables to backend/.env (Default Hardhat dev account)"
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start a local MongoDB instance."
echo "2. Run './run.sh' to start the local blockchain, deploy the contract, and launch the apps."
echo "   OR"
echo "   - Start hardhat node: 'cd blockchain && npx hardhat node'"
echo "   - Deploy contract: 'cd blockchain && npx hardhat run scripts/deploy.js --network localhost'"
echo "   - Seed database: 'cd backend && node seed.js'"
echo "   - Start backend: 'cd backend && npm start'"
echo "   - Start frontend: 'npm run dev'"
