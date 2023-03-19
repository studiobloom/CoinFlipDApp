async function initialize() {
    if (!window.ethereum) {
        console.error('No Ethereum provider detected');
        return;
    }

    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
        console.error('User denied account access');
    }

    const contractAddress = '0x0cde2C81aeaC28b672Af6c97a9C631073Fa8181e';
    const contractABI = [
      // ABI JSON
    ];
    
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    async function checkPendingBets() {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const account = accounts[0];

        const betAccepted = await contract.methods.betAccepted().call({ from: account });
        const pendingBetsDiv = document.getElementById('pendingBets');
        
        if (betAccepted) {
            pendingBetsDiv.innerHTML = '<p>No pending bets.</p>';
        } else {
            const betAmount = await contract.methods.betAmount().call({ from: account });
            const betAmountInEther = web3.utils.fromWei(betAmount, 'ether');
            pendingBetsDiv.innerHTML = `<p>Pending bet: ${betAmountInEther} Ether</p>`;
        }
    }

    async function placeBet(receiverAddress, betAmount) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const sender = accounts[0];

        contract.methods
            .placeBet(receiverAddress)
            .send({ from: sender, value: web3.utils.toWei(betAmount, 'ether') });
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
        checkPendingBets();
    });

    contract.events.BetAccepted().on('data', (event) => {
        console.log('Bet Accepted:', event);
        checkPendingBets();
    });

    contract.events.BetRevoked().on('data', (event) => {
        console.log('Bet Revoked:', event);
        checkPendingBets();
    });

    contract.events.CoinFlipResult().on('data', (event) => {
        console.log('Coin Flip Result:', event);
    });

    contract.events.WinnerPaid().on('data', (event) => {
        console.log('Winner Paid:', event);
    });

    // Initialize the check for pending bets
    checkPendingBets();

    // Listen for chain events
    window.ethereum.on('chainChanged', (_) => {
        window.location.reload();
    });

    // Listen for account changes
    window.ethereum.on('accountsChanged', (_) => {
        window.location.reload();
    });
}

window.addEventListener('DOMContentLoaded', initialize);

