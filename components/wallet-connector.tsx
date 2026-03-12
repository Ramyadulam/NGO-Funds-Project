'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/lib/web3-context';
import { formatAddress, getNetworkName } from '@/lib/blockchain-utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Wallet, LogOut, Network, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function WalletConnector() {
    const {
        account,
        isConnected,
        isConnecting,
        chainId,
        isCorrectNetwork,
        networkName,
        connectWallet,
        disconnectWallet,
        switchToGanache,
    } = useWeb3();
    const [copied, setCopied] = useState(false);

    const handleCopyAddress = () => {
        if (account) {
            navigator.clipboard.writeText(account);
            setCopied(true);
            toast.success('Address copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isConnected) {
        return (
            <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className="flex items-center gap-2"
            >
                <Wallet className="h-4 w-4" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    {formatAddress(account ?? '')}
                    {isCorrectNetwork ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col gap-1">
                    <span className="text-xs font-normal text-muted-foreground">Connected Account</span>
                    <span className="font-mono text-sm">{formatAddress(account ?? '', 6)}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleCopyAddress}>
                    <Copy className="h-4 w-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy Address'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Network className="h-4 w-4" />
                        <span className="text-xs font-normal text-muted-foreground">Network</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 rounded bg-muted text-sm">
                        <div className={`h-2 w-2 rounded-full ${isCorrectNetwork ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        {networkName}
                    </div>
                </DropdownMenuLabel>

                {!isCorrectNetwork && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={switchToGanache} className="text-amber-600">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Switch to Ganache
                        </DropdownMenuItem>
                    </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={disconnectWallet}
                    className="text-red-600 focus:text-red-600"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Disconnect
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
