const ClaimHolder = artifacts.require('../contracts/ClaimHolder.sol');

module.exports = function(deployer, network, accounts) {

  return deployer
      .then(() => {
          return deployer.deploy(ClaimHolder); 
      })
      .then(() => {
          return deployer.deploy(ClaimHolder); 
      })
};
