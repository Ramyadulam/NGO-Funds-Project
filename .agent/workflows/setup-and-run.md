---
description: Setup and run the Blockchain NGO Fund Management project
---

This workflow automates the setup and execution of the Blockchain NGO Fund Management project, including the blockchain node, smart contract deployment, backend API, and Next.js frontend.

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port 27017)

### 1. Initial Setup
Run the setup script to install all dependencies for the frontend, backend, and blockchain components. It also initializes the environment variables.

// turbo
```bash
./setup.sh
```

### 2. Run the Application
Run the start script which performs the following actions:
1. Starts a local Hardhat blockchain node.
2. Deploys the `NGOFund` smart contract.
3. Updates the backend configuration with the new contract address.
4. Seeds the MongoDB database with sample data.
5. Starts the Express.js backend on port 5001.
6. Starts the Next.js frontend on port 3000.

// turbo
```bash
./run.sh
```

### 3. Access the Application
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5001/api](http://localhost:5001/api)

### Default Credentials (after seeding)
- **Admin**: `admin@ngo.com` / `admin123`
- **User**: `john@example.com` / `password123`
