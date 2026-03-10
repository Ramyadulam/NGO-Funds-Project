const contract = require("../config/blockchain");
const { ethers } = require("ethers");

/**
 * Register an NGO on the blockchain
 * @param {string} mongoId - The MongoDB ID of the NGO
 * @param {string} name - The name of the NGO
 * @param {string} walletAddress - The wallet address of the NGO
 * @returns {Promise<string|null>} - Transaction hash or null if failed
 */
async function registerNGOOnChain(mongoId, name, walletAddress) {
    if (!contract) {
        console.warn("Blockchain contract not initialized, skipping registration.");
        return null;
    }

    try {
        console.log(`Registering NGO on-chain: ${name} (${mongoId})`);
        const tx = await contract.registerNGO(mongoId, name, walletAddress);
        console.log(`Transaction sent: ${tx.hash}`);
        await tx.wait(); // Wait for confirmation
        console.log(`NGO registered on-chain: ${tx.hash}`);
        return tx.hash;
    } catch (error) {
        console.error("Error registering NGO on blockchain:", error);
        return null;
    }
}

/**
 * Record a donation on the blockchain
 * @param {string} ngoId - The MongoDB ID of the NGO
 * @param {string} amount - The amount to donate (in ETH/wei)
 * @param {string} message - Optional message
 * @returns {Promise<string|null>} - Transaction hash or null if failed
 */
async function recordDonationOnChain(ngoId, amount, message = "") {
    if (!contract) {
        console.warn("Blockchain contract not initialized, skipping donation recording.");
        return null;
    }

    try {
        // Convert amount to Wei if it's in Ether, or assume it's passed as Wei string
        // For this example, let's assume input is in Ether string
        const amountWei = ethers.parseEther(amount.toString());

        console.log(`Recording donation on-chain for NGO ${ngoId}: ${amount} ETH`);

        // Ensure the wallet has enough funds and gas
        // The contract.donate function is payable
        const tx = await contract.donate(ngoId, message, { value: amountWei });

        console.log(`Transaction sent: ${tx.hash}`);
        await tx.wait();
        console.log(`Donation recorded on-chain: ${tx.hash}`);
        return tx.hash;
    } catch (error) {
        console.error("Error recording donation on blockchain:", error);
        return null; // Return null but don't crash
    }
}

module.exports = {
    registerNGOOnChain,
    recordDonationOnChain
};
