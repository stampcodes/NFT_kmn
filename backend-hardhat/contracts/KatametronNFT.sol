// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KatametronNFT is ERC721, Ownable {
    uint256 public constant MAX_SUPPLY = 100;
    uint256 private _tokenIdCounter;
    mapping(uint256 => string) private _tokenURIs;
    string private baseURI;
    mapping(address => bool) private hasMinted;

    constructor(
        string memory _baseURI
    ) ERC721("Katametron", "KMN") Ownable(msg.sender) {
        baseURI = _baseURI;
    }

    event NFTMinted(address indexed owner, uint256 tokenId);

    function mint() public {
        require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached.");
        require(!hasMinted[msg.sender], "You have already minted an NFT.");

        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        hasMinted[msg.sender] = true;
        _safeMint(msg.sender, newTokenId);

        string memory newTokenURI = string(
            abi.encodePacked(baseURI, Strings.toString(newTokenId), ".json")
        );
        _tokenURIs[newTokenId] = newTokenURI;

        emit NFTMinted(msg.sender, newTokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            ownerOf(tokenId) != address(0),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return _tokenURIs[tokenId];
    }

    function setBaseURI(string memory newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }
}
