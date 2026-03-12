import { FaWallet } from 'react-icons/fa';
import { useWallet } from '../../hooks/useWallet';

function truncateAddress(address = '') {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function WalletButton({ className = 'btn', onClick }) {
  const { connectWallet, walletAddress, isConnected, isConnecting } = useWallet();

  const handleClick = async () => {
    if (!isConnected) {
      await connectWallet();
    }

    if (onClick) onClick();
  };

  return (
    <button type="button" className={className} onClick={handleClick} disabled={isConnecting}>
      <FaWallet className="mr-2" />
      {isConnecting ? 'Connecting...' : isConnected ? truncateAddress(walletAddress) : 'Connect MetaMask'}
    </button>
  );
}

export default WalletButton;
