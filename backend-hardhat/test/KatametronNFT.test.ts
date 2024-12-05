import { expect } from "chai";
import { ethers } from "hardhat";
import { KatametronNFT } from "../typechain-types";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("KatametronNFT", function () {
  async function deployKatametronNFTFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const KatametronNFTFactory = await ethers.getContractFactory(
      "KatametronNFT"
    );

    const katametronNFT = await KatametronNFTFactory.deploy("ipfs://baseURI/");
    await katametronNFT.waitForDeployment();

    return { katametronNFT, owner, addr1, addr2 };
  }

  it("Should deploy with correct name and symbol", async function () {
    const { katametronNFT } = await loadFixture(deployKatametronNFTFixture);
    expect(await katametronNFT.name()).to.equal("Katametron");
    expect(await katametronNFT.symbol()).to.equal("KMN");
  });

  it("Should allow a user to mint an NFT", async function () {
    const { katametronNFT, addr1 } = await loadFixture(
      deployKatametronNFTFixture
    );

    await katametronNFT.connect(addr1).mint();

    expect(await katametronNFT.balanceOf(addr1.address)).to.equal(1);
    expect(await katametronNFT.ownerOf(1)).to.equal(addr1.address);
  });

  it("Should not allow a user to mint more than one NFT", async function () {
    const { katametronNFT, addr1 } = await loadFixture(
      deployKatametronNFTFixture
    );

    await katametronNFT.connect(addr1).mint();

    await expect(katametronNFT.connect(addr1).mint()).to.be.revertedWith(
      "You have already minted an NFT."
    );
  });

  it("Should not allow minting more than MAX_SUPPLY NFTs", async function () {
    const { katametronNFT, owner } = await loadFixture(
      deployKatametronNFTFixture
    );

    const wallets = Array.from({ length: 100 }, () =>
      ethers.Wallet.createRandom()
    );
    const provider = ethers.provider;

    for (const wallet of wallets) {
      await owner.sendTransaction({
        to: wallet.address,
        value: ethers.parseEther("1"),
      });
    }

    for (const wallet of wallets) {
      const connectedWallet = wallet.connect(provider);
      await katametronNFT.connect(connectedWallet).mint();
    }

    await expect(katametronNFT.connect(owner).mint()).to.be.revertedWith(
      "Max supply reached."
    );
  });

  it("Should generate the correct token URI after minting", async function () {
    const { katametronNFT, addr1 } = await loadFixture(
      deployKatametronNFTFixture
    );

    await katametronNFT.connect(addr1).mint();

    expect(await katametronNFT.tokenURI(1)).to.equal("ipfs://baseURI/1.json");
  });

  it("Should not allow tokenURI query for nonexistent token", async function () {
    const { katametronNFT } = await loadFixture(deployKatametronNFTFixture);

    await expect(katametronNFT.tokenURI(1)).to.be.reverted;
  });

  it("Should allow only the owner to update the base URI", async function () {
    const { katametronNFT, owner, addr1 } = await loadFixture(
      deployKatametronNFTFixture
    );

    await katametronNFT.connect(owner).setBaseURI("ipfs://newBaseURI/");

    await katametronNFT.connect(addr1).mint();
    expect(await katametronNFT.tokenURI(1)).to.equal(
      "ipfs://newBaseURI/1.json"
    );
  });

  it("Should not allow non-owner to update the base URI", async function () {
    const { katametronNFT, addr1 } = await loadFixture(
      deployKatametronNFTFixture
    );

    await expect(katametronNFT.connect(addr1).setBaseURI("ipfs://newBaseURI/"))
      .to.be.reverted;
  });

  it("Should return the correct totalSupply", async function () {
    const { katametronNFT, addr1, addr2 } = await loadFixture(
      deployKatametronNFTFixture
    );

    await katametronNFT.connect(addr1).mint();
    await katametronNFT.connect(addr2).mint();

    expect(await katametronNFT.totalSupply()).to.equal(2);
  });

  it("Should not increment totalSupply beyond MAX_SUPPLY", async function () {
    const { katametronNFT, owner } = await loadFixture(
      deployKatametronNFTFixture
    );

    const wallets = Array.from({ length: 100 }, () =>
      ethers.Wallet.createRandom()
    );
    const provider = ethers.provider;

    for (const wallet of wallets) {
      await owner.sendTransaction({
        to: wallet.address,
        value: ethers.parseEther("1"),
      });
    }

    for (const wallet of wallets) {
      const connectedWallet = wallet.connect(provider);
      await katametronNFT.connect(connectedWallet).mint();
    }

    expect(await katametronNFT.totalSupply()).to.equal(100);
  });

  it("Should revert tokenURI for invalid tokenId", async function () {
    const { katametronNFT } = await loadFixture(deployKatametronNFTFixture);

    await expect(katametronNFT.tokenURI(0)).to.be.reverted;
    await expect(katametronNFT.tokenURI(9999)).to.be.reverted;
  });
});
