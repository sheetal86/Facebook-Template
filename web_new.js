solc = require("solc");
// file system - read and write files to your computer
fs = require("fs");
// ganache - local blockchain
// web3 interface
let {Web3} = require("web3");
// setup a http provider
//let web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));


const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
const web3 = new Web3(provider);
// reading the file contents of the smart  contract
fileContent = fs.readFileSync("getter.sol").toString();
console.log(fileContent); //all the getter .sol code


//create an input structure for my solidity complier
var input = {
  language: "Solidity",
  sources: {
    "getter.sol": {
      content: fileContent,
    },
  },


  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};


var output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log("Output: ", output);
ABI = output.contracts["getter.sol"]["getter"].abi;
bytecode = output.contracts["getter.sol"]["getter"].evm.bytecode.object;
console.log("Bytecode: ", bytecode);
console.log("ABI: ", ABI);




//instance of our contract as contract creation
contract = new web3.eth.Contract(ABI);
let defaultAccount;
web3.eth.getAccounts().then((accounts) => {
  console.log("Accounts:", accounts); //it will show all the ganache accounts


  defaultAccount = accounts[1];//picking one account for deployment
  console.log("Default Account:", defaultAccount);  //to deploy the contract from default Account
  contract_balance = web3.eth.getBalance(defaultAccount).then(console.log);
  console.log("the balance of the account:",contract_balance);
  contract
  .deploy({ data: bytecode })
  .send({ from: defaultAccount, gasLimit: 210000 })
  .on("receipt", (receipt) => { //event,transactions,contract address will be returned by blockchain
    console.log("Contract Address:", receipt.contractAddress);
  })
//   .then((demoContract) => {
//     demoContract.methods.x().call((err, data) => {
//       console.log("Initial Value:", data);
//     });
    .then((demoContract) => {
        demoContract.methods.x().call((err, data) => {
          console.log("Initial Value:", data);
        });
      })
  .catch((error) => {
    console.error("Error:", error);
  });
  });
