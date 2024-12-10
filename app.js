document.addEventListener("DOMContentLoaded", async () => {
  if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask!");
      return;
  }

  const web3 = new Web3(window.ethereum);

  try {
      // Request MetaMask accounts
      await window.ethereum.request({ method: "eth_requestAccounts" });
  } catch (error) {
      console.error("User denied account access:", error);
      return;
  }

  // Contract details
  const contractAddress = "0xcE3A845d30493edC66Aaa266409c2044Bfb57B92"; // Replace with your contract address
  const contractABI = [
    {
      "anonymous": false,
      "inputs": [
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
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "acceptBet",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "bets",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "address payable",
          "name": "receiver",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "betAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "betAccepted",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
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
    }
  ];

      const contract = new web3.eth.Contract(contractABI, contractAddress);

    async function placeBet(receiver, betAmount) {
        try {
            const accounts = await web3.eth.getAccounts();
            const sender = accounts[0];
            const value = web3.utils.toWei(betAmount, "ether"); // Convert Ether to Wei

            await contract.methods.placeBet(receiver).send({ from: sender, value });
            document.getElementById("placeBetOutput").textContent = "Bet placed successfully!";
        } catch (err) {
            console.error("Error placing bet:", err);
            document.getElementById("placeBetOutput").textContent = `Error: ${err.message}`;
        }
    }

    async function acceptBet(index, betAmount) {
        try {
            const accounts = await web3.eth.getAccounts();
            const sender = accounts[0];
            const value = web3.utils.toWei(betAmount, "ether"); // Convert Ether to Wei

            await contract.methods.acceptBet(index).send({ from: sender, value });
            document.getElementById("acceptBetOutput").textContent = "Bet accepted successfully!";
        } catch (err) {
            console.error("Error accepting bet:", err);
            document.getElementById("acceptBetOutput").textContent = `Error: ${err.message}`;
        }
    }

    async function getBets(userAddress, index) {
      console.log("getBets called with:");
      console.log("User Address:", userAddress);
      console.log("Index (hard-coded):", index);
  
      try {
          const bet = await contract.methods.bets(userAddress, index).call();
          console.log("Fetched Bet:", bet);
          document.getElementById("fetchBetsOutput").textContent = JSON.stringify(bet, null, 2);
      } catch (err) {
          console.error("Error fetching bets:", err);
          document.getElementById("fetchBetsOutput").textContent = `Error: ${err.message}`;
      }
  }

    // Attach button actions
    document.getElementById("placeBetButton").addEventListener("click", async () => {
        const receiver = document.getElementById("receiverAddress").value;
        const betAmount = document.getElementById("betAmount").value;
        await placeBet(receiver, betAmount);
    });
  });
  
  async function getBets(userAddress, index) {
      console.log("Calling getBets with:");
      console.log("User Address:", userAddress);
      console.log("Index:", index);
  
      try {
          const bet = await contract.methods.bets(userAddress, index).call();
          console.log("Fetched Bet:", bet);
          document.getElementById("fetchBetsOutput").textContent = JSON.stringify(bet, null, 2);
      } catch (err) {
          console.error("Error fetching bets:", err);
          document.getElementById("fetchBetsOutput").textContent = `Error: ${err.message}`;
      }
  }
