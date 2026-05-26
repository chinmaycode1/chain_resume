// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ChainResume
 * @dev Soul-Bound Token (SBT) for verified resume credentials
 * Non-transferable NFT that proves resume authenticity
 */
contract ChainResume is ERC721, Ownable {
    
    struct Credential {
        string ipfsHash;      // IPFS hash of resume data
        uint256 aiScore;      // AI-generated resume score (0-100)
        uint256 timestamp;    // When credential was minted
        bool isActive;        // Can be revoked if needed
    }
    
    // Mapping from wallet address to credential
    mapping(address => Credential) public credentials;
    
    // Mapping to track if address has minted
    mapping(address => bool) public hasMinted;
    
    // Counter for total credentials minted
    uint256 public totalCredentials;
    
    // Events
    event CredentialMinted(
        address indexed owner,
        string ipfsHash,
        uint256 aiScore,
        uint256 timestamp
    );
    
    event CredentialUpdated(
        address indexed owner,
        string newIpfsHash,
        uint256 newAiScore,
        uint256 timestamp
    );
    
    event CredentialRevoked(
        address indexed owner,
        uint256 timestamp
    );
    
    constructor() ERC721("ChainResume Credential", "CRED") Ownable(msg.sender) {}
    
    /**
     * @dev Mint a new credential (Soul-Bound Token)
     * @param ipfsHash IPFS hash of resume data
     * @param aiScore AI-generated score (0-100)
     */
    function mintCredential(string memory ipfsHash, uint256 aiScore) external {
        require(!hasMinted[msg.sender], "Credential already exists");
        require(aiScore <= 100, "Score must be 0-100");
        require(bytes(ipfsHash).length > 0, "IPFS hash required");
        
        // Create credential
        credentials[msg.sender] = Credential({
            ipfsHash: ipfsHash,
            aiScore: aiScore,
            timestamp: block.timestamp,
            isActive: true
        });
        
        hasMinted[msg.sender] = true;
        totalCredentials++;
        
        // Mint SBT (token ID is just a counter, not used for lookup)
        _safeMint(msg.sender, totalCredentials);
        
        emit CredentialMinted(msg.sender, ipfsHash, aiScore, block.timestamp);
    }
    
    /**
     * @dev Update existing credential
     * @param newIpfsHash New IPFS hash
     * @param newAiScore New AI score
     */
    function updateCredential(string memory newIpfsHash, uint256 newAiScore) external {
        require(hasMinted[msg.sender], "No credential to update");
        require(credentials[msg.sender].isActive, "Credential is revoked");
        require(newAiScore <= 100, "Score must be 0-100");
        require(bytes(newIpfsHash).length > 0, "IPFS hash required");
        
        credentials[msg.sender].ipfsHash = newIpfsHash;
        credentials[msg.sender].aiScore = newAiScore;
        credentials[msg.sender].timestamp = block.timestamp;
        
        emit CredentialUpdated(msg.sender, newIpfsHash, newAiScore, block.timestamp);
    }
    
    /**
     * @dev Get credential for a wallet address
     * @param wallet Address to check
     */
    function getCredential(address wallet) external view returns (
        string memory ipfsHash,
        uint256 aiScore,
        uint256 timestamp,
        bool isActive
    ) {
        require(hasMinted[wallet], "No credential found");
        Credential memory cred = credentials[wallet];
        return (cred.ipfsHash, cred.aiScore, cred.timestamp, cred.isActive);
    }
    
    /**
     * @dev Verify if wallet has active credential
     * @param wallet Address to verify
     */
    function verify(address wallet) external view returns (bool) {
        return hasMinted[wallet] && credentials[wallet].isActive;
    }
    
    /**
     * @dev Revoke credential (only owner can call)
     * @param wallet Address to revoke
     */
    function revokeCredential(address wallet) external onlyOwner {
        require(hasMinted[wallet], "No credential to revoke");
        credentials[wallet].isActive = false;
        emit CredentialRevoked(wallet, block.timestamp);
    }
    
    /**
     * @dev Override transfer functions to make SBT non-transferable
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        require(from == address(0), "Soul-Bound: Transfer not allowed");
        return super._update(to, tokenId, auth);
    }
    
    /**
     * @dev Disable approvals (SBT cannot be approved for transfer)
     */
    function approve(address, uint256) public pure override {
        revert("Soul-Bound: Approval not allowed");
    }
    
    function setApprovalForAll(address, bool) public pure override {
        revert("Soul-Bound: Approval not allowed");
    }
}
