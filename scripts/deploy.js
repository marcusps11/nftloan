
const hre = require("hardhat");


async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  const nftEscrowFactory = await hre.ethers.getContractFactory("NftEscrow");
  const nftEscrowContract = await nftEscrowFactory.deploy();
  await nftEscrowContract.deployed();

  console.log("Escrow address: ", nftEscrowContract.address);


  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  // let txn = await nftContract.makeAnEpicNFT()
  // // Wait for it to be mined.
  // await txn.wait()

  // // Mint another NFT for fun.
  // txn = await nftContract.makeAnEpicNFT()
  // // Wait for it to be mined.
  // await txn.wait()


  // Wait for it to be mined.

  // console.log("nft address: ", nftFactoryContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error); 
    process.exit(1);
  });
