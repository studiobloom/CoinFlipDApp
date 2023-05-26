// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinFlipBet {
    struct Bet {
        address payable sender;
        address payable receiver;
        uint256 betAmount;
        uint256 createdAt;
        bool betAccepted;
    }

    mapping(address => Bet[]) public bets;

    event BetPlaced(address indexed _sender, address indexed _receiver, uint256 _betAmount);
    event BetAccepted(address indexed _receiver, uint256 _betAmount);
    event CoinFlipResult(address indexed _winner, uint256 _amount);
    event WinnerPaid(address indexed _winner, uint256 _amount);

    function placeBet(address payable _receiver) external payable {
        require(msg.value > 0, "Bet amount should be greater than 0");

        Bet memory newBet = Bet(payable(msg.sender), _receiver, msg.value, block.timestamp, false);
        bets[_receiver].push(newBet);

        emit BetPlaced(newBet.sender, newBet.receiver, newBet.betAmount);
    }

    function acceptBet(uint256 _index) external payable {
        require(_index < bets[msg.sender].length, "Invalid bet index");
        Bet storage bet = bets[msg.sender][_index];
        require(!bet.betAccepted, "Bet already accepted");
        require(block.timestamp <= bet.createdAt + 3 days, "Bet acceptance deadline passed");
        require(msg.value == bet.betAmount, "Incorrect bet amount");

        bet.betAccepted = true;

        emit BetAccepted(bet.receiver, bet.betAmount);

        _flipCoinAndPayout(bet);
    }

    function _flipCoinAndPayout(Bet memory _bet) private {
        uint256 winner = uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp))) % 2;
        address payable winnerAddress;

        if (winner == 0) {
            winnerAddress = _bet.sender;
        } else {
            winnerAddress = _bet.receiver;
        }

        emit CoinFlipResult(winnerAddress, _bet.betAmount * 2);

        winnerAddress.transfer(address(this).balance);
        emit WinnerPaid(winnerAddress, _bet.betAmount * 2);
    }
}
