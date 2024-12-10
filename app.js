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
  const contractAddress = "0xe602b032997923378055a3BF6bd3cdD7a4570209";
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

  // Automatically fetch and display bets for the signed-in address
  async function fetchBetsForUser() {
      try {
          const accounts = await web3.eth.getAccounts();
          const userAddress = accounts[0];

          console.log("Fetching bets for address:", userAddress);

          const pendingBets = [];
          const maxBetsToCheck = 10;

          for (let i = 0; i < maxBetsToCheck; i++) {
              try {
                  const bet = await contract.methods.bets(userAddress, i).call();
                  if (bet && bet.sender !== "0x0000000000000000000000000000000000000000") {
                      pendingBets.push(bet);
                  } else {
                      break;
                  }
              } catch (err) {
                  console.log(`No bet found at index ${i}:`, err.message);
                  break;
              }
          }

          console.log("Fetched Bets:", pendingBets);
          displayBets(pendingBets);
      } catch (err) {
          console.error("Error fetching bets:", err);
      }
  }

  function displayBets(bets) {
      const betsDiv = document.getElementById("fetchBetsOutput");
      betsDiv.innerHTML = "";

      if (bets.length === 0) {
          betsDiv.textContent = "No pending bets found.";
          return;
      }

      bets.forEach((bet, index) => {
          const betDiv = document.createElement("div");
          betDiv.className = "bet-entry";
          betDiv.innerHTML = `
              <p><strong>Bet ${index + 1}:</strong></p>
              <p>Sender: ${bet.sender}</p>
              <p>Receiver: ${bet.receiver}</p>
              <p>Amount: ${web3.utils.fromWei(bet.betAmount, "ether")} POL</p>
              <p>Created At: ${new Date(bet.createdAt * 1000).toLocaleString()}</p>
              <p>Accepted: ${bet.betAccepted ? "Yes" : "No"}</p>
              <hr />
          `;
          betsDiv.appendChild(betDiv);
      });
  }
  fetchBetsForUser();
});