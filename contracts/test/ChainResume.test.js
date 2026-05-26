const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ChainResume", function () {
  let chainResume;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    const ChainResume = await ethers.getContractFactory("ChainResume");
    chainResume = await ChainResume.deploy();
  });

  describe("Minting Credentials", function () {
    it("Should mint a new credential", async function () {
      const ipfsHash = "QmTest123";
      const aiScore = 85;

      await expect(chainResume.connect(user1).mintCredential(ipfsHash, aiScore))
        .to.emit(chainResume, "CredentialMinted")
        .withArgs(user1.address, ipfsHash, aiScore, await ethers.provider.getBlock('latest').then(b => b.timestamp + 1));

      expect(await chainResume.hasMinted(user1.address)).to.be.true;
      expect(await chainResume.totalCredentials()).to.equal(1);
    });

    it("Should not allow minting twice", async function () {
      await chainResume.connect(user1).mintCredential("QmTest123", 85);
      
      await expect(
        chainResume.connect(user1).mintCredential("QmTest456", 90)
      ).to.be.revertedWith("Credential already exists");
    });

    it("Should reject invalid AI score", async function () {
      await expect(
        chainResume.connect(user1).mintCredential("QmTest123", 101)
      ).to.be.revertedWith("Score must be 0-100");
    });

    it("Should reject empty IPFS hash", async function () {
      await expect(
        chainResume.connect(user1).mintCredential("", 85)
      ).to.be.revertedWith("IPFS hash required");
    });
  });

  describe("Updating Credentials", function () {
    beforeEach(async function () {
      await chainResume.connect(user1).mintCredential("QmTest123", 85);
    });

    it("Should update existing credential", async function () {
      const newHash = "QmTest456";
      const newScore = 92;

      await expect(chainResume.connect(user1).updateCredential(newHash, newScore))
        .to.emit(chainResume, "CredentialUpdated");

      const cred = await chainResume.getCredential(user1.address);
      expect(cred.ipfsHash).to.equal(newHash);
      expect(cred.aiScore).to.equal(newScore);
    });

    it("Should not allow updating non-existent credential", async function () {
      await expect(
        chainResume.connect(user2).updateCredential("QmTest456", 90)
      ).to.be.revertedWith("No credential to update");
    });
  });

  describe("Verification", function () {
    it("Should verify active credential", async function () {
      await chainResume.connect(user1).mintCredential("QmTest123", 85);
      expect(await chainResume.verify(user1.address)).to.be.true;
    });

    it("Should return false for non-existent credential", async function () {
      expect(await chainResume.verify(user2.address)).to.be.false;
    });

    it("Should return false for revoked credential", async function () {
      await chainResume.connect(user1).mintCredential("QmTest123", 85);
      await chainResume.connect(owner).revokeCredential(user1.address);
      expect(await chainResume.verify(user1.address)).to.be.false;
    });
  });

  describe("Soul-Bound Token (Non-transferable)", function () {
    it("Should not allow transfers", async function () {
      await chainResume.connect(user1).mintCredential("QmTest123", 85);
      
      await expect(
        chainResume.connect(user1).transferFrom(user1.address, user2.address, 1)
      ).to.be.revertedWith("Soul-Bound: Transfer not allowed");
    });

    it("Should not allow approvals", async function () {
      await chainResume.connect(user1).mintCredential("QmTest123", 85);
      
      await expect(
        chainResume.connect(user1).approve(user2.address, 1)
      ).to.be.revertedWith("Soul-Bound: Approval not allowed");
    });
  });

  describe("Getting Credentials", function () {
    it("Should return credential data", async function () {
      const ipfsHash = "QmTest123";
      const aiScore = 85;
      
      await chainResume.connect(user1).mintCredential(ipfsHash, aiScore);
      
      const cred = await chainResume.getCredential(user1.address);
      expect(cred.ipfsHash).to.equal(ipfsHash);
      expect(cred.aiScore).to.equal(aiScore);
      expect(cred.isActive).to.be.true;
    });

    it("Should revert for non-existent credential", async function () {
      await expect(
        chainResume.getCredential(user2.address)
      ).to.be.revertedWith("No credential found");
    });
  });
});
