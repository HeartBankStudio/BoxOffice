const Web3 = require("web3");
const HDWalletProvider = require("truffle-hdwallet-provider");
const { HOST, PORT, MNEMONIC, INFURA } = require("../config");

let clientProvider;
const adminProvider = new HDWalletProvider(MNEMONIC, INFURA);
const endpoint = process.env.NODE_ENV === "production" ? INFURA : `http://${HOST}:${PORT}`;

if (typeof window !== "undefined") { // browser
    if (typeof window.web3 !== "undefined") { // has metamask
        clientProvider = window.web3.currentProvider; // TODO: check for correct network, but need async
    } else { // no metamask
        clientProvider = new Web3.providers.HttpProvider(endpoint);
    }
} else { // server
    clientProvider = new Web3.providers.HttpProvider(endpoint);
}

module.exports = {
    clientProvider,
    adminProvider,
    clientWeb3: new Web3(clientProvider),
    adminWeb3: new Web3(adminProvider),
};

