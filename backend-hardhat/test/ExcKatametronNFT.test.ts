import { expect } from "chai";
import { ethers } from "hardhat";
import { ExcKatametronNFT, ParentNFT } from "../typechain-types";

describe("ExcKatametronNFT", function () {
  async function deployFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const ParentNFTFactory = await ethers.getContractFactory("ParentNFT");
    const parentNFT: ParentNFT = await ParentNFTFactory.deploy();
    await parentNFT.waitForDeployment();

    const ExcKatametronNFTFactory = await ethers.getContractFactory(
      "ExcKatametronNFT"
    );
    const excKatametronNFT: ExcKatametronNFT =
      await ExcKatametronNFTFactory.deploy("ipfs://baseURI/", parentNFT.target);
    await excKatametronNFT.waitForDeployment();

    return { excKatametronNFT, parentNFT, owner, addr1, addr2 };
  }

  it("Should deploy with correct name and symbol", async function () {
    const { excKatametronNFT } = await deployFixture();

    expect(await excKatametronNFT.name()).to.equal("ExcKatametron");
    expect(await excKatametronNFT.symbol()).to.equal("EXCKMN");
  });

  it("Should allow minting an NFT if the user owns a parent NFT", async function () {
    const { excKatametronNFT, parentNFT, addr1 } = await deployFixture();

    await parentNFT.mint(addr1.address);

    const cost = await excKatametronNFT.calculateCost(1);

    await excKatametronNFT.connect(addr1).mint(1, { value: cost });

    expect(await excKatametronNFT.balanceOf(addr1.address)).to.equal(1);
  });

  it("Should not allow minting without owning a parent NFT", async function () {
    const { excKatametronNFT, addr1 } = await deployFixture();

    await expect(
      excKatametronNFT
        .connect(addr1)
        .mint(1, { value: ethers.parseEther("0.00000005") })
    ).to.be.revertedWith("Must own a parent NFT to mint.");
  });

  it("Should update the base URI when called by the owner", async function () {
    const { excKatametronNFT, parentNFT, owner } = await deployFixture();

    await parentNFT.mint(owner.address);

    await excKatametronNFT.mint(1, { value: ethers.parseEther("0.00000005") });

    const initialTokenURI = await excKatametronNFT.tokenURI(1);
    expect(initialTokenURI).to.equal("ipfs://baseURI/1.json");

    await excKatametronNFT.setBaseURI("ipfs://newBaseURI/");

    const updatedTokenURI = await excKatametronNFT.tokenURI(1);
    expect(updatedTokenURI).to.equal("ipfs://newBaseURI/1.json");
  });

  it("Should not allow non-owners to update the base URI", async function () {
    const { excKatametronNFT, addr1 } = await deployFixture();

    await expect(
      excKatametronNFT.connect(addr1).setBaseURI("ipfs://newBaseURI/")
    ).to.be.reverted;
  });

  it("Should allow naming an NFT with sufficient payment", async function () {
    const { excKatametronNFT, parentNFT, addr1 } = await deployFixture();

    await parentNFT.mint(addr1.address);
    await excKatametronNFT
      .connect(addr1)
      .mint(1, { value: ethers.parseEther("0.00000005") });

    await excKatametronNFT
      .connect(addr1)
      .nameNFT(1, "CustomName", { value: ethers.parseEther("0.0004") });

    const details = await excKatametronNFT.getNFTDetails(1);
    expect(details[0]).to.equal("CustomName");
    expect(details[3]).to.be.true;
  });

  it("Should not allow naming an NFT without sufficient payment", async function () {
    const { excKatametronNFT, parentNFT, addr1 } = await deployFixture();

    await parentNFT.mint(addr1.address);
    await excKatametronNFT
      .connect(addr1)
      .mint(1, { value: ethers.parseEther("0.00000005") });

    await expect(
      excKatametronNFT
        .connect(addr1)
        .nameNFT(1, "CheapName", { value: ethers.parseEther("0.0001") })
    ).to.be.revertedWith("Insufficient payment for naming.");
  });

  it("Should not allow a user to name an NFT they do not own", async function () {
    const { excKatametronNFT, parentNFT, addr1, addr2 } = await deployFixture();

    await parentNFT.mint(addr1.address);
    await excKatametronNFT
      .connect(addr1)
      .mint(1, { value: ethers.parseEther("0.00000005") });

    await expect(
      excKatametronNFT
        .connect(addr2)
        .nameNFT(1, "WrongOwner", { value: ethers.parseEther("0.0004") })
    ).to.be.revertedWith("Not the owner of this NFT.");
  });

  it("Should return correct totalSupply after minting", async function () {
    const { excKatametronNFT, parentNFT, addr1, addr2 } = await deployFixture();

    await parentNFT.mint(addr1.address);
    await parentNFT.mint(addr2.address);

    await excKatametronNFT
      .connect(addr1)
      .mint(1, { value: ethers.parseEther("0.00000005") });
    await excKatametronNFT
      .connect(addr2)
      .mint(1, { value: ethers.parseEther("0.00000005") });

    expect(await excKatametronNFT.totalSupply()).to.equal(2);
  });

  it("Should calculate cost correctly for NFTs in tier 1", async function () {
    const { excKatametronNFT } = await deployFixture();

    const cost = await excKatametronNFT.calculateCost(5);
    expect(cost).to.equal(ethers.parseEther("0.00000025")); // 5 * 0.00000005
  });

  it("Should calculate cost correctly for NFTs in tier 2", async function () {
    const { excKatametronNFT, parentNFT, addr1 } = await deployFixture();

    await parentNFT.mint(addr1.address);

    for (let i = 0; i < 15; i++) {
      await excKatametronNFT
        .connect(addr1)
        .mint(1, { value: ethers.parseEther("0.00000005") });
    }

    const cost = await excKatametronNFT.calculateCost(5);
    expect(cost).to.equal(ethers.parseEther("0.003"));
  });

  it("Should revert when quantity exceeds remaining supply", async function () {
    const { excKatametronNFT, parentNFT, addr1 } = await deployFixture();

    await parentNFT.mint(addr1.address);

    for (let i = 0; i < 39; i++) {
      const price =
        i < 15 ? ethers.parseEther("0.00000005") : ethers.parseEther("0.0006");
      await excKatametronNFT.connect(addr1).mint(1, { value: price });
    }

    await expect(excKatametronNFT.connect(addr1).mint(2)).to.be.revertedWith(
      "Exceeds max supply."
    );
  });

  it("Should calculate cost correctly for 1 NFT at the limit", async function () {
    const { excKatametronNFT, parentNFT, addr1 } = await deployFixture();

    await parentNFT.mint(addr1.address);

    for (let i = 0; i < 39; i++) {
      const price =
        i < 15 ? ethers.parseEther("0.00000005") : ethers.parseEther("0.0006");
      await excKatametronNFT.connect(addr1).mint(1, { value: price });
    }

    const cost = await excKatametronNFT.calculateCost(1);
    expect(cost).to.equal(ethers.parseEther("0.0006"));
  });
});
