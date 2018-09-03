const { HOST, NETWORK } = require("./config");
const { adminProvider } = require("./utils/web3");

module.exports = {
  migrations_directory: "./migrations",
  networks: {
    ganache: {
      host: HOST,
      port: NETWORK,
      network_id: "*"
      // gas: 8003877,
      // gasPrice: 2300000000
    },
    rinkeby: {
      provider: () => adminProvider,
      network_id: 4
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
