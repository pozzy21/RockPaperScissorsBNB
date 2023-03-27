const contractAddress = "0xcf6d4163DBcaA4C5F0eCD43DAF2a0d33f46AD09A";
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "option",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "result",
				"type": "uint8"
			}
		],
		"name": "Game",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "_option",
				"type": "uint8"
			}
		],
		"name": "RockPaperScissor",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const provider = new ethers.providers.Web3Provider(window.ethereum, 97)//ChainID 97 BNBtestnet
let signer;
let contract;


const event = "Game";

provider.send("eth_requestAccounts", []).then(()=>{
    provider.listAccounts().then( (accounts) => {
        signer = provider.getSigner(accounts[0]); //account in metamask
        
        contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
        )
    }
    )
}
)

async function flipCoin(_option){
    let amountInEth = document.getElementById("amountInEth").value;
    let amountInWei = ethers.utils.parseEther(amountInEth.toString())
    //console.log(amountInWei);
    
    let resultOfCoinFlip = await contract.RockPaperScissor(_option, {value: amountInWei});
    const res = await resultOfCoinFlip.wait();
    console.log(res);
    //console.log(await res.events[0].args.player.toString());
    

    let queryResult =  await contract.queryFilter('Game', await provider.getBlockNumber() - 100, await provider.getBlockNumber());
    let queryResultRecent = queryResult[queryResult.length-1]
    //console.log(queryResult[queryResult.length-1].args);

    let amount = await queryResultRecent.args.amount.toString();
    let player = await queryResultRecent.args.player.toString();
    let option = await queryResultRecent.args.option.toString();
    let result = await queryResultRecent.args.result.toString();


	alert(result);
    let resultLogs = `
    stake amount: ${ethers.utils.formatEther(amount.toString())} BNB, 
    player: ${player}, 
	${result == 2 ? "result: WIN 😥":""}
	${result == 1 ? "result: LOSE 😥":""}
	${result == 0 ? "result: DRAW 😥":""}`
    console.log(resultLogs);





    let resultLog = document.getElementById("resultLog");
    resultLog.innerText = resultLogs;

    handleEvent();
	sendMessage();
}

async function handleEvent(){

    console.log(await contract.filters.Game());
    let queryResult =  await contract.queryFilter('Game', await provider.getBlockNumber() - 100, await provider.getBlockNumber());
    let queryResultRecent = queryResult[queryResult.length-1]
    let amount = await queryResultRecent.args.amount.toString();
    let player = await queryResultRecent.args.player.toString();
    let option = await queryResultRecent.args.option.toString();
    let result = await queryResultRecent.args.result.toString();
    let resultLogs = `
    stake amount: ${ethers.utils.formatEther(amount.toString())} BNB, 
    player: ${player}, 
     ${result == 2 ? "result: WIN 😥":""}
	 ${result == 1 ? "result: LOSE 😥":""}
	 ${result == 0 ? "result: DRAW 😥":""}`
    console.log(resultLogs);






    let resultLog = document.getElementById("resultLog");
    resultLog.innerText = resultLogs;
}


async function sendMessage() {
	let queryResult =  await contract.queryFilter('Game', await provider.getBlockNumber() - 100, await provider.getBlockNumber());
    let queryResultRecent = queryResult[queryResult.length-1]
    let amount = await queryResultRecent.args.amount.toString();
    let player = await queryResultRecent.args.player.toString();
    let option = await queryResultRecent.args.option.toString();
    let result = await queryResultRecent.args.result.toString();
    let resultLogs = `
    stake amount: ${ethers.utils.formatEther(amount.toString())} BNB, 
    player: ${player}, 
	${result == 2 ? "result: WIN 😥":""}
	${result == 1 ? "result: LOSE 😥":""}
	${result == 0 ? "result: DRAW 😥":""}`

	  let game = document.getElementById("games");
	  game.innerHTML += "<p>" + resultLogs + "</p>";
	
  }