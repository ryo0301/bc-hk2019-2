console.log("Hello World!");

var Web3 = require('web3');
var web3 = new Web3('http://localhost:7545');
// web3.setProvider(new web3.providers.HttpProvider('http://localhost:7545'));

// var balance = web3.eth.getBalance('0x0259298ca96f40883992a5bf049f43D23aD12925');
// balance.then(console.log);

//コントラクトのアドレス
var address = "0xffdd68a51b8f5c1fffd7fcb1024dd504ea88c3d3";

//abi情報
var abi = require('./build/contracts/ClaimHolder.json');
// var abi = [{"constant":true,"inputs":[],"name":"Hello","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"}];

//コントラクトの取得
var fractalIdClaimHolder = new web3.eth.Contract(abi.abi, address);
// var investorClaimHolder = new web3.eth.Contract(abi.abi, address);

//実行
// var response = contract.Hello.call();

// console.log("response:",response);

// claim key
var fractalIdClaimsAccount = fractalIdClaimHolder.options.address;
var fractalIdAccount = '0x0259298ca96f40883992a5bf049f43D23aD12925';

var fractalIdClaimsKey = web3.utils.keccak256(
  fractalIdClaimsAccount
);
fractalIdClaimHolder.methods.addKey(
  fractalIdClaimsKey,
  3,//KEY_PURPOSES.CLAIM,
  1,//KEY_TYPES.ECDSA,
).send({
  from: fractalIdAccount,
  gas: 4612388,
});


// signing claim
var hexedData = web3.utils.asciiToHex("Investor is VBR V0 legit.");
var hashedDataToSign = web3.utils.soliditySha3(
  investorClaimHolder.options.address,
  7,//CLAIM_TYPES.KYC,
  hexedData,
);
var signature = await web3.eth.sign(
  hashedDataToSign,
  fractalIdClaimsAccount,
);


// var claimIssuer = fractalIdClaimHolder.options.address;
// var addClaimABI = await investorClaimHolder.methods
//   .addClaim(
//     CLAIM_TYPES.KYC,
//     CLAIM_SCHEMES.ECDSA,
//     claimIssuer,
//     signature,
//     hexedData,
//     "https://www.trustfractal.com/business/",
//   ).encodeABI();
// investorClaimHolder.methods.execute(
//   investorClaimHolder.options.address,
//   0,
//   addClaimABI,
// ).send({
//   gas: 4612388,
//   from: investorAccount,
// });
