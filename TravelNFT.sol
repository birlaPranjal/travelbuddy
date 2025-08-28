// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TravelNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Mapping from token ID to task ID
    mapping(uint256 => string) private _taskIds;
    
    // Event emitted when an NFT is minted
    event NFTMinted(address to, uint256 tokenId, string taskId, string tokenURI);

    constructor() ERC721("Travel Buddy NFT", "TRAVEL") Ownable(msg.sender) {}

    /**
     * @dev Mints a new NFT for a completed travel task
     * @param to The address that will own the minted NFT
     * @param tokenURI The token URI for the NFT metadata
     * @param taskId The ID of the completed task
     * @return The ID of the newly minted token
     */
    function mintNFT(address to, string memory tokenURI, string memory taskId) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        
        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _taskIds[newItemId] = taskId;
        
        emit NFTMinted(to, newItemId, taskId, tokenURI);
        
        return newItemId;
    }
    
    /**
     * @dev Gets the task ID associated with a token
     * @param tokenId The ID of the token
     * @return The task ID string
     */
    function getTaskId(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "TravelNFT: Query for nonexistent token");
        return _taskIds[tokenId];
    }
    
    /**
     * @dev Checks if a token exists
     * @param tokenId The token ID to check
     * @return Whether the token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
} 