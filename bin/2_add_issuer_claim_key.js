const Web3 = require('web3')
const fs = require('fs')

const deployed = require('../work/deployed.json')
const ARTIFACTS_DIR = '../build/contracts'

async function main() {
  const web3 = new Web3('http://localhost:7545')

  const accounts = await web3.eth.getAccounts()
  const issuer = accounts[0]
  const issuerClaimsSigner = accounts[1]
  console.log('Issuer Address:', issuer)
  console.log('Issuer Claims Signer Address:', issuerClaimsSigner, "\n")

  const issuerClaimsKey = web3.utils.keccak256(issuerClaimsSigner)
  console.log('Issuer Claims Signer Key:', issuerClaimsKey, "\n")

  const identityArtifact = require(ARTIFACTS_DIR + '/Identity.json')
  const issuerIdentity = new web3.eth.Contract(
    identityArtifact.abi,
    deployed.IssuerIdentity
  )

  console.log("Add Issuer Claims Signer Key ...\n")

  await issuerIdentity.methods.addKey(
    issuerClaimsKey,
    3,//KEY_PURPOSES.CLAIM,
    1,//KEY_TYPES.ECDSA,
  ).send({
    from: issuer,
    gas: 4612388,
  }).on('transactionHash', (transactionHash) => {
    console.log('Transaction Hash:', transactionHash)
  }).catch((error) => {
    console.error(error)
  })
}

main()
