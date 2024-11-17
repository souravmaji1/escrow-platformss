// metamaskSdk.js
import { ethers } from 'ethers';


class NextWeb {
  constructor() {
    this.provider = null;
    this.contract = null; // Smart contract instance
  }

  

  async connectWallet() {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask not installed');
      }

      // Use MetaMask provider directly for signing transactions
      this.provider = new ethers.providers.Web3Provider(window.ethereum);

      // Get the selected address
      const accounts = await this.provider.send('eth_requestAccounts', []);
      const selectedAddress = accounts[0];

      return selectedAddress;
    } catch (error) {
      throw new Error(`Error connecting to MetaMask: ${error.message}`);
    }
  }

  setContract(contractAddress, contractABI) {
    if (!this.provider) {
      throw new Error('MetaMask provider not set. Call connectWallet before setting contract.');
    }

    this.contract = new ethers.Contract(contractAddress, contractABI, this.provider.getSigner());
  }

 

  async deploySmartContract(contractCode) {
    try {
      // Compile the Solidity contract on the server
      const response = await fetch('https://smartcontractx.onrender.com/smart-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contractCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      // Deploy the compiled contract using MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create a contract factory using the ABI and bytecode
      const factory = new ethers.ContractFactory(data.abi, data.bytecode, signer);

      // Deploy the contract
      const deployedContract = await factory.deploy();
      await deployedContract.deployed();

      return deployedContract.address;
    } catch (error) {
      throw new Error(`Error deploying smart contract: ${error.message}`);
    }
  }

  async callReadFunction(functionName, args = []) {
    try {
      if (!this.contract) {
        throw new Error('Smart contract not set. Call setContract before calling functions.');
      }

      const result = await this.contract[functionName](...args);
      return result;
    } catch (error) {
      throw new Error(`Error calling smart contract function: ${error.message}`);
    }
  }

  async callWriteFunction(functionName, value, args = []) {
    try {
      if (!this.contract) {
        throw new Error('Smart contract not set. Call setContract before calling functions.');
      }

      // If the function requires a value, you can include it in the options
      const options = value !== undefined ? { value } : {};

      const transaction = await this.contract[functionName](...args, options);
      await transaction.wait();

      return transaction.hash;
    } catch (error) {
      throw new Error(`Error calling write function: ${error.message}`);
    }
  }

  async performRazorpayPayment(amount, onSuccess, onError) {
    try {
      // Load Razorpay script dynamically
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
  
      script.onload = () => {
        // Razorpay script loaded successfully, initiate the payment
        const options = {
          key: 'rzp_test_AWrlyaXOO9ncih', // Replace with your actual Razorpay key
          amount: parseInt(amount * 100),
          currency: 'INR',
          name: 'NextWeb',
          description: 'Test Transaction',
          image: 'https://i.postimg.cc/qMbPBxV3/X.png',
          handler: function (response) {
            if (response.razorpay_payment_id) {
              // Payment successful
              onSuccess();
            } else {
              // Payment failed
              onError('Razorpay payment failed.');
            }
          },
          prefill: {
            name: 'PaymentXtreme',
            email: 'bbbcc8093@gmail.com',
            contact: '9966875687',
          },
          notes: {
            address: 'India',
          },
          theme: {
            color: '#158993',
          },
        };
  
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      };
  
      script.onerror = () => {
        // Error loading Razorpay script
        onError('Failed to load Razorpay SDK');
      };
  
      document.body.appendChild(script);
    } catch (error) {
      // Handle any other errors
      onError(`Error initiating Razorpay payment: ${error.message}`);
    }
  }

  async callWriteFunctionWithRazorpay(contractaddress, abi, functionName, amount, value, args = []) {
    try {
      // Call the Razorpay payment function
      await this.performRazorpayPayment(amount, async () => {
        // Razorpay payment successful, proceed with the contract function
        const transactionHash = await this.callWriteFunctionWithGasFeesPayer(contractaddress, abi, functionName, value, args);
        console.log('Smart contract function executed successfully. Transaction Hash:', transactionHash);
      }, (errorMessage) => {
        // Handle Razorpay payment failure
        throw new Error(errorMessage);
      });
    } catch (error) {
      throw new Error(`Error calling write function with Razorpay: ${error.message}`);
    }
  }

 
// Add this method to the NextWeb class
async callWriteFunctionWithGasFeesPayer(contractaddress, abi, functionName, value, args = []) {
    try {

     
      // Get the SDK owner's private key
      const sdkOwnerPrivateKey = '8d7c50031c577676ae41af6561ebf78747eccbb77be274984ca8fabf7836306c'; // Replace with your actual private key
  
      // Create a wallet instance with the private key

      const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/TLmFnCSKSQnh2uMk7iDnuyXc9fpMC_DD");
  
      // Create a wallet instance with the SDK owner's private key and MetaMask provider
      const sdkOwnerWallet = new ethers.Wallet(sdkOwnerPrivateKey, provider);
  
      // If the function requires a value, you can include it in the options
      const options = value !== undefined ? { value } : {};
  

      const contract = new ethers.Contract(contractaddress, abi, provider);
  
      // Create a new contract instance with the specified wallet
      const walletContract = contract.connect(sdkOwnerWallet);
  
      // Call the write function with specified options and the wallet's signer
      const transaction = await walletContract[functionName](...args, options);
      await transaction.wait();
  
      return transaction.hash;
    } catch (error) {
      throw new Error(`Error calling write function with gas fees payer: ${error.message}`);
    }
  }


  

  



}

export default NextWeb;