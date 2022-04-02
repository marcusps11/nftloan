
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


  const nftFactory = await hre.ethers.getContractFactory("MarcusNft");
  const nftFactoryContract = await nftFactory.deploy();
  await nftFactoryContract.deployed();

  console.log("nft address: ", nftEscrowContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
