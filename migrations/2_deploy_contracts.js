const Identity = artifacts.require('../contracts/Identity.sol');

module.exports = function(deployer, network, accounts) {

  return deployer
      .then(() => {
          return deployer.deploy(Identity); 
      })
};
