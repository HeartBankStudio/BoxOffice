const Web3 = require("web3");
const HDWalletProvider = require("truffle-hdwallet-provider");
const { HOST, CHAIN, MNEMONIC, INFURA } = require("../config");

let clientProvider;
const adminProvider = new HDWalletProvider(MNEMONIC, INFURA);
const endpoint = process.env.NODE_ENV === "production" ? INFURA : `http://${HOST}:${CHAIN}`;

if (typeof window !== "undefined") {
    if (typeof window.web3 !== "undefined") {
        clientProvider = window.web3.currentProvider;
    } else {
        clientProvider = null;
    }
} else {
    clientProvider = new Web3.providers.HttpProvider(endpoint);
}

module.exports = {
    clientProvider: clientProvider || Web3.currentProvider,
    adminProvider,
    clientWeb3: clientProvider === null ? Web3 : new Web3(clientProvider),
    adminWeb3: new Web3(adminProvider),
};

