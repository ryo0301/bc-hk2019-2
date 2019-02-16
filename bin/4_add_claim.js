const Web3 = require('web3')

const deployed = require('../work/deployed.json')
const ARTIFACTS_DIR = '../build/contracts'

async function main() {
  const web3 = new Web3('http://localhost:7545')

  const accounts = await web3.eth.getAccounts()
  const issuerClaimsSigner = accounts[1]
  const subject = accounts[2]
  console.log('Issuer Claims Signer Address:', issuerClaimsSigner)
  console.log('Subject Address:', subject)

  const identityArtifact = require(ARTIFACTS_DIR + '/Identity.json')

  const issuerIdentity = new web3.eth.Contract(
    identityArtifact.abi,
    deployed.IssuerIdentity
  )
  const issuerIdentityAddress = issuerIdentity.options.address
  console.log('Issuer Identity Contract Address:', issuerIdentityAddress)

  const subjectIdentity = new web3.eth.Contract(
    identityArtifact.abi,
    deployed.SubjectIdentity
  )
  const subjectIdentityAddress = subjectIdentity.options.address
  console.log('Subject Identity Contract Address:', subjectIdentityAddress, "\n")

  const claim = 'Subject is very nemui'
  const hexedData = web3.utils.asciiToHex(claim)

  const hashedDataToSign = web3.utils.soliditySha3(
    subjectIdentityAddress,
    7,//CLAIM_TYPES.KYC,
    hexedData
  )

  console.log("Sign Hashed Claim ...\n")

/*
  let signature
  signature = await web3.eth.sign(
    hashedDataToSign,
    issuerClaimsSigner
  ).catch((error) => {
    signature = hashedDataToSign
  })
*/
  signature = hashedDataToSign
  console.log('Signature:', signature, "\n")

  const addClaimABI = subjectIdentity.methods.addClaim(
    7,//CLAIM_TYPES.KYC,
    1,//KEY_TYPES.ECDSA,
    issuerIdentityAddress,
    signature,
    hexedData,
    "https://www.issuer.com/",
  ).encodeABI()
  //console.log('addClaimABI:', addClaimABI)

  console.log("Add Claim ...\n")

  await subjectIdentity.methods.execute(
    subjectIdentityAddress,
    0,
    addClaimABI,
  ).send({
    gas: 4612388,
    from: subject
  }).on('transactionHash', (transactionHash) => {
    console.log('Transaction Hash:', transactionHash)
  }).on('receipt', (receipt) => {
    console.log('Receipt:', receipt)
  }).catch((error) => {
    console.error(error)
  })

  const userRegistryArtifact = require(ARTIFACTS_DIR + '/UserRegistry.json')
  const userRegistry = new web3.eth.Contract(
    userRegistryArtifact.abi,
    deployed.UserRegistry
  )

  console.log("\n")

  await userRegistry.methods.registerIssuer(
    issuerIdentityAddress,
    subjectIdentityAddress
  ).send({
    gas: 4612388,
    from: subject
  }).on('transactionHash', (transactionHash) => {
    console.log('Transaction Hash:', transactionHash)
  }).on('receipt', (receipt) => {
    console.log('Receipt:', receipt)
  }).catch((error) => {
    console.error(error)
  })
}

main()
