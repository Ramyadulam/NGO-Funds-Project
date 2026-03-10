#!/bin/bash

# Blockchain NGO Fund Management Platform Run Script

echo "🚀 Starting Blockchain NGO Fund Management Platform..."

# Function to cleanup background processes on exit
cleanup() {
    echo "Stopping all services..."
    kill $(jobs -p)
    exit
}

trap cleanup SIGINT SIGTERM

# 1. Start Ganache Node
echo "🔌 Starting local blockchain node (Ganache)..."
cd blockchain
npm run start-node > ganache.log 2>&1 &
NODE_PID=$!
cd ..

# Wait for node to start
echo "⏳ Waiting for ganache node to be ready..."
sleep 5

# 2. Deploy Smart Contract
echo "📜 Deploying smart contract..."
cd blockchain
DEPLOY_OUTPUT=$(npm run deploy:ganache)
echo "$DEPLOY_OUTPUT"

# Extract contract address
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oE '0x[a-fA-F0-9]{40}')

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "❌ Failed to extract contract address. Deployment might have failed."
    kill $NODE_PID
    exit 1
fi

echo "✅ Contract deployed at: $CONTRACT_ADDRESS"
cd ..

# 3. Update backend/.env with the new contract address and RPC URL
echo "📝 Updating backend/.env with contract address and RPC URL..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS sed
    sed -i '' "s|^CONTRACT_ADDRESS=.*|CONTRACT_ADDRESS=$CONTRACT_ADDRESS|" backend/.env
    sed -i '' "s|^RPC_URL=.*|RPC_URL=http://127.0.0.1:7545|" backend/.env
else
    # Linux sed
    sed -i "s|^CONTRACT_ADDRESS=.*|CONTRACT_ADDRESS=$CONTRACT_ADDRESS|" backend/.env
    sed -i "s|^RPC_URL=.*|RPC_URL=http://127.0.0.1:7545|" backend/.env
fi

# 4. Seed database (optional but recommended for first run)
echo "🌱 Seeding database..."
cd backend
node seed.js
cd ..

# 5. Start Backend
echo "🖥️ Starting backend server..."
cd backend
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# 6. Start Frontend
echo "🌐 Starting frontend (Next.js)..."
echo "Application will be available at http://localhost:3000"
npm run dev

# Keep script running to maintain background jobs
wait
