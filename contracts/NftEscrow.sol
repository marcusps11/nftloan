//SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "hardhat/console.sol";

// contract NftEscrowCreator {
//     NftEscrow[] public escrows;

//     function createEscrow() public {
//        NftEscrow newEscrow = new NftEscrow(msg.sender);
//        escrows.push(newEscrow);
//     }
// }

contract NftEscrow is IERC721Receiver {
    
    enum ProjectState {newEscrow, nftDeposited, cancelNFT, ethDeposited, nftReturned, deliveryInitiated, delivered}
    
    address payable public sellerAddress;
    address payable public buyerAddress;
    address public nftAddress;
    uint256 tokenID;
    ProjectState public projectState;
    uint interestRate;
    address private bank = 0x43dfE62621F352e7E940CB191b03822B3212034B;
    uint public startTime;
    uint public endTime;
    uint256 public amountOwed;


    constructor(){
        sellerAddress = payable(msg.sender);
        projectState = ProjectState.newEscrow;
        interestRate = 10;
        endTime = block.timestamp + 604800;
        amountOwed = 100 wei;

    }

      event Approve(address sender, uint256 tokenId);

    receive ()payable external {
            depositEth();
        }


    
    function onERC721Received( address , address , uint256 , bytes calldata  ) public pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
    
    function depositNFT(address _NFTAddress, uint256 _TokenID) public onlySeller {
        startTime = block.timestamp;
        nftAddress = _NFTAddress;
        tokenID = _TokenID;
        ERC721(nftAddress).safeTransferFrom(msg.sender, address(this), tokenID);
        projectState = ProjectState.nftDeposited;
    }

    function depositEth() public payable hasToken(address(this), nftAddress)  {
        require(msg.value == amountOwed, 'You owe more money');
        buyerAddress = payable(msg.sender);
        projectState = ProjectState.ethDeposited;
        if(walletHoldsToken(address(this),nftAddress)) {
         ERC721(nftAddress).safeTransferFrom(address(this), buyerAddress, tokenID);
         projectState = ProjectState.deliveryInitiated;
        }
    }

    function walletHoldsToken(address  _wallet, address  _contract) public view returns (bool) {
        return IERC721(_contract).balanceOf(_wallet) > 0;
    }

    function returnNft(address _NFTAddress, uint256 _TokenID) onlyBuyer public payable  {
        nftAddress = _NFTAddress;
        tokenID = _TokenID;
        ERC721(nftAddress).safeTransferFrom(msg.sender, address(this), tokenID);
        uint amount = address(this).balance;
        uint amountMinusCommission = amount - (amount * interestRate / 100);
        uint contractFee = amount * interestRate / 100;
        buyerAddress.transfer(amountMinusCommission);
        payable(bank).transfer(contractFee / 2);
        sellerAddress.transfer(contractFee/ 2);

        projectState = ProjectState.nftReturned;
        
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    function claimMoney() public onlySeller payable {
        if(block.timestamp >= endTime && !walletHoldsToken(buyerAddress, nftAddress )) {
         payable(sellerAddress).transfer(address(this).balance);

        }
    }

    function cancelNFT() public  payable onlySeller hasToken(address(this), nftAddress)  {
        ERC721(nftAddress).safeTransferFrom(address(this), sellerAddress, tokenID);
        projectState = ProjectState.cancelNFT;

    }

   function getOwedAmount() public view returns (uint256) {
    return amountOwed;
  }


    modifier hasToken(address  _wallet, address  _contract) {
		require(ERC721(_contract).balanceOf(_wallet) > 0);
		_;
	}

    modifier onlySeller() {
		require(msg.sender == sellerAddress);
		_;
	}

      modifier onlyBuyer() {
		require(msg.sender == buyerAddress);
		_;
	}

} 



