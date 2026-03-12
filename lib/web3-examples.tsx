// Examples of how to use the Web3 context and blockchain functions

import { useWeb3 } from './web3-context';
import { formatAddress, formatCurrency, weiToEther } from './blockchain-utils';
import { API_BASE_URL } from './api-config';

/**
 * Example 1: Simple wallet connection component
 */
export const WalletStatus = () => {
    const { account, isConnected, networkName, connectWallet } = useWeb3();

    if (!isConnected) {
        return <button onClick={connectWallet}>Connect Wallet</button>;
    }

    return (
        <div>
            <p>Connected to: {formatAddress(account ?? '')}</p>
            <p>Network: {networkName}</p>
        </div>
    );
};

/**
 * Example 2: Make a donation with error handling
 */
export const makeDonationExample = async () => {
    const { isConnected, isCorrectNetwork, donateToNGO } = useWeb3();

    if (!isConnected) {
        throw new Error('Wallet not connected');
    }

    if (!isCorrectNetwork) {
        throw new Error('Please switch to Ganache network');
    }

    try {
        const transactionHash = await donateToNGO(
            'ngo-id-123',
            '0.5',
            'Supporting great work!'
        );
        console.log('Donation successful:', transactionHash);
        return transactionHash;
    } catch (error) {
        console.error('Donation failed:', error);
        throw error;
    }
};

/**
 * Example 3: Register an NGO on blockchain
 */
export const registerNGOExample = async () => {
    const { isConnected, isCorrectNetwork, registerNGOOnBlockchain } = useWeb3();

    if (!isConnected || !isCorrectNetwork) {
        throw new Error('Connect wallet and switch to Ganache first');
    }

    try {
        const txHash = await registerNGOOnBlockchain(
            '507f1f77bcf86cd799439011',
            'Education for All NGO',
            '0x742d35Cc6634C0532925a3b844Bc9e7595f12345'
        );
        console.log('NGO registered:', txHash);
        return txHash;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
};

/**
 * Example 4: Query blockchain data
 */
export const queryBlockchainExample = async () => {
    const { getDonationCount, getNGODetails } = useWeb3();

    try {
        const count = await getDonationCount();
        console.log('Total donations:', count);

        const ngo = await getNGODetails('507f1f77bcf86cd799439011');
        console.log('NGO details:', {
            name: ngo.name,
            wallet: ngo.wallet,
            isRegistered: ngo.isRegistered,
        });
    } catch (error) {
        console.error('Query failed:', error);
    }
};

/**
 * Example 5: Format blockchain data for display
 */
export const displayExample = (amount: string, address: string) => {
    const ethAmount = weiToEther(amount);
    console.log('Amount:', formatCurrency(ethAmount, 4, 'ETH'));

    const shortAddress = formatAddress(address);
    console.log('Address:', shortAddress);
};

/**
 * Example 6: Validate donation before submitting
 */
export const validateDonationExample = (amount: string, message: string) => {
    if (!amount || parseFloat(amount) <= 0) {
        return { valid: false, error: 'Invalid amount' };
    }

    if (parseFloat(amount) < 0.01) {
        return { valid: false, error: 'Minimum donation is 0.01 ETH' };
    }

    if (!message || message.length === 0) {
        return { valid: false, error: 'Message is required' };
    }

    if (message.length > 500) {
        return { valid: false, error: 'Message must be less than 500 characters' };
    }

    return { valid: true };
};

/**
 * Example 7: Handle network switching
 */
export const switchNetworkExample = async () => {
    const { isCorrectNetwork, switchToGanache } = useWeb3();

    if (!isCorrectNetwork) {
        try {
            await switchToGanache();
            console.log('Network switched to Ganache');
        } catch (error) {
            console.error('Failed to switch network:', error);
        }
    }
};

/**
 * Example 8: Complete donation flow
 */
export const completeDonationFlow = async (
    ngoId: string,
    amount: string,
    message: string
) => {
    const {
        account,
        isConnected,
        isCorrectNetwork,
        connectWallet,
        switchToGanache,
        donateToNGO,
    } = useWeb3();

    if (!isConnected) {
        console.log('Step 1: Connecting wallet...');
        await connectWallet();
    }

    if (!isCorrectNetwork) {
        console.log('Step 2: Switching to Ganache...');
        await switchToGanache();
    }

    console.log('Step 3: Validating form...');
    const validation = validateDonationExample(amount, message);
    if (!validation.valid) {
        throw new Error(validation.error);
    }

    console.log('Step 4: Saving to backend...');
    const backendResponse = await fetch(`${API_BASE_URL}/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ngoId,
            amount,
            message,
            donorAddress: account,
            transactionHash: '',
        }),
    });

    if (!backendResponse.ok) {
        throw new Error('Failed to save donation to backend');
    }

    console.log('Step 5: Processing blockchain transaction...');
    const txHash = await donateToNGO(ngoId, amount, message);

    console.log('Step 6: Updating backend with transaction hash...');
    await fetch(`${API_BASE_URL}/donations/update-hash`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ngoId,
            donorAddress: account,
            transactionHash: txHash,
        }),
    });

    console.log('Donation complete!', txHash);
    return txHash;
};

/**
 * Example 9: Monitor transaction status
 */
export const monitorTransactionExample = async (txHash: string) => {
    const { provider } = useWeb3();

    if (!provider) {
        throw new Error('Provider not initialized');
    }

    let receipt = null;
    let attempts = 0;
    const maxAttempts = 30;

    while (!receipt && attempts < maxAttempts) {
        try {
            receipt = await provider.getTransactionReceipt(txHash);
            if (receipt) {
                console.log('Transaction confirmed:', {
                    blockNumber: receipt.blockNumber,
                    gasUsed: receipt.gasUsed?.toString(),
                    status: receipt.status === 1 ? 'Success' : 'Failed',
                });
                return receipt;
            }
        } catch (error) {
            console.error('Error checking receipt:', error);
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        attempts++;
    }

    throw new Error('Transaction not confirmed within timeout');
};

/**
 * Example 10: Error recovery
 */
export const errorRecoveryExample = async (error: any) => {
    const { connectWallet, switchToGanache } = useWeb3();

    if (error.message.includes('Network')) {
        console.log('Network error detected, trying to switch network...');
        try {
            await switchToGanache();
        } catch (switchError) {
            console.error('Failed to switch network:', switchError);
        }
    } else if (error.message.includes('connect')) {
        console.log('Connection error, reconnecting wallet...');
        try {
            await connectWallet();
        } catch (connectError) {
            console.error('Failed to connect:', connectError);
        }
    } else {
        console.error('Unknown error:', error);
    }
};
