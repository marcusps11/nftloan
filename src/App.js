import logo from "./logo.svg";
import { useEffect, useState } from "react";
import "./App.css";
import {  ethers } from "ethers";
import nftAbi from "./utils/MarcusNft.json";
import escrowAbi from "./utils/NftEscrow.json";
import ercAbi from "./utils/erc.json";
import Modal from "./Modal";

import { useForm } from "./utils/hooks/useForm";
import { Nav } from "./utils/components/Nav";
import { askContractToMintNft } from "./utils/services/ethereumService";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const CONTRACT_ADDRESS = "0x06C3d53932b99f9B92Be02fCc1a5837d695c1C9f";
  const ESCROW_CONTRACT_ADDRESS = "0x0BcB295b05D7ff2021f903b330383BD21371bcbA";
  const { values, handleChange } = useForm();
  const [holdsToken, setDoesWalletHoldToken] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [owner, setCurrentOwner] = useState("");

  console.log(values);
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          nftAbi.abi,
          signer
        );
        const connectedEscrowContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          ercAbi.abi,
          signer
        );

        console.log(connectedEscrowContract);

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId);
          console.log(from, tokenId.toNumber());
          console.log(
            `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
        });

        connectedEscrowContract.on("Approval", (owner, approved, tokenId) => {
          console.log(`Approval Fired`, owner, tokenId.toNumber());
        });

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };



  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);

      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      setupEventListener();
    } else {
      console.log("No authorized account found");
    }
  };

  const approveEscrowForDeposit = async () => {
    console.log(values.approvedAddress);
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          nftAbi.abi,
          signer
        );

        let nftTxn = await connectedContract.approve(
          values.approvedAddress,
          values.tokenId
        );

        console.log("Mining...please wait.", nftTxn);
        await nftTxn.wait();

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
        setCurrentStep(2);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const depositNft = async (e) => {
    e.preventDefault();
    console.log(values.nftId);
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          ESCROW_CONTRACT_ADDRESS,
          escrowAbi.abi,
          signer
        );

        let nftTxn = await connectedContract.depositNFT(
          CONTRACT_ADDRESS,
          parseInt(values.nftId)
        );

        console.log("Mining...please wait.", nftTxn);
        await nftTxn.wait();

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
        doesWalletHoldToken();
        // console.log(connectedContract)
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const returnNft = async (e) => {
    e.preventDefault();
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          ESCROW_CONTRACT_ADDRESS,
          escrowAbi.abi,
          signer
        );

        let nftTxn = await connectedContract.returnNft(
          CONTRACT_ADDRESS,
          values.returnNftId
        );

        console.log("Mining...please wait.", nftTxn);
        await nftTxn.wait();

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
        // console.log(connectedContract)
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendEth = async (e) => {
    e.preventDefault();
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          ESCROW_CONTRACT_ADDRESS,
          escrowAbi.abi,
          signer
        );
        let owedAmount = await connectedContract.getOwedAmount();
        owedAmount = owedAmount.toString();
        let transaction = await connectedContract.depositEth({
          value: owedAmount,
        });
        await transaction.wait();

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${transaction.hash}`
        );
        doesWalletHoldToken();
        // console.log(connectedCntract)
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const doesWalletHoldToken = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);

        const connectedContract = new ethers.Contract(
          ESCROW_CONTRACT_ADDRESS,
          escrowAbi.abi,
          provider
        );

        let holdsToken = await connectedContract.walletHoldsToken(
          ESCROW_CONTRACT_ADDRESS,
          CONTRACT_ADDRESS
        );
        setDoesWalletHoldToken(holdsToken);
        console.log(holdsToken);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkOwnerOf = async (id) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);

        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          nftAbi.abi,
          provider
        );

        var owner = await connectedContract.ownerOf(4);
        setCurrentOwner(owner);
        console.log(owner);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      setupEventListener();
      console.log("acalled");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    doesWalletHoldToken();
  }, []);
  return (
    <div class="flex mb-4">
      <div class="w-full bg-gray-500 h-12">
        <Nav />
        <main class=" bg-gray-100 shadow-sm rounded-md p-8 ">
          <div class="flex mb-4">
            <div class="w-1/2 bg-gray-400 h-12">
              <h1 className="text-lg">Deposit NFT</h1>
            </div>
            <div class="w-1/2 bg-gray-500 h-12">

            <button
            onClick={() => setModalOpen(!modalOpen)}
            class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
            data-modal-toggle="defaultModal"
          >
            Get Started
          </button>

            </div>
          </div>
          <div>
            <h3 className="font-medium">
              {holdsToken
                ? " Smart Contract Holds Token"
                : "Smart Contract Does Not Hold Token"}
            </h3>
          </div>
       
          <div>
            <h3>Check Owner of NFT </h3>
            <h3>{owner} </h3>
            <input type="text"></input>
            <button
              className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={checkOwnerOf}
            >
              CHeck Owner
            </button>
          </div>
          <Modal
            approveEscrowForDeposit={approveEscrowForDeposit}
            depositNft={depositNft}
            setModalOpen={() => setModalOpen(!modalOpen)}
            active={modalOpen}
            handleChange={handleChange}
            values={values}
            currentStep={currentStep}
          />
          <section class="container mx-auto px-6 ">
            <h4>Current MSG.SENDER</h4>
            <button onClick={connectWallet}>
              {currentAccount ? currentAccount : "CONNECT"}
            </button>
            <button
              className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={askContractToMintNft}
            >
              MINT NFT
            </button>
            <h6 className="text-3xl font-bold underline">
              ESCROW CONTRACT_ADDRESS = {ESCROW_CONTRACT_ADDRESS}
            </h6>
            <h6>NFT CONTRACT ADDRESS = {CONTRACT_ADDRESS}</h6>

            <div>
              <h2>Approve Escrow Contract</h2>
              <div className="deposit__container">
                <form>
                  <input
                    className="bg-white rounded-md border border-gray-200 p-3 focus:outline-none w-full"
                    placeholder="Address to Approve"
                    onChange={handleChange}
                    value={values.approvedAddress}
                    name="approvedAddress"
                    type="text"
                  ></input>
                  <input
                    className="bg-white rounded-md border border-gray-200 p-3 focus:outline-none w-full"
                    placeholder="Token Id"
                    onChange={handleChange}
                    value={values.tokenId}
                    name="tokenId"
                    type="text"
                  ></input>
                  <button type="submit" onClick={approveEscrowForDeposit}>
                    Approve
                  </button>
                </form>
              </div>
            </div>

            <div className="deposit__container flex items-center justify-between p-6 container mx-auto">
              <label for="nftId" class="mb-3 block text-gray-700">
                NFT ID
              </label>
              <input
                className="bg-white rounded-md border border-gray-200 p-3 focus:outline-none w-full"
                placeholder="nftId"
                onChange={handleChange}
                value={values.nftId}
                name="nftId"
                type="text"
              ></input>
              <button onClick={depositNft}>DEPOSIT NFT</button>
            </div>

            <input
              className="bg-white rounded-md border border-gray-200 p-3 focus:outline-none w-full"
              placeholder="Wallet Address"
              onChange={handleChange}
              value={values.wallet}
              name="wallet"
              type="text"
            ></input>
            <input
              className="bg-white rounded-md border border-gray-200 p-3 focus:outline-none w-full"
              placeholder="Token ADdress Address"
              onChange={handleChange}
              value={values.tokenAddress}
              name="tokenAddress"
              type="text"
            ></input>
            <button onClick={doesWalletHoldToken}>
              Does Wallet Hold token?
            </button>

            <div className="deposit__container">
              <input
                className="bg-white rounded-md border border-gray-200 p-3 focus:outline-none w-full"
                placeholder="Amount 100Wei"
                onChange={handleChange}
                value={values.amount}
                name="amount"
                type="text"
              ></input>
              <button onClick={sendEth}>SEND ETH</button>
            </div>

            <div className="deposit__container">
              <input
                className="bg-white rounded-md border border-gray-200 p-3 focus:outline-none w-full"
                placeholder="returnNftId"
                onChange={handleChange}
                value={values.returnNftId}
                name="returnNftId"
                type="text"
              ></input>
              <button onClick={returnNft}>RETURN NFT</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
