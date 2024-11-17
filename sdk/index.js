const { ethers } = require('ethers');
const ABI = require('./abi.json');

class ForechainSDK {
    constructor() {
        this.provider = null;
        this.contract = null;
        this.contractAddress = '0x9ce63ef48fbc84c6c7c914c490b8aa32024a66aa';
        this.rpcUrl = "https://sepolia.drpc.org";
        // Add your contract ABI here
        this.abi = ABI;
    }

    async connectWallet() {
        try {
            // Check if we're in a browser environment
            if (typeof window === 'undefined' || typeof window.ethereum === 'undefined') {
                throw new Error('MetaMask not installed or not in browser environment');
            }

            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await this.provider.send('eth_requestAccounts', []);
            this.contract = new ethers.Contract(
                this.contractAddress,
                this.abi,
                this.provider.getSigner()
            );
            return accounts[0];
        } catch (error) {
            throw new Error(`Error connecting to MetaMask: ${error.message}`);
        }
    }

    // Project Creation and Management
    async createProject(buyer, seller) {
        try {
            const tx = await this.contract.createProject(buyer, seller);
            await tx.wait();
            return tx.hash;
        } catch (error) {
            throw new Error(`Error creating project: ${error.message}`);
        }
    }

    async acceptProject(projectId) {
        try {
            const tx = await this.contract.acceptProject(projectId);
            await tx.wait();
            return tx.hash;
        } catch (error) {
            throw new Error(`Error accepting project: ${error.message}`);
        }
    }

    async addFunds(projectId, amount) {
        try {
            const tx = await this.contract.addFunds(projectId, {
                value: ethers.utils.parseEther(amount.toString())
            });
            await tx.wait();
            return tx.hash;
        } catch (error) {
            throw new Error(`Error adding funds: ${error.message}`);
        }
    }

    // Asset Management
    async submitAsset(projectId, assetLink, instructions) {
        try {
            const tx = await this.contract.submitAsset(projectId, assetLink, instructions);
            await tx.wait();
            return tx.hash;
        } catch (error) {
            throw new Error(`Error submitting asset: ${error.message}`);
        }
    }

    async acceptAsset(projectId) {
        try {
            const tx = await this.contract.acceptAsset(projectId);
            await tx.wait();
            return tx.hash;
        } catch (error) {
            throw new Error(`Error accepting asset: ${error.message}`);
        }
    }

    async rejectAsset(projectId) {
        try {
            const tx = await this.contract.rejectAsset(projectId);
            await tx.wait();
            return tx.hash;
        } catch (error) {
            throw new Error(`Error rejecting asset: ${error.message}`);
        }
    }

    // View Functions
    async getUserProjects(address) {
        try {
            return await this.contract.getUserProjects(address);
        } catch (error) {
            throw new Error(`Error getting user projects: ${error.message}`);
        }
    }

    async getProjectStatus(projectId) {
        try {
            return await this.contract.getProjectStatus(projectId);
        } catch (error) {
            throw new Error(`Error getting project status: ${error.message}`);
        }
    }

    async getAssetInfo(projectId) {
        try {
            return await this.contract.getAssetInfo(projectId);
        } catch (error) {
            throw new Error(`Error getting asset info: ${error.message}`);
        }
    }

    async getProjectAmount(projectId) {
        try {
            return await this.contract.getProjectAmount(projectId);
        } catch (error) {
            throw new Error(`Error getting project amount: ${error.message}`);
        }
    }

    async getRejectionCount(projectId) {
        try {
            return await this.contract.getRejectionCount(projectId);
        } catch (error) {
            throw new Error(`Error getting rejection count: ${error.message}`);
        }
    }

    async getProjectsForApproval(address) {
        try {
            return await this.contract.getProjectsForApproval(address);
        } catch (error) {
            throw new Error(`Error getting projects for approval: ${error.message}`);
        }
    }

    // Admin Functions
    async resolveDispute(projectId, acceptAsset) {
        try {
            const tx = await this.contract.resolveDispute(projectId, acceptAsset);
            await tx.wait();
            return tx.hash;
        } catch (error) {
            throw new Error(`Error resolving dispute: ${error.message}`);
        }
    }

    async getDisputedProjects() {
        try {
            return await this.contract.getDisputedProjects();
        } catch (error) {
            throw new Error(`Error getting disputed projects: ${error.message}`);
        }
    }

    async getCurrentFeePercentage() {
        try {
            return await this.contract.getCurrentFeePercentage();
        } catch (error) {
            throw new Error(`Error getting fee percentage: ${error.message}`);
        }
    }

    async getContractBalance() {
        try {
            return await this.contract.getContractBalance();
        } catch (error) {
            throw new Error(`Error getting contract balance: ${error.message}`);
        }
    }
}


// Export both the class and the createSDKInstance function
module.exports = ForechainSDK;