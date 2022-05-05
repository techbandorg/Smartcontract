require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
const { ethers } = require("ethers");
require("@nomiclabs/hardhat-waffle");
const {getPKs, buildHardhatNetworkAccounts} = require("./utills/configInit");


const accounts = getPKs();
const hardhatNetworkAccounts = buildHardhatNetworkAccounts();

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
  hardhat: {
    accounts: hardhatNetworkAccounts
  },
  binance: {
    url: "https://bsc-dataseed.binance.org/",
    chaiId: 56,
    accounts,
    gasLimit: 2000000    
  },
  binanceTestnet: {
    url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    chaiId: 97,
    accounts,
    gasLimit: 2000000    
  },
},

  solidity: {
    compilers:[
      {
    version: "0.8.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
  ]
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  },
  etherscan: {
   apiKey: "P4SHTF8MGSU13BPYT3VTF4TWPUAWGFAIKB"
  }
};

