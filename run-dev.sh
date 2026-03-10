#!/bin/bash

echo "=================================================================="
echo "  NGO Fund Management - Blockchain Setup & Run Script"
echo "=================================================================="
echo ""
echo "This script will set up VS Code tasks and dependencies"
echo ""

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

# Create .vscode directory
mkdir -p "$PROJECT_ROOT/.vscode"

echo "✅ VS Code configuration ready!"
echo ""

# Check if code command is available
if ! command -v code &> /dev/null; then
    echo "⚠️  'code' command not found. Please install VS Code Shell Command:"
    echo "   1. Open VS Code"
    echo "   2. Press Cmd+Shift+P"
    echo "   3. Type 'Shell Command: Install 'code' command in PATH'"
    echo ""
fi

# 1. Check and install dependencies if needed
echo "[1/3] Checking dependencies..."

# Blockchain dependencies
if [ ! -d "$PROJECT_ROOT/blockchain/node_modules" ]; then
    echo "   Installing Blockchain dependencies..."
    cd "$PROJECT_ROOT/blockchain" && npm install
else
    echo "   ✓ Blockchain dependencies already installed"
fi

# Backend dependencies
if [ ! -d "$PROJECT_ROOT/backend/node_modules" ]; then
    echo "   Installing Backend dependencies..."
    cd "$PROJECT_ROOT/backend" && npm install
else
    echo "   ✓ Backend dependencies already installed"
fi

# Frontend dependencies
if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
    echo "   Installing Frontend dependencies..."
    cd "$PROJECT_ROOT" && npm install
else
    echo "   ✓ Frontend dependencies already installed"
fi

cd "$PROJECT_ROOT"

echo ""
echo "[2/3] VS Code configuration complete"
echo ""

# Try to open VS Code if command is available
if command -v code &> /dev/null; then
    echo "[3/3] Opening VS Code..."
    code "$PROJECT_ROOT"
    echo ""
fi

echo "=================================================================="
echo ""
echo "  ✅ Your NGO Fund Management blockchain system is ready!"
echo ""
echo "  QUICK START:"
echo "  ───────────────────────────────────────────────────────────────"
echo ""
echo "  To start all services at once:"
echo "    Option 1: Press Cmd+Shift+B (keyboard shortcut)"
echo "    Option 2: Cmd+Shift+P → 'Tasks: Run Task' → 'Start All Services'"
echo ""
echo "  Or start services individually:"
echo "    1. Cmd+Shift+P → 'Tasks: Run Task' → '1. Blockchain Node (Hardhat)'"
echo "    2. Cmd+Shift+P → 'Tasks: Run Task' → '3. Backend Server'"
echo "    3. Cmd+Shift+P → 'Tasks: Run Task' → '4. Next.js Frontend'"
echo ""
echo "  IMPORTANT:"
echo "  ───────────────────────────────────────────────────────────────"
echo "  • Make sure MongoDB is running locally or via Atlas"
echo "  • Update MongoDB URI in backend/.env if needed"
echo "  • MetaMask must be installed in your browser"
echo ""
echo "  SERVICES & PORTS:"
echo "  ───────────────────────────────────────────────────────────────"
echo "  • Hardhat Node:    http://localhost:8545 (Chain ID 1337)"
echo "  • Backend API:     http://localhost:5001"
echo "  • Frontend:        http://localhost:3000"
echo ""
echo "  USEFUL TASKS:"
echo "  ───────────────────────────────────────────────────────────────"
echo "  • '2. Deploy Smart Contracts' - Deploy to localhost"
echo "  • '5. Run Hardhat Tests' - Run smart contract tests"
echo "  • 'Install All Dependencies' - Reinstall all deps"
echo "  • 'Compile Smart Contracts' - Recompile .sol files"
echo ""
echo "  MANUAL COMMANDS (if needed):"
echo "  ───────────────────────────────────────────────────────────────"
echo "  Hardhat Node:"
echo "    cd blockchain && npm run start-node"
echo ""
echo "  Deploy Contracts:"
echo "    cd blockchain && npx hardhat run scripts/deploy.js --network localhost"
echo ""
echo "  Backend Server:"
echo "    cd backend && npm start"
echo ""
echo "  Frontend Dev:"
echo "    npm run dev"
echo ""
echo "  Run Tests:"
echo "    cd blockchain && npm test"
echo ""
echo "=================================================================="
echo ""
echo "  📚 For more details, see:"
echo "     • BLOCKCHAIN_README.md - Quick reference"
echo "     • BLOCKCHAIN_SETUP.md - Detailed setup guide"
echo "     • DEMO_GUIDE.md - Step-by-step demonstration"
echo ""
echo "  Ready to build with blockchain? Let's go! 🚀"
echo ""
echo "=================================================================="
