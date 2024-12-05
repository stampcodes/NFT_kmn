// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract ExcKatametronNFT is ERC721, Ownable {
    uint256 public constant MAX_SUPPLY = 40;
    uint256 private constant INITIAL_PRICE = 0.00000005 ether;
    uint256 private constant FINAL_PRICE = 0.0006 ether;
    uint256 private constant NAME_COST = 0.0004 ether;
    uint256 public constant MAX_PER_TX = 5;

    uint256 private _tokenIdCounter;
    string private baseURI;
    IERC721 private parentNFT;

    mapping(uint256 => string) public customNames;
    mapping(uint256 => string) private _tokenURIs;

    constructor(
        string memory _baseURI,
        address _parentNFT
    ) ERC721("ExcKatametron", "EXCKMN") Ownable(msg.sender) {
        require(_parentNFT != address(0), "Invalid parent NFT address.");
        baseURI = _baseURI;
        parentNFT = IERC721(_parentNFT);
    }

    event NFTMinted(address indexed owner, uint256 tokenId);
    event NFTNameUpdated(uint256 indexed tokenId, string newName);

    function mint(uint256 quantity) external payable {
        require(quantity > 0 && quantity <= MAX_PER_TX, "Invalid quantity.");
        require(
            _tokenIdCounter + quantity <= MAX_SUPPLY,
            "Exceeds max supply."
        );
        require(
            parentNFT.balanceOf(msg.sender) > 0,
            "Must own a parent NFT to mint."
        );

        uint256 totalCost = calculateCost(quantity);
        require(msg.value >= totalCost, "Insufficient payment.");

        for (uint256 i = 0; i < quantity; i++) {
            _tokenIdCounter++;
            uint256 newTokenId = _tokenIdCounter;

            _safeMint(msg.sender, newTokenId);

            string memory newTokenURI = string(
                abi.encodePacked(baseURI, Strings.toString(newTokenId), ".json")
            );
            _tokenURIs[newTokenId] = newTokenURI;

            emit NFTMinted(msg.sender, newTokenId);
        }

        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
    }

    function getNFTDetails(
        uint256 tokenId
    )
        external
        view
        returns (
            string memory name,
            string memory uri,
            address owner,
            bool hasCustomName
        )
    {
        require(ownerOf(tokenId) != address(0), "Query for nonexistent token");

        name = customNames[tokenId];
        hasCustomName = bytes(name).length > 0;
        uri = tokenURI(tokenId);
        owner = ownerOf(tokenId);
    }

    function calculateCost(uint256 quantity) public view returns (uint256) {
        require(quantity > 0, "Quantity must be greater than 0");
        require(_tokenIdCounter + quantity <= MAX_SUPPLY, "Exceeds max supply");

        uint256 totalCost = 0;
        uint256 currentTokenId = _tokenIdCounter + 1;

        for (uint256 i = 0; i < quantity; i++) {
            if (currentTokenId <= 15) {
                totalCost += INITIAL_PRICE;
            } else if (currentTokenId <= 40) {
                totalCost += FINAL_PRICE;
            }
            currentTokenId++;
        }

        return totalCost;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            ownerOf(tokenId) != address(0),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory customName = customNames[tokenId];
        if (bytes(customName).length > 0) {
            return string(abi.encodePacked(baseURI, customName, ".json"));
        }

        return _tokenURIs[tokenId];
    }

    function nameNFT(uint256 tokenId, string calldata name) external payable {
        require(msg.sender == ownerOf(tokenId), "Not the owner of this NFT.");
        require(msg.value >= NAME_COST, "Insufficient payment for naming.");
        customNames[tokenId] = name;

        emit NFTNameUpdated(tokenId, name);
    }

    function setBaseURI(string memory newBaseURI) public onlyOwner {
        baseURI = newBaseURI;

        // Aggiorna tutte le URI dei token già mintati
        for (uint256 i = 1; i <= _tokenIdCounter; i++) {
            _tokenURIs[i] = string(
                abi.encodePacked(baseURI, Strings.toString(i), ".json")
            );
        }
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }
}
