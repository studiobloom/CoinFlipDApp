const contractAddress = "0x0cde2c81aeac28b672af6c97a9c631073fa8181e";
const contractABI = [
  // The contract ABI remains the same
  // ... (contract ABI definition)
];

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
  await contractInstance.methods.placeBet(receiverAddress).send({ from: web3.eth.defaultAccount, value: web3.utils.toWei(betAmount) });
  console.log('Bet placed successfully!');
}

async function acceptBet(betIndex) {
  const account = web3.eth.defaultAccount;
  const bet = await contractInstance.methods.bets(account, betIndex).call();
  const betAmount = bet.betAmount;
  await contractInstance.methods.acceptBet(betIndex).send({ from: account, value: betAmount });
  console.log('Bet accepted successfully!');
}

async function getBets() {
  const account = web3.eth.defaultAccount;
  const bets = await contractInstance.methods.bets(account).call();

  // Clear the table
  $("#bet-table tbody").empty();

  // Add new bets to the table
  bets.forEach((bet, index) => {
    if (!bet.betAccepted) {
      const createdAt = new Date(bet.createdAt * 1000).toLocaleString();
      const row = $("<tr>").appendTo("#bet-table tbody");
      $("<td>").text(index).appendTo(row);
      $("<td>").text(bet.sender).appendTo(row);
      $("<td>").text(bet.betAmount).appendTo(row);
      $("<td>").text(createdAt).appendTo(row);
      $("<td>").html(`<button class="btn btn-primary btn-sm" onclick="acceptBet(${index})">Accept</button>`).appendTo(row);
    }
  });
}
