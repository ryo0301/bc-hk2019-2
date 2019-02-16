const fs = require('fs')

const UserRegistry = artifacts.require("./UserRegistry.sol");
const Reputation = artifacts.require("./Reputation.sol");

module.exports = function(deployer) {
  deployer.then(async ()=>{
    const rpt = await Reputation.deployed();
    const userReg = await deployer.deploy(UserRegistry, rpt.address);
    const totalSupply = await rpt.totalSupply();
    await rpt.approve(userReg.address, totalSupply);

    let addresses = require('../work/deployed.json');
    addresses.UserRegistry = userReg.address;
    fs.writeFileSync('./work/deployed.json', JSON.stringify(addresses,null,2))

    return userReg;
  });
};
