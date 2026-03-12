const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🚀 Deploying NGOFund contract...\n");

    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log(`📝 Deploying contract from account: ${deployer.address}\n`);

    // Get contract factory
    const NGOFund = await hre.ethers.getContractFactory("NGOFund");

    // Deploy contract
    const ngoFund = await NGOFund.deploy();
    await ngoFund.waitForDeployment();

    const contractAddress = await ngoFund.getAddress();
    console.log(`✅ NGOFund contract deployed successfully!`);
    console.log(`📍 Contract Address: ${contractAddress}\n`);

    // Save deployment info
    const deploymentInfo = {
        contractAddress: contractAddress,
        deployerAddress: deployer.address,
        network: hre.network.name,
        timestamp: new Date().toISOString(),
        blockNumber: await hre.ethers.provider.getBlockNumber(),
    };

    const deploymentsDir = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const deploymentFile = path.join(deploymentsDir, `${hre.network.name}-deployment.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

    console.log(`📄 Deployment info saved to: ${deploymentFile}\n`);

    // Export ABI and contract info
    const abiDir = path.join(__dirname, "../abi");
    if (!fs.existsSync(abiDir)) {
        fs.mkdirSync(abiDir, { recursive: true });
    }

    // Get contract ABI from artifacts
    const contractArtifacts = await hre.artifacts.readArtifact("NGOFund");
    fs.writeFileSync(
        path.join(abiDir, "NGOFund.json"),
        JSON.stringify(contractArtifacts.abi, null, 2)
    );

    console.log("✅ Contract ABI exported\n");

    // Create a frontend-friendly config
    const frontendConfig = {
        NGOFund: {
            address: contractAddress,
            abi: contractArtifacts.abi,
        },
    };

    const libConfigPath = path.join(__dirname, "../../lib/contracts.json");
    const publicConfigPath = path.join(__dirname, "../../public/contracts.json");

    fs.writeFileSync(libConfigPath, JSON.stringify(frontendConfig, null, 2));
    fs.writeFileSync(publicConfigPath, JSON.stringify(frontendConfig, null, 2));

    console.log(`📦 Frontend config saved to:`);
    console.log(`   - ${libConfigPath}`);
    console.log(`   - ${publicConfigPath}\n`);

    console.log(`🎉 Deployment complete!\n`);
    console.log("Next steps:");
    console.log("1. Connect MetaMask to your deployment network");
    console.log("2. Update your frontend environment variables");
    console.log("3. Start the frontend dev server");
    console.log(`\nNetwork: ${hre.network.name}`);
    console.log(`Contract Address: ${contractAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
