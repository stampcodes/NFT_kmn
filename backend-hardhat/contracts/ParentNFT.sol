// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ParentNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    constructor() ERC721("ParentNFT", "PNFT") Ownable(msg.sender) {}

    function mint(address to) external onlyOwner {
        _tokenIdCounter++;
        _safeMint(to, _tokenIdCounter);
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }
}
