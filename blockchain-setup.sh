#!/bin/bash

# NGO Fund Management - Quick Start Script
# This script helps you set up everything needed to run the blockchain-integrated application

set -e

COLORS=('\033[0;31m' '\033[0;32m' '\033[0;33m' '\033[0;36m')
RED=${COLORS[0]}
GREEN=${COLORS[1]}
YELLOW=${COLORS[2]}
CYAN=${COLORS[3]}
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check prerequisites
check_nodejs() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        echo "Please install Node.js v18 or higher from https://nodejs.org/"
        exit 1
    fi
    NODE_VERSION=$(node -v)
    print_success "Node.js ${NODE_VERSION} found"
}

check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    NPM_VERSION=$(npm -v)
    print_success "npm ${NPM_VERSION} found"
}

check_ganache() {
    if ! nc -z 127.0.0.1 7545 2>/dev/null; then
        print_warning "Ganache is not running on port 7545"
        print_info "Start Ganache before continuing:"
        echo "  - Using GUI: Open Ganache application and start workspace"
        echo "  - Using CLI: ganache --deterministic --chain.chainId 1337"
        read -p "Press Enter after starting Ganache..."
        
        if ! nc -z 127.0.0.1 7545 2>/dev/null; then
            print_error "Cannot connect to Ganache on port 7545"
            exit 1
        fi
    fi
    print_success "Ganache is running on port 7545"
}

# Installation steps
install_dependencies() {
    print_header "Installing Dependencies"
    
    # Backend
    print_info "Installing backend dependencies..."
    cd backend
    npm install --production
    cd ..
    print_success "Backend dependencies installed"
    
    # Blockchain
    print_info "Installing blockchain/Hardhat dependencies..."
    cd blockchain
    npm install
    cd ..
    print_success "Blockchain dependencies installed"
    
    # Frontend
    print_info "Installing frontend dependencies..."
    npm install
    print_success "Frontend dependencies installed"
}

# Compile and deploy
compile_contract() {
    print_header "Compiling Smart Contract"
    
    cd blockchain
    npx hardhat compile
    cd ..
    
    print_success "Smart contract compiled successfully"
}

deploy_contract() {
    print_header "Deploying to Ganache"
    
    cd blockchain
    DEPLOY_OUTPUT=$(npx hardhat run scripts/deploy.js --network ganache)
    echo "$DEPLOY_OUTPUT"
    cd ..
    
    # Extract contract address
    CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "Contract Address:" | grep -oE '0x[a-fA-F0-9]{40}')
    if [ -z "$CONTRACT_ADDRESS" ]; then
        print_error "Could not extract contract address from deployment output"
        exit 1
    fi
    
    print_success "Contract deployed: $CONTRACT_ADDRESS"
}

# Run tests
run_tests() {
    print_header "Running Smart Contract Tests"
    
    cd blockchain
    npx hardhat test --reporter json 2>/dev/null | grep -E "passing|failing" || npx hardhat test
    cd ..
    
    print_success "Tests completed"
}

# Environment setup
create_env_file() {
    print_header "Setting Up Environment"
    
    if [ ! -f .env.local ]; then
        cat > .env.local << EOF
# Blockchain Configuration
NEXT_PUBLIC_GANACHE_RPC_URL=http://127.0.0.1:7545
NEXT_PUBLIC_GANACHE_CHAIN_ID=1337

# Backend Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api

# MongoDB (if using)
MONGODB_URI=mongodb://localhost:27017/ngo-fund-management
EOF
        print_success "Created .env.local file"
    else
        print_info ".env.local already exists"
    fi
}

# Show startup instructions
show_startup_instructions() {
    print_header "Next Steps"
    
    echo -e "To start the application, run these commands in separate terminals:\n"
    
    echo -e "${YELLOW}Terminal 1 - Backend:${NC}"
    echo "  cd backend"
    echo "  npm start"
    
    echo -e "\n${YELLOW}Terminal 2 - Frontend:${NC}"
    echo "  npm run dev"
    
    echo -e "\n${YELLOW}Ganache should continue running${NC}"
    
    echo -e "\n${GREEN}Then open http://localhost:3000 in your browser${NC}"
    
    print_info "Make sure MetaMask is installed and connected to Ganache network"
}

# Main execution
main() {
    print_header "NGO Fund Management - Quick Start Setup"
    
    # Check prerequisites
    print_info "Checking prerequisites..."
    check_nodejs
    check_npm
    check_ganache
    
    # Install dependencies
    install_dependencies
    
    # Compile contract
    compile_contract
    
    # Run tests
    read -p "Do you want to run tests? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        run_tests
    fi
    
    # Deploy contract
    read -p "Ready to deploy contract to Ganache? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_contract
    else
        print_warning "Skipping deployment. You can deploy manually with:"
        echo "  cd blockchain && npx hardhat run scripts/deploy.js --network ganache"
    fi
    
    # Setup environment
    create_env_file
    
    # Show next steps
    show_startup_instructions
    
    print_header "Setup Complete! 🎉"
    echo "Your blockchain NGO fund management system is ready to use!"
}

# Run main
main
