const HDWalletProvider = require("truffle-hdwallet-provider");
const env = require("./config/keys");

module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 9545,
      network_id: "*"
    },
    rinkeby: {
      provider: () => new HDWalletProvider(env.MNEMONIC, env.INFURA),
      network_id: 4
      // gas: 30000000
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  },
  mocha: {
    useColors: true
  } 
};
