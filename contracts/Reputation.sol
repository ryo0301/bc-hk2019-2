pragma solidity ^0.4.22;

import 'openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/RBACMintableToken.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/StandardBurnableToken.sol';

contract Reputation is DetailedERC20, RBACMintableToken, StandardBurnableToken {

    string private _name = 'Reputation';
    string private _symbol = 'Rpt';
    uint8 private _decimals = 18;

    constructor(uint value)
    DetailedERC20(_name, _symbol, _decimals)
    RBACMintableToken()
    StandardBurnableToken()
    public

    {
        addMinter(msg.sender);
        mint(msg.sender, value);
    }
}
