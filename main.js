console.log("Hello World!");

var Web3 = require('web3');
var web3 = new Web3('http://localhost:7545');
// web3.setProvider(new web3.providers.HttpProvider('http://localhost:7545'));

// var balance = web3.eth.getBalance('0x0259298ca96f40883992a5bf049f43D23aD12925');
// balance.then(console.log);

//コントラクトのアドレス
// var address = "0xffdd68a51b8f5c1fffd7fcb1024dd504ea88c3d3";

//abi情報
var claimAbi = require('./build/contracts/ClaimHolder.json');
var userAbi = require('./build/contracts/UserRegistry.json');
// var abi = [{"constant":true,"inputs":[],"name":"Hello","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"}];

//コントラクトの取得
// Running migration: 4_deploy_contracts.js
//   Running step...
//   Replacing ClaimHolder...
//   ... 0xf665916941887f458c71ed97a0eb3546a42bdf35ae068cca88bf8d21cb3473d3
//   ClaimHolder: 0xfb84c80e19b24dff8ffbc41dfd2cc612117598e2
//   Replacing ClaimHolder...
//   ... 0xc4c36ed3cf4c6c75f171e4bdb5a1b550b79f6a7f0fa5ec8d78c0b4c48cde50ba
//   ClaimHolder: 0xdd9a7e4ec80ff85a8a7af494d7b05aa8259dec4a


var fractalIdClaimHolder = new web3.eth.Contract(claimAbi.abi, '0xc4cb56431d45d30ce322dbabb1f096bdfe5b1fe4');
var investorClaimHolder = new web3.eth.Contract(claimAbi.abi, '0xbd1ba4c39fe380a9e9e2cfb2822af0613b97f4b3');
var userRegistry = new web3.eth.Contract(userAbi.abi, '0x6c23d8ebd6b54070b45a27efcc61ce605f18ed07');

//実行
// var response = contract.Hello.call();

// console.log("response:",response);

// claim key
var fractalIdClaimsAccount = fractalIdClaimHolder.options.address;
var fractalIdAccount = '0x0259298ca96f40883992a5bf049f43D23aD12925';

// var fractalIdClaimsKey = web3.utils.keccak256(
//   fractalIdClaimsAccount
// );
// fractalIdClaimHolder.methods.addKey(
//   fractalIdClaimsKey,
//   3,//KEY_PURPOSES.CLAIM,
//   1,//KEY_TYPES.ECDSA,
// ).send({
//   from: fractalIdAccount,
//   gas: 4612388,
// });


// signing claim
// (async () => {
	var hexedData = web3.utils.asciiToHex("Investor is VBR V0 legit.");
	// var hashedDataToSign = web3.utils.soliditySha3(
	//   investorClaimHolder.options.address,
	//   7,//CLAIM_TYPES.KYC,
	//   hexedData,
	// );
	// var signature = web3.eth.sign(
	//   hashedDataToSign,
	//   fractalIdAccount,
	// ).then(console.log);
// })()

var investorAccount = '0x8ABFB075ed2770D3F41596Fe3AEE3C6A7b78323d'
var signature = web3.utils.asciiToHex("Investor is VBR V0 legit.");

// (async () => {
var claimIssuer = fractalIdClaimHolder.options.address;
var addClaimABI = investorClaimHolder.methods
  .addClaim(
    7,//CLAIM_TYPES.KYC,
    1,//KEY_TYPES.ECDSA,
    claimIssuer,
    signature,
    hexedData,
    "https://www.trustfractal.com/business/",
  ).encodeABI();
  // console.log(addClaimABI);
investorClaimHolder.methods.execute(
  investorClaimHolder.options.address,
  0,
  addClaimABI,
).send({
  gas: 4612388,
  from: fractalIdAccount,
});

userRegistry.methods
	.registerIssuer(
    fractalIdClaimHolder.options.address, 
    investorClaimHolder.options.address
  ).send({
    gas: 4612388,
    from: fractalIdAccount,
  });

	// claimid = web3.utils.keccak256(claimIssuer + 7)
// })()
