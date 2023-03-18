let contractInstance;

async function initWeb3() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            window.web3 = new Web3(window.ethereum);
        } catch (error) {
            console.error('User denied account access');
        }
    } else {
        console.error('No Ethereum provider detected');
    }
}

initWeb3();

const contractAddress = '0x0cde2C81aeaC28b672Af6c97a9C631073Fa8181e';
const contractABI = [
{
	"inputs": [],
	"name": "acceptBet",
	"outputs": [],
	"stateMutability": "payable",
	"type": "function"
},
{
	"anonymous": false,
	"inputs": [
		{
			"indexed": true,
			"internalType": "address",
			"name": "_receiver",
			"type": "address"
		}
	],
	"name": "BetAccepted",
	"type": "event"
},
{
	"anonymous": false,
	"inputs": [
		{
			"indexed": true,
			"internalType": "address",
			"name": "_sender",
			"type": "address"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "_receiver",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "_betAmount",
			"type": "uint256"
		}
	],
	"name": "BetPlaced",
	"type": "event"
},
{
	"anonymous": false,
	"inputs": [
		{
			"indexed": true,
			"internalType": "address",
			"name": "_sender",
			"type": "address"
		}
	],
	"name": "BetRevoked",
	"type": "event"
},
{
	"anonymous": false,
	"inputs": [
		{
			"indexed": true,
			"internalType": "address",
			"name": "_winner",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "_amount",
			"type": "uint256"
		}
	],
	"name": "CoinFlipResult",
	"type": "event"
},
{
	"inputs": [
		{
			"internalType": "address payable",
			"name": "_receiver",
			"type": "address"
		}
	],
	"name": "placeBet",
	"outputs": [],
	"stateMutability": "payable",
	"type": "function"
},
{
	"inputs": [],
	"name": "revokeBet",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
},
{
	"anonymous": false,
	"inputs": [
		{
			"indexed": true,
			"internalType": "address",
			"name": "_winner",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "_amount",
			"type": "uint256"
		}
	],
	"name": "WinnerPaid",
	"type": "event"
},
{
	"inputs": [],
	"name": "acceptDeadline",
	"outputs": [
		{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}
	],
	"stateMutability": "view",
	"type": "function"
},
{
	"inputs": [],
	"name": "betAccepted",
	"outputs": [
		{
			"internalType": "bool",
			"name": "",
			"type": "bool"
		}
	],
	"stateMutability": "view",
	"type": "function"
},
{
	"inputs": [],
	"name": "betAmount",
	"outputs": [
		{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}
	],
	"stateMutability": "view",
	"type": "function"
},
{
	"inputs": [],
	"name": "createdAt",
	"outputs": [
		{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}
	],
	"stateMutability": "view",
	"type": "function"
},
{
	"inputs": [],
	"name": "receiver",
	"outputs": [
		{
			"internalType": "address payable",
			"name": "",
			"type": "address"
		}
	],
	"stateMutability": "view",
	"type": "function"
},
{
	"inputs": [],
	"name": "sender",
	"outputs": [
		{
			"internalType": "address payable",
			"name": "",
			"type": "address"
		}
	],
	"stateMutability": "view",
	"type": "function"
}
];
const contract = new window.web3.eth.Contract(contractABI, contractAddress);

async function placeBet(receiverAddress, betAmount) {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    const sender = accounts[0];

    contract.methods
        .placeBet(receiverAddress)
        .send({ from: sender, value: window.web3.utils.toWei(betAmount, 'ether') });
}

async function acceptBet() {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    const receiver = accounts[0];

    contract.methods
        .acceptBet()
        .send({ from: receiver, value: await contract.methods.betAmount().call({ from: receiver }) });
}

async function revokeBet() {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    const sender = accounts[0];

    contract.methods
        .revokeBet()
        .send({ from: sender });
}

document.getElementById('placeBetButton').addEventListener('click', async () => {
    const receiverAddress = document.getElementById('receiverAddress').value;
    const betAmount = document.getElementById('betAmount').value;
    await placeBet(receiverAddress, betAmount);
});

document.getElementById('acceptBetButton').addEventListener('click', async () => {
    await acceptBet();
});

document.getElementById('revokeBetButton').addEventListener('click', async () => {
    await revokeBet();
});

// Event listeners
contract.events.BetPlaced().on('data', (event) => {
    console.log('Bet Placed:', event);
});

contract.events.BetAccepted().on('data', (event) => {
    console.log('Bet Accepted:', event);
});

contract.events.BetRevoked().on('data', (event) => {
    console.log('Bet Revoked:', event);
});

contract.events.CoinFlipResult().on('data', (event) => {
    console.log('Coin Flip Result:', event);
});

contract.events.WinnerPaid().on('data', (event) => {
    console.log('Winner Paid:', event);
});
