const Web3 = require('web3')
const fs = require('fs')

const deployed = require('../work/deployed.json')
const ARTIFACTS_DIR = '../build/contracts'

async function main() {
  const web3 = new Web3('http://localhost:7545')

  const accounts = await web3.eth.getAccounts()
  const subject = accounts[2]
  console.log('Subject Address:', subject, "\n")

  const userRegistryArtifact = require(ARTIFACTS_DIR + '/UserRegistry.json')
  const userRegistry = new web3.eth.Contract(
    userRegistryArtifact.abi,
    deployed.UserRegistry
  )

  const identityArtifact = require(ARTIFACTS_DIR + '/Identity.json')
  const identity = new web3.eth.Contract(identityArtifact.abi)
  const tx = identity.deploy({
    data: identityArtifact.bytecode,
    arguments: [deployed.UserRegistry]
  })

  console.log("Create Subject Identity ...\n")

  await tx.send({
    from: subject,
    gas: 3000000
  }).on('transactionHash', (transactionHash) => {
    console.log('Transaction Hash:', transactionHash)
  }).on('receipt', (receipt) => {
    console.log('Subject Identity Contract Address:', receipt.contractAddress)
    deployed.SubjectIdentity = receipt.contractAddress
    fs.writeFileSync('../work/deployed.json', JSON.stringify(deployed,null,2))
  }).catch((error) => {
    console.error(error)
  })
}

main()
