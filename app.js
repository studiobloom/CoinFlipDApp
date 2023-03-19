const contractAddress = "0x0cde2c81aeac28b672af6c97a9c631073fa8181e";
const contractABI = [{"inputs":[{"internalType":"address","name":"_receiver","type":"address"}],"name":"placeBet","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"bets","outputs":[{"internalType":"address payable","name":"sender","type":"address"},{"internalType":"address payable","name":"receiver","type":"address"},{"internalType":"uint256","name":"betAmount","type":"uint256"},{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"uint256","name":"acceptDeadline","type":"uint256"},{"internalType":"bool","name":"betAccepted","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"acceptBet","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"revokeBet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getBetDetails","outputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint256","name":"betAmount","type":"uint256"},{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"uint256","name":"acceptDeadline","type":"uint256"},{"internalType":"bool","name":"betAccepted","type":"bool"}],"stateMutability":"view","type":"function"}];
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

async function getBets() {
  const betCount = await contract.methods.getBetCount().call();

  // Clear the table
  $("#bet-table tbody").empty();

  // Add new bets to the table
  for (let i = 0; i < betCount; i++) {
    const bet = await contract.methods.getBets(i).call();
    const createdAt = new Date(bet[2] * 1000).toLocaleString();

    if (bet[0] != 0 && !bet[3]) { // Check if sender address is set and bet is not accepted yet
      const row = $("<tr>").appendTo("#bet-table tbody");
      $("<td>").text(i).appendTo(row);
      $("<td>").text(bet[0]).appendTo(row);
      $("<td>").text(web3.utils.fromWei(bet[1], "ether")).appendTo(row);
      $("<td>").text(createdAt).appendTo(row);
      $("<td>").html(`<button class="btn btn-primary btn-sm" onclick="acceptBet(${i})">Accept</button>`).appendTo(row);
    }
  }
}

