import Web3 from "web3";

const contract = require("truffle-contract");
const kiitos = require("./build/contracts/HeartBankToken.json");

let provider;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
    provider = window.web3.currentProvider
} else {
    provider = new Web3.providers.HttpProvider("http://localhost:9545");
    // provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/DPHGLx2mBJeWsuDv1jFV");
}

const Kiitos = contract(kiitos);
Kiitos.setProvider(provider);

export default new Web3(provider);
export { Kiitos };