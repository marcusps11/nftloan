import { ethers } from 'ethers'
import nftAbi from "../MarcusNft.json";
import ercAbi from "../NftEscrow.json";

import { CONTRACT_ADDRESS, ESCROW_CONTRACT_ADDRESS } from '../constants'

const { ethereum } = window

const getEtheriumContract = (type) => {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const transactionContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    type === 'nft' ? nftAbi.abi : ercAbi.abi,
    signer
  )

  return transactionContract
}

const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {

        const connectedContract = getEtheriumContract('nft') 
        let nftTxn = await connectedContract.makeAnEpicNFT();
        await nftTxn.wait();

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };





export {
  getEtheriumContract,

  askContractToMintNft
}