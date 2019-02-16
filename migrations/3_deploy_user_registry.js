const UserRegistry = artifacts.require("./UserRegistry.sol");
const Reputation = artifacts.require("./Reputation.sol");


module.exports = function(deployer) {
  deployer.then(async ()=>{

    const rpt = await Reputation.deployed();
    const userReg = await deployer.deploy(UserRegistry, rpt.address);
    const totalSupply = await rpt.totalSupply();
    await rpt.approve(userReg.address, totalSupply);
    return userReg;
  });
};
