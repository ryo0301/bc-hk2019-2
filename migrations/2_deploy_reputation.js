const Reputation = artifacts.require("./LifullCoin.sol");

module.exports = function(deployer) {
    const v = '100000000';
    const initialSupply = web3.toHex(v+'0'.repeat(18));
    deployer.deploy(Reputation, initialSupply);
}
