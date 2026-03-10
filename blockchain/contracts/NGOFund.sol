// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NGOFund {
    struct NGO {
        string mongoId;
        string name;
        address wallet;
        bool isRegistered;
    }

    struct Donation {
        address donor;
        string ngoId;
        uint256 amount;
        uint256 timestamp;
        string message;
    }

    // Mapping from NGO ID (MongoDB ID) to NGO details
    mapping(string => NGO) public ngos;
    
    // Array of all donations
    Donation[] public donations;

    // Events to log activities on the blockchain
    event NGORegistered(string indexed mongoId, string name, address indexed wallet);
    event DonationMade(address indexed donor, string indexed ngoId, uint256 amount, uint256 timestamp);

    /**
     * @dev Register a new NGO on the blockchain
     * @param _mongoId The MongoDB Object ID of the NGO
     * @param _name The name of the NGO
     * @param _wallet The wallet address where funds will be sent (or just stored for reference)
     */
    function registerNGO(string memory _mongoId, string memory _name, address _wallet) external {
        require(!ngos[_mongoId].isRegistered, "NGO already registered");
        require(_wallet != address(0), "Invalid wallet address");

        ngos[_mongoId] = NGO({
            mongoId: _mongoId,
            name: _name,
            wallet: _wallet,
            isRegistered: true
        });

        emit NGORegistered(_mongoId, _name, _wallet);
    }

    /**
     * @dev Make a donation to a specific NGO
     * @param _ngoId The MongoDB ID of the NGO receiving the donation
     * @param _message A short message from the donor
     */
    function donate(string memory _ngoId, string memory _message) external payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        require(ngos[_ngoId].isRegistered, "NGO not registered on blockchain");

        // Record the donation
        donations.push(Donation({
            donor: msg.sender,
            ngoId: _ngoId,
            amount: msg.value,
            timestamp: block.timestamp,
            message: _message
        }));

        // In a real-world scenario, we might forward the funds to the NGO's wallet:
        // payable(ngos[_ngoId].wallet).transfer(msg.value);
        // For this project, we keep funds in the contract or let the admin withdraw/distribute.
        // Let's forward it immediately to simplify "fund management" and trust.
        
        address payable ngoWallet = payable(ngos[_ngoId].wallet);
        (bool sent, ) = ngoWallet.call{value: msg.value}("");
        require(sent, "Failed to send Ether to NGO");

        emit DonationMade(msg.sender, _ngoId, msg.value, block.timestamp);
    }

    /**
     * @dev Get total number of donations
     */
    function getDonationCount() external view returns (uint256) {
        return donations.length;
    }
}
