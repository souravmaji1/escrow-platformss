// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Escrow {
    enum Role { Buyer, Seller }
    enum Status { Created, Accepted, BuyerPaid, AssetSubmitted, AssetAccepted, AssetRejected, Completed, Cancelled, DisputeResolved, DisputeEscalated }

    struct AssetInfo {
        string assetLink;
        string instructions;
    }

    struct Project {
        address payable buyer;
        address payable seller;
        Status status;
        bool buyerAccepted;
        bool sellerAccepted;
        uint256 amount;
        AssetInfo asset;
        uint8 rejectionCount;
    }

    struct ProjectDetails {
        uint256 projectId;
        address buyer;
        address seller;
        Status status;
        bool buyerAccepted;
        bool sellerAccepted;
        uint256 amount;
        string assetLink;
        string instructions;
        uint8 rejectionCount;
    }

    mapping(uint256 => Project) public projects;
    uint256 public projectCount;
    uint256 public feePercentage; // Fee percentage multiplied by 100 (e.g., 100 = 1%)
    uint256 public contractBalance; // Track accumulated fees
    address public owner;

    event ProjectCreated(uint256 projectId, address buyer, address seller);
    event ProjectAccepted(uint256 projectId, address participant, Role role);
    event PaymentReceived(uint256 projectId, uint256 amount);
    event AssetSubmitted(uint256 projectId);
    event AssetAccepted(uint256 projectId);
    event AssetRejected(uint256 projectId, uint8 rejectionCount);
    event DisputeEscalated(uint256 projectId);
    event FundsTransferred(uint256 projectId, address recipient, uint256 amount);
    event DisputeResolved(uint256 projectId, bool acceptedBySeller);
    event FeeUpdated(uint256 newFeePercentage);
    event FeesWithdrawn(uint256 amount);

    constructor() {
        owner = msg.sender;
        feePercentage = 100; // Initialize fee to 1%
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    function updateFeePercentage(uint256 _newFeePercentage) public onlyOwner {
        require(_newFeePercentage <= 1000, "Fee cannot exceed 10%"); // Safety check
        feePercentage = _newFeePercentage;
        emit FeeUpdated(_newFeePercentage);
    }

    function withdrawFees() public onlyOwner {
        require(contractBalance > 0, "No fees to withdraw");
        uint256 amount = contractBalance;
        contractBalance = 0;
        payable(owner).transfer(amount);
        emit FeesWithdrawn(amount);
    }

    function calculateFee(uint256 _amount) internal view returns (uint256) {
        return (_amount * feePercentage) / 10000; // Divide by 10000 because fee is in basis points
    }

    function createProject(address payable _buyer, address payable _seller) public returns (uint256) {
        require(_buyer != _seller, "Buyer and seller must be different");
        require(_buyer != address(0) && _seller != address(0), "Invalid addresses");

        projectCount++;
        projects[projectCount] = Project({
            buyer: _buyer,
            seller: _seller,
            status: Status.Created,
            buyerAccepted: false,
            sellerAccepted: false,
            amount: 0,
            asset: AssetInfo("", ""),
            rejectionCount: 0
        });

        emit ProjectCreated(projectCount, _buyer, _seller);
        return projectCount;
    }

    function acceptProject(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(project.buyer != address(0), "Project does not exist");
        require(project.status == Status.Created, "Project is not in the Created state");
        require(msg.sender == project.buyer || msg.sender == project.seller, "Only buyer or seller can accept");

        if (msg.sender == project.buyer) {
            require(!project.buyerAccepted, "Buyer has already accepted");
            project.buyerAccepted = true;
            emit ProjectAccepted(_projectId, msg.sender, Role.Buyer);
        } else {
            require(!project.sellerAccepted, "Seller has already accepted");
            project.sellerAccepted = true;
            emit ProjectAccepted(_projectId, msg.sender, Role.Seller);
        }

        if (project.buyerAccepted && project.sellerAccepted) {
            project.status = Status.Accepted;
        }
    }

    function addFunds(uint256 _projectId) public payable {
        Project storage project = projects[_projectId];
        require(project.buyer != address(0), "Project does not exist");
        require(project.status == Status.Accepted, "Project must be in Accepted state");
        require(msg.sender == project.buyer, "Only the buyer can add funds");
        require(msg.value > 0, "Must send some Ether");

        uint256 fee = calculateFee(msg.value);
        uint256 projectAmount = msg.value - fee;
        
        project.amount = projectAmount; // Store the amount after fee
        contractBalance += fee; // Add fee to contract balance
        project.status = Status.BuyerPaid;

        emit PaymentReceived(_projectId, msg.value);
    }

    function submitAsset(uint256 _projectId, string memory _assetLink, string memory _instructions) public {
        Project storage project = projects[_projectId];
        require(project.seller != address(0), "Project does not exist");
        require(project.status == Status.BuyerPaid || project.status == Status.AssetRejected, "Invalid project state");
        require(msg.sender == project.seller, "Only the seller can submit the asset");

        project.asset = AssetInfo(_assetLink, _instructions);
        project.status = Status.AssetSubmitted;

        emit AssetSubmitted(_projectId);
    }

    function acceptAsset(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(project.buyer != address(0), "Project does not exist");
        require(project.status == Status.AssetSubmitted, "Asset must be submitted");
        require(msg.sender == project.buyer, "Only the buyer can accept the asset");
        require(project.rejectionCount < 3, "Dispute escalated to contract owner");

        project.status = Status.AssetAccepted;
        emit AssetAccepted(_projectId);

        // Transfer funds to seller (amount already has fee deducted)
        project.seller.transfer(project.amount);
        emit FundsTransferred(_projectId, project.seller, project.amount);

        project.status = Status.Completed;
    }

    function rejectAsset(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(project.buyer != address(0), "Project does not exist");
        require(project.status == Status.AssetSubmitted, "Asset must be submitted");
        require(msg.sender == project.buyer, "Only the buyer can reject the asset");
        require(project.rejectionCount < 3, "Dispute escalated to contract owner");

        project.rejectionCount++;

        if (project.rejectionCount == 3) {
            project.status = Status.DisputeEscalated;
            emit DisputeEscalated(_projectId);
        } else {
            project.status = Status.AssetRejected;
        }

        emit AssetRejected(_projectId, project.rejectionCount);
    }

    function getUserProjects(address _user) public view returns (ProjectDetails[] memory) {
        uint256 userProjectCount = 0;
        for (uint256 i = 1; i <= projectCount; i++) {
            if (projects[i].buyer == _user || projects[i].seller == _user) {
                userProjectCount++;
            }
        }

        ProjectDetails[] memory userProjects = new ProjectDetails[](userProjectCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= projectCount; i++) {
            if (projects[i].buyer == _user || projects[i].seller == _user) {
                Project storage project = projects[i];
                userProjects[currentIndex] = ProjectDetails({
                    projectId: i,
                    buyer: project.buyer,
                    seller: project.seller,
                    status: project.status,
                    buyerAccepted: project.buyerAccepted,
                    sellerAccepted: project.sellerAccepted,
                    amount: project.amount,
                    assetLink: project.asset.assetLink,
                    instructions: project.asset.instructions,
                    rejectionCount: project.rejectionCount
                });
                currentIndex++;
            }
        }

        return userProjects;
    }

    function resolveDispute(uint256 _projectId, bool _acceptAsset) public onlyOwner {
        Project storage project = projects[_projectId];
        require(project.buyer != address(0), "Project does not exist");
        require(project.status == Status.DisputeEscalated, "Not in dispute state");

        if (_acceptAsset) {
            // Transfer funds to seller (amount already has fee deducted)
            project.seller.transfer(project.amount);
            emit FundsTransferred(_projectId, project.seller, project.amount);
        } else {
            // Refund buyer (amount already has fee deducted)
            project.buyer.transfer(project.amount);
            emit FundsTransferred(_projectId, project.buyer, project.amount);
        }

        project.status = Status.DisputeResolved;
        emit DisputeResolved(_projectId, _acceptAsset);
    }

    function getAssetInfo(uint256 _projectId) public view returns (string memory, string memory) {
        Project storage project = projects[_projectId];
        require(project.seller != address(0), "Project does not exist");
        require(msg.sender == project.seller || msg.sender == project.buyer || msg.sender == owner, "Unauthorized");
        require(project.status >= Status.AssetSubmitted, "Asset not yet submitted");

        return (project.asset.assetLink, project.asset.instructions);
    }

    function getProjectStatus(uint256 _projectId) public view returns (Status) {
        require(projects[_projectId].buyer != address(0), "Project does not exist");
        return projects[_projectId].status;
    }

    function getProjectAmount(uint256 _projectId) public view returns (uint256) {
        require(projects[_projectId].buyer != address(0), "Project does not exist");
        return projects[_projectId].amount;
    }

    function getRejectionCount(uint256 _projectId) public view returns (uint8) {
        require(projects[_projectId].buyer != address(0), "Project does not exist");
        return projects[_projectId].rejectionCount;
    }

    function getProjectsForApproval(address _user) public view returns (uint256[] memory) {
        uint256[] memory projectsToApprove = new uint256[](projectCount);
        uint256 count = 0;

        for (uint256 i = 1; i <= projectCount; i++) {
            Project storage project = projects[i];
            if (project.status == Status.Created &&
                ((project.buyer == _user && !project.buyerAccepted) ||
                (project.seller == _user && !project.sellerAccepted))) {
                projectsToApprove[count] = i;
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = projectsToApprove[i];
        }

        return result;
    }

 function getDisputedProjects(address _walletAddress) public view returns (ProjectDetails[] memory) {
    require(_walletAddress == owner, "Only contract owner can view disputed projects");
    
    uint256 disputedCount = 0;
    
    // First count disputed projects
    for (uint256 i = 1; i <= projectCount; i++) {
        if (projects[i].status == Status.DisputeEscalated) {
            disputedCount++;
        }
    }
    
    // Create array of disputed projects
    ProjectDetails[] memory disputedProjects = new ProjectDetails[](disputedCount);
    uint256 currentIndex = 0;
    
    // Fill array with disputed projects
    for (uint256 i = 1; i <= projectCount; i++) {
        if (projects[i].status == Status.DisputeEscalated) {
            Project storage project = projects[i];
            disputedProjects[currentIndex] = ProjectDetails({
                projectId: i,
                buyer: project.buyer,
                seller: project.seller,
                status: project.status,
                buyerAccepted: project.buyerAccepted,
                sellerAccepted: project.sellerAccepted,
                amount: project.amount,
                assetLink: project.asset.assetLink,
                instructions: project.asset.instructions,
                rejectionCount: project.rejectionCount
            });
            currentIndex++;
        }
    }
    
    return disputedProjects;
}

    // New helper function to get the current fee percentage
    function getCurrentFeePercentage() public view returns (uint256) {
        return feePercentage;
    }

    // New helper function to get the current contract balance (accumulated fees)
    function getContractBalance() public view returns (uint256) {
        return contractBalance;
    }
}