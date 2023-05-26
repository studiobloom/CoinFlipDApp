let contractInstance;

window.addEventListener('load', async () => {
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      await ethereum.enable();
      initContract();
      displayPendingBets();
    } catch (err) {
      console.log(err);
    }
  } else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
    initContract();
    displayPendingBets();
  } else {
    console.log('Metamask not detected!');
  }
});

function initContract() {
  const contractAddress = '0x0cde2c81aeac28b672af6c97a9c631073fa8181e';
  const contractABI = [
    // Contract ABI definition
  ];

  contractInstance = new web3.eth.Contract(contractABI, contractAddress);
  console.log('Contract instance created!');
}

async function placeBet() {
  const receiverAddress = document.getElementById('receiverAddress').value;
  const betAmount = document.getElementById('betAmount').value;
  await contractInstance.methods.placeBet(receiverAddress).send({ from: web3.eth.defaultAccount, value: web3.utils.toWei(betAmount) });
  console.log('Bet placed successfully!');
  displayPendingBets();
}

async function acceptBet() {
  const bets = await contractInstance.methods.bets(web3.eth.defaultAccount).call();
  const pendingBets = bets.filter(bet => !bet.betAccepted);
  if (pendingBets.length > 0) {
    const betIndex = prompt(`Enter the index of the bet you want to accept (0-${pendingBets.length - 1}):`);
    if (betIndex !== null) {
      await contractInstance.methods.acceptBet(betIndex).send({ from: web3.eth.defaultAccount });
      console.log('Bet accepted successfully!');
      displayPendingBets();
    }
  } else {
    console.log('No pending bets to accept.');
  }
}

async function revokeBet() {
  const bets = await contractInstance.methods.bets(web3.eth.defaultAccount).call();
  const pendingBets = bets.filter(bet => !bet.betAccepted);
  if (pendingBets.length > 0) {
    const betIndex = prompt(`Enter the index of the bet you want to revoke (0-${pendingBets.length - 1}):`);
    if (betIndex !== null) {
      await contractInstance.methods.revokeBet(betIndex).send({ from: web3.eth.defaultAccount });
      console.log('Bet revoked successfully!');
      displayPendingBets();
    }
  } else {
    console.log('No pending bets to revoke.');
  }
}

async function displayPendingBets() {
  const bets = await contractInstance.methods.bets(web3.eth.defaultAccount).call();

  const pendingBets = bets.filter(bet => !bet.betAccepted);

  const pendingBetsContainer = document.getElementById('pendingBets');
  pendingBetsContainer.innerHTML = '';

  if (pendingBets.length > 0) {
    const title = document.createElement('h3');
    title.textContent = 'Pending Bets';
    pendingBetsContainer.appendChild(title);

    const betList = document.createElement('ul');
    pendingBets.forEach((bet, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `Bet ${index + 1} - Receiver: ${bet.receiver}, Amount: ${web3.utils.fromWei(bet.betAmount)} ETH`;
      betList.appendChild(listItem);
    });

    pendingBetsContainer.appendChild(betList);
  } else {
    const message = document.createElement('p');
    message.textContent = 'No pending bets.';
    pendingBetsContainer.appendChild(message);
  }
}

document.getElementById('placeBetButton').addEventListener('click', placeBet);
document.getElementById('acceptBetButton').addEventListener('click', acceptBet);
document.getElementById('revokeBetButton').addEventListener('click', revokeBet);
