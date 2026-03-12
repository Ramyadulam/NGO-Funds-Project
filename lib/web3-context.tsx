'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';
import { toast } from 'sonner';

declare global {
    interface Window {
        ethereum: any;
    }
}

interface Web3ContextType {
    provider: BrowserProvider | null;
    signer: ethers.Signer | null;
    account: string | null;
    isConnected: boolean;
    isConnecting: boolean;
    chainId: number | null;
    networkName: string;
    ngoContract: Contract | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    switchToSepolia: () => Promise<void>;
    registerNGOOnBlockchain: (mongoId: string, name: string, walletAddress: string) => Promise<string>;
    donateToNGO: (ngoId: string, amount: string, message: string) => Promise<string>;
    getDonationCount: () => Promise<number>;
    getNGODetails: (mongoId: string) => Promise<any>;
    isCorrectNetwork: boolean;
    error: string | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const SEPOLIA_CHAIN_ID = 11155111;
const VALID_CHAIN_IDS = [SEPOLIA_CHAIN_ID];
const SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://rpc.sepolia.org';
const CHAIN_NAME = 'Sepolia';
const CURRENCY_NAME = 'ETH';
const CURRENCY_SYMBOL = 'ETH';

// This will be populated after deployment
let NGOFUND_ADDRESS = '';
let NGOFUND_ABI: any[] = [];

const getContractConfig = async () => {
    try {
        // Try to load the deployment config
        const response = await fetch('/contracts.json');
        if (response.ok) {
            const config = await response.json();
            NGOFUND_ADDRESS = config.NGOFund.address;
            NGOFUND_ABI = config.NGOFund.abi;
        }
    } catch (error) {
        console.log('Contract config not yet deployed');
    }
};

export function Web3Provider({ children }: { children: React.ReactNode }) {
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [chainId, setChainId] = useState<number | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [ngoContract, setNGOContract] = useState<Contract | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Initialize on mount
    useEffect(() => {
        getContractConfig();
        checkWalletConnection();
        setupListeners();
    }, []);

    const checkWalletConnection = async () => {
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const accounts = await provider.listAccounts();
                if (accounts.length > 0) {
                    await connectWalletInternal(provider);
                }
            } catch (error) {
                console.error('Error checking wallet connection:', error);
            }
        }
    };

    const setupListeners = () => {
        if (typeof window !== 'undefined' && window.ethereum) {
            window.ethereum.on('accountsChanged', async (accounts: string[]) => {
                if (accounts.length === 0) {
                    disconnectWallet();
                } else {
                    const provider = new BrowserProvider(window.ethereum);
                    await connectWalletInternal(provider);
                }
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }
    };

    const connectWalletInternal = async (prov: BrowserProvider) => {
        try {
            const signer = await prov.getSigner();
            const address = await signer.getAddress();
            const network = await prov.getNetwork();

            setProvider(prov);
            setSigner(signer);
            setAccount(address);
            setChainId(Number(network.chainId));
            setError(null);

            // Ensure config is loaded if not already
            if (!NGOFUND_ADDRESS || NGOFUND_ABI.length === 0) {
                await getContractConfig();
            }

            // Initialize contract if we have the ABI and address
            if (NGOFUND_ADDRESS && NGOFUND_ABI.length > 0) {
                const contract = new Contract(NGOFUND_ADDRESS, NGOFUND_ABI, signer);
                setNGOContract(contract);
                console.log('NGO Contract initialized at:', NGOFUND_ADDRESS);
            } else {
                console.warn('NGO Contract config missing, could not initialize');
            }
        } catch (error: any) {
            const errorMessage = error?.message || 'Failed to connect wallet';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Error connecting wallet:', error);
        }
    };

    const connectWallet = useCallback(async () => {
        if (!window.ethereum) {
            const error = 'MetaMask is not installed. Please install MetaMask and try again.';
            setError(error);
            toast.error(error);
            return;
        }

        setIsConnecting(true);
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            const provider = new BrowserProvider(window.ethereum);
            await connectWalletInternal(provider);
            toast.success('Wallet connected successfully!');
        } catch (error: any) {
            const errorMessage = error?.message || 'Failed to connect wallet';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Error connecting wallet:', error);
        } finally {
            setIsConnecting(false);
        }
    }, []);

    const disconnectWallet = () => {
        setProvider(null);
        setSigner(null);
        setAccount(null);
        setChainId(null);
        setNGOContract(null);
        setError(null);
        toast.info('Wallet disconnected');
    };

    const switchToSepolia = async () => {
        if (!window.ethereum) {
            toast.error('MetaMask is not installed');
            return;
        }

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
            });
            toast.success('Switched to Sepolia');
        } catch (error: any) {
            if (error.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
                                chainName: CHAIN_NAME,
                                nativeCurrency: {
                                    name: CURRENCY_NAME,
                                    symbol: CURRENCY_SYMBOL,
                                    decimals: 18,
                                },
                                rpcUrls: [SEPOLIA_RPC_URL],
                                blockExplorerUrls: ['https://sepolia.etherscan.io'],
                            },
                        ],
                    });
                    toast.success('Sepolia network added');
                } catch (addError: any) {
                    toast.error(addError?.message || 'Failed to add Sepolia network');
                }
            } else {
                toast.error(error?.message || 'Failed to switch network');
            }
        }
    };

    const registerNGOOnBlockchain = async (
        mongoId: string,
        name: string,
        walletAddress: string
    ): Promise<string> => {
        if (!ngoContract) {
            throw new Error('NGO contract not initialized. Please connect your wallet first.');
        }

        try {
            const tx = await ngoContract.registerNGO(mongoId, name, walletAddress);
            toast.loading('Registering NGO on blockchain...');
            const receipt = await tx.wait();
            toast.dismiss();
            toast.success('NGO registered on blockchain!');
            return receipt.hash;
        } catch (error: any) {
            const errorMessage = error?.reason || error?.message || 'Failed to register NGO';
            toast.error(errorMessage);
            throw error;
        }
    };

    const donateToNGO = async (
        ngoId: string,
        amount: string,
        message: string
    ): Promise<string> => {
        if (!ngoContract) {
            throw new Error('NGO contract not initialized. Please connect your wallet first.');
        }

        try {
            const weiAmount = ethers.parseEther(amount);
            const tx = await ngoContract.donate(ngoId, message, { value: weiAmount });
            toast.loading('Processing donation...');
            const receipt = await tx.wait();
            toast.dismiss();
            toast.success('Donation successful!');
            return receipt.hash;
        } catch (error: any) {
            const errorMessage = error?.reason || error?.message || 'Failed to process donation';
            toast.error(errorMessage);
            throw error;
        }
    };

    const getDonationCount = async (): Promise<number> => {
        if (!ngoContract) throw new Error('Contract not initialized');
        const count = await ngoContract.getDonationCount();
        return Number(count);
    };

    const getNGODetails = async (mongoId: string) => {
        if (!ngoContract) throw new Error('Contract not initialized');
        const ngo = await ngoContract.ngos(mongoId);
        return ngo;
    };

    const isConnected = !!account;
    const isCorrectNetwork = chainId !== null && VALID_CHAIN_IDS.includes(chainId);
    const networkName = chainId === SEPOLIA_CHAIN_ID ? 'Sepolia'
        : chainId ? `Chain ${chainId}` : 'Unknown';

    const value: Web3ContextType = {
        provider,
        signer,
        account,
        isConnected,
        isConnecting,
        chainId,
        networkName,
        ngoContract,
        connectWallet,
        disconnectWallet,
        switchToSepolia,
        registerNGOOnBlockchain,
        donateToNGO,
        getDonationCount,
        getNGODetails,
        isCorrectNetwork,
        error,
    };

    return (
        <Web3Context.Provider value={value}>
            {children}
        </Web3Context.Provider>
    );
}

export function useWeb3() {
    const context = useContext(Web3Context);
    if (context === undefined) {
        throw new Error('useWeb3 must be used within a Web3Provider');
    }
    return context;
}
