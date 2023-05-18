# Palkeoramix decompiler. 

def storage:
  senderAddress is addr at storage 0
  receiverAddress is addr at storage 1
  betAmount is uint256 at storage 2
  createdAt is uint256 at storage 3
  unknown1cb8c540 is uint256 at storage 4
  unknownee9078a3 is uint8 at storage 5

def unknown1cb8c540(): # not payable
  return unknown1cb8c540

def sender(): # not payable
  return senderAddress

def createdAt(): # not payable
  return createdAt

def betAmount(): # not payable
  return betAmount

def unknownee9078a3(): # not payable
  return bool(unknownee9078a3)

def receiver(): # not payable
  return receiverAddress

#
#  Regular functions
#

def _fallback() payable: # default function
  revert

def unknown2f790c79(): # not payable
  if senderAddress != caller:
      revert with 0, 'Only sender can revoke the bet'
  if unknownee9078a3:
      revert with 0, 'Bet already accepted'
  if block.timestamp <= unknown1cb8c540:
      revert with 0x8c379a000000000000000000000000000000000000000000000000000000000, 'Bet acceptance deadline not passed yet'
  call senderAddress with:
     value betAmount wei
       gas 2300 * is_zero(value) wei
  if not ext_call.success:
      revert with ext_call.return_data[0 len return_data.size]
  log 0x92c399bf: senderAddress

def placeBet(address _miner) payable: 
  require calldata.size - 4 >=ΓÇ▓ 32
  require _miner == _miner
  if senderAddress:
      revert with 0, 'Bet already placed'
  if call.value <= 0:
      revert with 0x8c379a000000000000000000000000000000000000000000000000000000000, 'Bet amount should be greater than 0'
  senderAddress = caller
  receiverAddress = _miner
  betAmount = call.value
  createdAt = block.timestamp
  if createdAt > createdAt + (72 * 24 * 3600):
      revert with 'NH{q', 17
  unknown1cb8c540 = createdAt + (72 * 24 * 3600)
  log 0x3fe3739e: betAmount, senderAddress, receiverAddress

def unknown30bfcb5f() payable: 
  if receiverAddress != caller:
      revert with 0, 'Only receiver can accept the bet'
  if unknownee9078a3:
      revert with 0, 'Bet already accepted'
  if block.timestamp > unknown1cb8c540:
      revert with 0, 'Bet acceptance deadline passed'
  if betAmount != call.value:
      revert with 0, 'Incorrect bet amount'
  unknownee9078a3 = 1
  log 0xdd6dae32: receiverAddress
  if betAmount and 2 * betAmount / betAmount != 2:
      revert with 'NH{q', 17
  if sha3(block.difficulty, block.timestamp) % 2:
      log 0x90562fde: (2 * betAmount), receiverAddress
      call receiverAddress with:
         value eth.balance(this.address) wei
           gas 2300 * is_zero(value) wei
      if not ext_call.success:
          revert with ext_call.return_data[0 len return_data.size]
      if betAmount and 2 * betAmount / betAmount != 2:
          revert with 'NH{q', 17
      log 0x8cbbe5cd: (2 * betAmount), receiverAddress
  else:
      log 0x90562fde: (2 * betAmount), senderAddress
      call senderAddress with:
         value eth.balance(this.address) wei
           gas 2300 * is_zero(value) wei
      if not ext_call.success:
          revert with ext_call.return_data[0 len return_data.size]
      if betAmount and 2 * betAmount / betAmount != 2:
          revert with 'NH{q', 17
      log 0x8cbbe5cd: (2 * betAmount), senderAddress


