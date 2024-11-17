import { useState, useEffect } from 'react';
import ForechainSDK from 'forechainsdk';
import { Loader2 } from 'lucide-react';

export default function CreateEscrowProject() {
  const [sdk, setSdk] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    buyerAddress: '',
    sellerAddress: ''
  });

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const escrowSDK = new ForechainSDK();
        setSdk(escrowSDK);
      } catch (err) {
        setError('Failed to initialize SDK');
        console.error(err);
      }
    };

    initializeSDK();
  }, []);

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError('');
      const address = await sdk.connectWallet();
      setWalletConnected(true);
      setSuccess(`Wallet connected: ${address}`);
    } catch (err) {
      setError('Failed to connect wallet. Make sure MetaMask is installed.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!sdk || !walletConnected) {
        throw new Error('Please connect your wallet first');
      }

      const { buyerAddress, sellerAddress } = formData;
      
      if (!buyerAddress || !sellerAddress) {
        throw new Error('Please fill in all fields');
      }

      if (!buyerAddress.startsWith('0x') || !sellerAddress.startsWith('0x')) {
        throw new Error('Invalid address format. Addresses should start with 0x');
      }

      const tx = await sdk.createProject(buyerAddress, sellerAddress);
      setSuccess(`Project created successfully! Transaction hash: ${tx}`);
      setFormData({ buyerAddress: '', sellerAddress: '' });
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Create Escrow Project</h2>
        {!walletConnected && (
          <button
            onClick={connectWallet}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin mr-2" size={16} />
                Connecting...
              </span>
            ) : (
              'Connect Wallet'
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="buyerAddress" className="block text-sm font-medium mb-1">
            Buyer Address
          </label>
          <input
            type="text"
            id="buyerAddress"
            name="buyerAddress"
            value={formData.buyerAddress}
            onChange={handleInputChange}
            placeholder="0x..."
            className="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            disabled={!walletConnected || loading}
          />
        </div>

        <div>
          <label htmlFor="sellerAddress" className="block text-sm font-medium mb-1">
            Seller Address
          </label>
          <input
            type="text"
            id="sellerAddress"
            name="sellerAddress"
            value={formData.sellerAddress}
            onChange={handleInputChange}
            placeholder="0x..."
            className="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            disabled={!walletConnected || loading}
          />
        </div>

        <button
          type="submit"
          disabled={!walletConnected || loading}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" size={16} />
              Creating Project...
            </span>
          ) : (
            'Create Project'
          )}
        </button>
      </form>
    </div>
  );
}