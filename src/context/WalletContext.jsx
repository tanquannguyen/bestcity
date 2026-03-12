import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';

export const WalletContext = createContext(null);

const NETWORK_NAMES = {
  '0x1': 'Ethereum Mainnet',
  '0x5': 'Goerli',
  '0xaa36a7': 'Sepolia',
  '0x89': 'Polygon',
  '0x13881': 'Mumbai',
  '0xa4b1': 'Arbitrum One',
  '0x2105': 'Base',
  '0x38': 'BNB Smart Chain',
  '0x61': 'BSC Testnet',
};

const formatNetworkName = (chainId) => {
  if (!chainId) return 'Unknown network';
  return NETWORK_NAMES[chainId] || `Chain ${parseInt(chainId, 16)}`;
};

export function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState('');
  const [chainId, setChainId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  const syncWalletState = useCallback(async () => {
    if (!window.ethereum) {
      setIsMetaMaskInstalled(false);
      setWalletAddress('');
      setChainId('');
      return;
    }

    try {
      setIsMetaMaskInstalled(Boolean(window.ethereum.isMetaMask));
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      const network = await provider.getNetwork();

      setWalletAddress(accounts[0] || '');
      setChainId(network?.chainId ? `0x${network.chainId.toString(16)}` : '');
    } catch (syncError) {
      setError(syncError?.message || 'Unable to read wallet state.');
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      setIsMetaMaskInstalled(false);
      setError('MetaMask is not installed. Please install it to continue.');
      window.open('https://metamask.io/download/', '_blank', 'noopener,noreferrer');
      return;
    }

    try {
      setIsConnecting(true);
      setError('');

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();

      setWalletAddress(accounts[0] || '');
      setChainId(network?.chainId ? `0x${network.chainId.toString(16)}` : '');
    } catch (connectError) {
      if (connectError?.code === 4001) {
        setError('Wallet connection request was rejected.');
      } else {
        setError(connectError?.message || 'Failed to connect wallet.');
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletAddress('');
    setError('');
  }, []);

  useEffect(() => {
    syncWalletState();
  }, [syncWalletState]);

  useEffect(() => {
    if (!window.ethereum) return undefined;

    const handleAccountsChanged = (accounts) => {
      setError('');
      setWalletAddress(accounts?.[0] || '');
    };

    const handleChainChanged = (newChainId) => {
      setError('');
      setChainId(newChainId || '');
    };

    const handleDisconnect = () => {
      setWalletAddress('');
      setError('Wallet disconnected.');
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('disconnect', handleDisconnect);

    return () => {
      if (!window.ethereum?.removeListener) return;
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.removeListener('disconnect', handleDisconnect);
    };
  }, []);

  const value = useMemo(
    () => ({
      walletAddress,
      chainId,
      networkName: formatNetworkName(chainId),
      isConnected: Boolean(walletAddress),
      isConnecting,
      error,
      isMetaMaskInstalled,
      connectWallet,
      disconnectWallet,
    }),
    [walletAddress, chainId, isConnecting, error, isMetaMaskInstalled, connectWallet, disconnectWallet]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}
