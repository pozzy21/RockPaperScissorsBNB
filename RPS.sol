// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RockPaperScissors{
    //modifier onlyOwner
    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }

    //Owner's address
    address owner; 

    //event to track result of Coin Flip
    event Game(address player, uint256 amount, uint8 option, uint8 result); 

    //in Constructor we assign owner's address;
    constructor() payable {
        owner = msg.sender;
    }

    //function that asks for 0 or 1 and returns if you win or lose
    function RockPaperScissor(uint8 _option) public payable returns (bool){ //view, pure = gassless 
        require(_option<3, "Please select 0,1 or 2");
        require(msg.value>0, "Please add your bet"); //WEI smallest unit ETH 
        //1,000,000,000,000,000,000 WEI = 1 ETH 
        require(msg.value*2 <= address(this).balance, "Contract balance is insuffieient ");

        //PseudoRandom and check with _option, return 0,1 or 2 
        uint256 random = (block.timestamp*block.gaslimit)%3;
        uint8 result;
        //TODO add oracle: https://docs.chain.link/vrf/v2/introduction
        //1 - rock 2 - paper - scissor
        emit Game(msg.sender, msg.value, _option, result);
        //hardcoded 0 - draw 1 - lose 2 - win
        if(random == _option){
            result = 0;
        }
        else if (random == 0 && _option == 1) {
            result =  1;
            }
        else if (random == 0 && _option == 2) { 
            result =  2;
            }
        else if (random == 1 && _option == 0) { 
            result =  2;
        }
        else if (random == 1 && _option == 2) {
            result =  1;
            }

        else if (random == 2 && _option == 0) {
            result =  1;
        }
        else if (random == 2 && _option == 1) {
            result =  2;
         }
        if (result == 2){
            //winner winner chicken dinner
            payable(msg.sender).transfer(msg.value*2);
            return true;
        }
        //lose
        else if (result == 1){
            return false;
            }
        //draw
        else{
            payable(msg.sender).transfer(msg.value);
            return false;
        }
    }

    //Owner can withdraw BNB amount
    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

}