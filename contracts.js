import Web3 from "web3";

const contract = require("truffle-contract");
const kiitos = require("./build/contracts/HeartBankToken.json");
const boxOffice = require("./build/contracts/BoxOffice.json");
const registry = require("./build/contracts/BoxOfficeRegistry.json");
const oracle = require("./build/contracts/BoxOfficeOracle.json");

const env = require("./config/env");
const provider = typeof window !== "undefined" && typeof window.web3 !== "undefined" ? window.web3.currentProvider : new Web3.providers.HttpProvider(env.ENDPOINT);

const fixTruffleContractCompatibilityIssue = contract => {
    if (typeof contract.currentProvider.sendAsync !== "function")
        contract.currentProvider.sendAsync = function() {
            return contract.currentProvider.send.apply(contract.currentProvider, arguments);
        };
    return contract;
};

let Kiitos = contract(kiitos);
let BoxOffice = contract(boxOffice);
let Registry = contract(registry);
let Oracle = contract(oracle);

Kiitos.setProvider(provider);
BoxOffice.setProvider(provider);
Registry.setProvider(provider);
Oracle.setProvider(provider);

Kiitos = fixTruffleContractCompatibilityIssue(Kiitos);
BoxOffice = fixTruffleContractCompatibilityIssue(BoxOffice);
Registry = fixTruffleContractCompatibilityIssue(Registry);
Oracle = fixTruffleContractCompatibilityIssue(Oracle);

const currentOracle = Registry.deployed()
    .then(registry => registry.currentOracle())
    .then(oracle => Oracle.at(oracle));

export default new Web3(provider);
export { Kiitos, BoxOffice, currentOracle };