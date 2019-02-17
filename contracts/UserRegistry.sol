pragma solidity ^0.4.24;

import "./ClaimHolder.sol";
import "./Reputation.sol";
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract UserRegistry is ClaimHolder, Ownable{

    Reputation public rpt;

    // struct Issuer{
    //     address x;
    // }

    event NewUser(address _address, address _identity);
    event NewIssuer(address _identity, address _issuer);
    event MintReptation(address _identity, address _issuer);

    mapping(address => address) public users;
    mapping(address => address[]) public issuers;

    constructor(address rptAddress) public {
        rpt = Reputation(rptAddress);
    }

    function registerUser()
        public
    {
        users[tx.origin] = msg.sender;
        emit NewUser(tx.origin, msg.sender);
    }

    /// @dev clearUser(): Remove user from the registry
    function clearUser()
        public
    {
        users[msg.sender] = 0;
    }

    function registerIssuer(address identityAddress, address issuerAddress)
        public
    {
        issuers[identityAddress].push(issuerAddress);
        emit NewIssuer(identityAddress, issuerAddress);

        mintReptation(identityAddress, issuerAddress);
    }

    function mintReptation(address _identity, address _issuer) public {
        for (uint i = 0; i < issuers[_identity].length; i++){
            if(issuers[_identity][i] != _issuer){
                rpt.transferFrom(owner, issuers[_identity][i], 1 ether);
            }
        }
        emit MintReptation(_identity, _issuer);
    }
}
