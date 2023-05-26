const contractAddress = "0x0cde2c81aeac28b672af6c97a9c631073fa8181e";
const contractABI = [{"inputs":[{"internalType":"address","name":"_receiver","type":"address"}],"name":"placeBet","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"acceptBet","outputs":[],"stateMutability":"payable","type":"function"}];

let contractInstance;

window.addEventListener('load', async () => {
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      await ethereum.enable();
      initContract();
    } catch (err) {
      console.log(err);
    }
  } else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
    initContract();
  } else {
    console.log('Metamask not detected!');
  }
});

function initContract() {
  contractInstance = new web3.eth.Contract(contractABI, contractAddress);
  console.log('Contract instance created!');
}

async function placeBet() {
  const betAmount = document.getElementById("betAmount").value;
  const receiverAddress = document.getElementById("receiverAddress").value;
  await contractInstance.methods.placeBet(receiverAddress).send({from: web3.eth.defaultAccount, value: web3.utils.toWei(betAmount)});
  console.log('Bet placed successfully!');
}

async function acceptBet(betIndex) {
  const account = web3.eth.defaultAccount;
  const bet = await contractInstance.methods.bets(account, betIndex).call();
  const betAmount = bet.betAmount;
  await contractInstance.methods.acceptBet(betIndex).send({from: account, value: betAmount});
  console.log('Bet accepted successfully!');
}