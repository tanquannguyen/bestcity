import { useWallet } from '../../hooks/useWallet';

function truncateAddress(address = '') {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function WalletStatus() {
  const {
    walletAddress,
    networkName,
    isConnected,
    error,
    isMetaMaskInstalled,
  } = useWallet();

  if (!isMetaMaskInstalled) {
    return (
      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        MetaMask not detected. Install the extension to connect your wallet.
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="rounded-lg border border-secondary-200 bg-white px-4 py-3 text-sm text-secondary-700 shadow-sm">
        <div><span className="font-semibold">Wallet:</span> {isConnected ? truncateAddress(walletAddress) : 'Not connected'}</div>
        <div><span className="font-semibold">Network:</span> {isConnected ? networkName : 'Connect wallet to view network'}</div>
      </div>
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
    </div>
  );
}

export default WalletStatus;
