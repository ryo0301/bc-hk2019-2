const Web3 = require('web3')
const fs = require('fs')

const deployed = require('../work/deployed.json')
const ARTIFACTS_DIR = '../build/contracts'

async function main() {
  const web3 = new Web3('http://localhost:7545')

  const accounts = await web3.eth.getAccounts()
  const issuers = accounts.slice(0, 5)
  for (let i=0; i<issuers.length; i++) {
    console.log(`Issuer Address ${i}: ${issuers[i]}`)
  }

  const userRegistryArtifact = require(ARTIFACTS_DIR + '/UserRegistry.json')
  const userRegistry = new web3.eth.Contract(
    userRegistryArtifact.abi,
    deployed.UserRegistry
  )

  console.log("\nCreate Issuer Identities ...\n")
  const identityArtifact = require(ARTIFACTS_DIR + '/Identity.json')
  deployed.IssuerIdentity = []
  let identity
  for (let i=0; i<issuers.length; i++) {
    console.log(`[${i}]`)
    identity = new web3.eth.Contract(identityArtifact.abi)
    await identity.deploy({
      data: identityArtifact.bytecode,
      arguments: [deployed.UserRegistry]
    }).send({
      from: issuers[i],
      gas: 3000000
    }).on('transactionHash', (transactionHash) => {
      console.log(`Transaction Hash: ${transactionHash}`)
    }).on('receipt', (receipt) => {
      console.log(`Issuer Identity Contract Address: ${receipt.contractAddress}`)
      deployed.IssuerIdentity[i] = receipt.contractAddress
      fs.writeFileSync('../work/deployed.json', JSON.stringify(deployed,null,2))
    }).catch((error) => {
      console.error(error)
    })
  }
}

main()
