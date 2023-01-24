require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.6",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },

    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API}`,
      accounts: [process.env.MAIN_ACCOUNT],
      chainIds: 80001, // mumbai testnet
    },

    // mainnet: {
    //   url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API}`,
    //   accounts: [process.env.MAIN_ACCOUNT],
    //   chainIds: 1, // Ethereum mainnet
    // },

    // goerli: {
    //   url: `https://goerli.infura.io/v3/${process.env.INFURA_API}`,
    //   accounts: [process.env.MAIN_ACCOUNT],
    //   chainId: 5,
    // },
  },
  // gasReporter:{
  //   enabled:true,
  //   currency:"INR",
  //   coinmarketcap:process.env.COINMARKETCAP,
  //   token:"matic",
  //   outputFile:"gasReports.txt",
  //   noColors:true
  // }
};
