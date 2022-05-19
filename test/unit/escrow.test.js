// const { expect, before, beforeEach } = require('chai');
const { ethers, waffle } = require("hardhat");
const { expect } = require("chai");
const BN = require('bn.js');
const { beforeEach, before } = require("mocha");


describe('NFTESCROW unit test',  function () {

    before(async function () {
        const wallets = waffle.provider.getWallets();

        this.signers = {} ;
        this.signers.deployer = wallets[0];
        this.signers.alice = wallets[1];
        this.signers.bob = wallets[2];
    
        this.loadFixture = waffle.createFixtureLoader(wallets);

        const { nftContract } = await this.loadFixture(nftFixture);
        this.nftContract = nftContract

        const { nftEscrowContract } = await this.loadFixture(nftEscrowFixture);

        this.nftEscrowContract = nftEscrowContract;


    });


    beforeEach(async function () {
        await this.nftContract
        .connect(this.signers.deployer)
        .makeAnEpicNFT()
 
    });

    it('should start with the token in the owners account ', async function () {
       expect( await 
            this.nftEscrowContract
              .connect(this.signers.deployer)
              .walletHoldsToken(this.signers.deployer.address, this.nftContract.address)
          ).to.be.equal(true)


    });


    it('should allow the owner of the token to deposit the NFT ', async function () {
         await this.nftContract
        .connect(this.signers.deployer)
        .approve( this.nftEscrowContract.address, 0)

        await  this.nftEscrowContract
        .connect(this.signers.deployer)
        .depositNFT(this.nftContract.address, 0)

        const hasToken = await this.nftEscrowContract
        .connect(this.signers.deployer)
        .walletHoldsToken(this.nftEscrowContract.address, this.nftContract.address);

        expect(hasToken).to.be.equal(true)
    });

    it('should fire the approval event once the NFT contract is approved by the seller', async function () {
        await expect(
            this.nftContract
              .connect(this.signers.deployer)
              .approve( this.nftEscrowContract.address, 2)
                        )
            .to.be.emit(this.nftContract, "Approval")
        
      });

  });



  const nftEscrowFixture= async (
    signers
  ) => {
    const deployer = signers[0];
  
    const nftEscrowFactory = await hre.ethers.getContractFactory(
      `NftEscrow`
    );
  
    const nftEscrowContract = (await nftEscrowFactory
      .connect(deployer)
      .deploy()) ;
  
    await nftEscrowContract.deployed();
    
    return { nftEscrowContract };
  };
  

  const nftFixture= async (
    signers
  ) => {
    const deployer = signers[0];
  
    const nftFactory = await hre.ethers.getContractFactory(
      `MyEpicNFT`
    );
  
    const nftContract = (await nftFactory
      .connect(deployer)
      .deploy()) ;
  
    await nftContract.deployed();
  
  //   const mockUsdc = await deployMockUsdc(deployer);
  
    return { nftContract };
  };
  