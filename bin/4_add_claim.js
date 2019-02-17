const Web3 = require('web3')

const deployed = require('../work/deployed.json')
const ARTIFACTS_DIR = '../build/contracts'

async function main() {
  const web3 = new Web3('http://localhost:7545')

  const userRegistryArtifact = require(ARTIFACTS_DIR + '/UserRegistry.json')
  const userRegistry = new web3.eth.Contract(
    userRegistryArtifact.abi,
    deployed.UserRegistry
  )

  const accounts = await web3.eth.getAccounts()
  const issuers = accounts.slice(0, 5)
  for (let i=0; i<issuers.length; i++) {
    console.log(`Issuer Address ${i}: ${issuers[i]}`)
  }
  const subjects = accounts.slice(5,10)
  for (let i=0; i<subjects.length; i++) {
    console.log(`Subject Address ${i}: ${subjects[i]}`)
  }

  const identityArtifact = require(ARTIFACTS_DIR + '/Identity.json')

  console.log("\nAdd Claims ...\n")

  for (let i=0; i<issuers.length; i++) {
    console.log(`[${i}]`)
    const issuerIdentity = new web3.eth.Contract(
      identityArtifact.abi,
      deployed.IssuerIdentity[i]
    )
    console.log('Issuer Identity Contract Address:', issuerIdentity.options.address)

    const n = Math.floor(Math.random() * (5 - 1+1)) + 1
    const targets = subjects.slice(0, n)
    console.log(`Target Subjects [${n}]:`)
    for (let j=0; j<n; j++) {
      console.log(`  [${j}]`)
      const subjectIdentity = new web3.eth.Contract(
        identityArtifact.abi,
        deployed.SubjectIdentity[j]
      )
      console.log(`  Subject Address:`, targets[j])
      console.log('  Subject Identity Contract Address:', subjectIdentity.options.address)

      const claim = 'Subject is very nemui'
      const hexedData = web3.utils.asciiToHex(claim)

      const hashedDataToSign = web3.utils.soliditySha3(
        subjectIdentity.options.address,
        7,//CLAIM_TYPES.KYC,
        hexedData
      )
      signature = hashedDataToSign

      console.log("\n  Signature:", signature, "\n")

      const addClaimABI = subjectIdentity.methods.addClaim(
        7,//CLAIM_TYPES.KYC,
        1,//KEY_TYPES.ECDSA,
        issuerIdentity.options.address,
        signature,
        hexedData,
        "https://www.issuer.com/",
      ).encodeABI()
      //console.log('addClaimABI:', addClaimABI)

      console.log("  Add Claims ...\n")

      await subjectIdentity.methods.execute(
        subjectIdentity.options.address,
        0,
        addClaimABI,
      ).send({
        gas: 4612388,
        from: targets[j]
      }).on('transactionHash', (transactionHash) => {
        console.log('  Transaction Hash:', transactionHash)
      }).on('receipt', (receipt) => {
        console.log('  Receipt:', 'AddClaim')
      }).catch((error) => {
        console.error(error)
      })

      console.log("\n")

/*
      await userRegistry.methods.registerIssuer(
        issuerIdentity.options.address,
        subjectIdentity.options.address
      ).send({
        gas: 4612388,
        from: targets[j]
      }).on('transactionHash', (transactionHash) => {
        console.log('  Transaction Hash:', transactionHash)
      }).on('receipt', (receipt) => {
        console.log('  Receipt:', 'NewIssuer')
      }).catch((error) => {
        console.error(error)
      })
*/
    }
  }

  // Reputation
  const reputationArtifact = require(ARTIFACTS_DIR + '/Reputation.json')
  const reputation = new web3.eth.Contract(
    reputationArtifact.abi,
    deployed.Reputation
  )
  const balance = await reputation.methods.balanceOf(issuerIdentityAddress).call();

  console.log('Reputation:', balance, "\n")
}

main()
