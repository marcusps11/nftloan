// export const nftEscrowFixture= async (
//   signers
// ) => {
//   const deployer = signers[0];

//   const nftEscrowFactory = await hre.ethers.getContractFactory(
//     `NftEscrow`
//   );

//   const nftEscrowContract = (await nftEscrowFactory
//     .connect(deployer)
//     .deploy()) ;

//   await nftEscrowContract.deployed();

// //   const mockUsdc = await deployMockUsdc(deployer);

//   return { nftEscrowContract };
// };
