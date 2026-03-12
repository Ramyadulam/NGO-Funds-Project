// Blockchain utility functions for frontend integration

import { ethers } from 'ethers';

/**
 * Format a wallet address for display (shortened format)
 */
export const formatAddress = (address: string, chars = 4): string => {
    if (!address) return '';
    return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
};

/**
 * Convert Wei to Ether
 */
export const weiToEther = (wei: string | bigint): string => {
    return ethers.formatEther(wei);
};

/**
 * Convert Ether to Wei
 */
export const etherToWei = (ether: string): bigint => {
    return ethers.parseEther(ether);
};

/**
 * Format currency for display
 */
export const formatCurrency = (
    amount: string | number,
    decimals = 4,
    symbol = 'ETH'
): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `${num.toFixed(decimals)} ${symbol}`;
};

/**
 * Format transaction hash for display
 */
export const formatTxHash = (hash: string): string => {
    if (!hash) return '';
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
};

/**
 * Check if address is valid Ethereum address
 */
export const isValidAddress = (address: string): boolean => {
    return ethers.isAddress(address);
};

/**
 * Get block explorer URL for transaction
 */
export const getBlockExplorerUrl = (
    hash: string,
    network = 'sepolia'
): string => {
    if (network === 'sepolia') {
        return `https://sepolia.etherscan.io/tx/${hash}`;
    }
    return '';
};

/**
 * Validate donation amount
 */
export const isValidDonationAmount = (amount: string): boolean => {
    try {
        const numAmount = parseFloat(amount);
        return numAmount > 0 && !isNaN(numAmount);
    } catch {
        return false;
    }
};

/**
 * Get network name from chain ID
 */
export const getNetworkName = (chainId: number | null): string => {
    const networks: { [key: number]: string } = {
        1: 'Ethereum Mainnet',
        5: 'Goerli',
        11155111: 'Sepolia',
        1337: 'Ganache (Local)',
        31337: 'Hardhat (Local)',
    };
    return networks[chainId || 0] || `Unknown (Chain ${chainId})`;
};

/**
 * Format transaction receipt data for display
 */
export const formatTransactionReceipt = (receipt: any) => {
    return {
        hash: receipt.hash,
        from: receipt.from,
        to: receipt.to,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed?.toString(),
        status: receipt.status === 1 ? 'Success' : 'Failed',
        timestamp: new Date().toISOString(),
    };
};

/**
 * Convert BigInt to readable format
 */
export const formatBigInt = (value: bigint, decimals = 18): string => {
    return ethers.formatUnits(value, decimals);
};

/**
 * Parse donation amount with validation
 */
export const parseDonationAmount = (amount: string): { valid: boolean; wei?: bigint } => {
    try {
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            return { valid: false };
        }
        const wei = ethers.parseEther(amount);
        return { valid: true, wei };
    } catch (error) {
        return { valid: false };
    }
};

/**
 * Get contract deployment info
 */
export const getDeploymentInfo = async (network: string) => {
    try {
        const response = await fetch(`/deployments/${network}-deployment.json`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Error fetching deployment info:', error);
    }
    return null;
};

/**
 * Get contract ABI
 */
export const getContractABI = async (contractName: string) => {
    try {
        const response = await fetch(`/abi/${contractName}.json`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Error fetching contract ABI:', error);
    }
    return null;
};

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!window.ethereum && !!window.ethereum.isMetaMask;
};

/**
 * Get transaction status by polling
 */
export const waitForTransaction = async (
    provider: ethers.Provider,
    txHash: string,
    timeout = 60000
): Promise<ethers.TransactionReceipt | null> => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const receipt = await provider.getTransactionReceipt(txHash);
        if (receipt) return receipt;
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return null;
};
