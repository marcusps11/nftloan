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
    address payable public admin;
    address public nftAddress;
    uint256 tokenID;
    bool buyerCancel = false;
    bool sellerCancel = false;
    ProjectState public projectState;
    uint interestRate;
    address private bank = 0x17F6AD8Ef982297579C203069C1DbfFE4348c372;
    uint public startTime;
    uint public endTime;

    constructor(){
        sellerAddress = payable(msg.sender);
        projectState = ProjectState.newEscrow;
        interestRate = 10;
        endTime = block.timestamp + 604800;
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



