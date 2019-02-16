const fs = require('fs')

const Reputation = artifacts.require("./Reputation.sol");

module.exports = function(deployer) {
  const v = '100000000';
  const initialSupply = web3.toHex(v+'0'.repeat(18));
  deployer.then(async () => {
    const rpt = await deployer.deploy(Reputation, initialSupply);
    let addresses = require('../work/deployed.json');
    addresses.Reputation = rpt.address;
    fs.writeFileSync('./work/deployed.json', JSON.stringify(addresses,null,2))
  })
}
