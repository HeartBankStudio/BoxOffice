import { clientProvider as provider } from "./web3";

const contract = require("truffle-contract");
const kiitos = require("../build/contracts/HeartBankToken.json");
const boxOffice = require("../build/contracts/BoxOffice.json");
const movie = require("../build/contracts/BoxOfficeMovie.json");
const registry = require("../build/contracts/BoxOfficeRegistry.json");
const oracle = require("../build/contracts/BoxOfficeOracle.json");

const fixTruffleContractCompatibilityIssue = contract => {
    if (typeof contract.currentProvider.sendAsync !== "function")
        contract.currentProvider.sendAsync = function() {
            return contract.currentProvider.send.apply(contract.currentProvider, arguments);
        };
    return contract;
};

let Kiitos = contract(kiitos);
let BoxOffice = contract(boxOffice);
let Movie = contract(movie);
let Registry = contract(registry);
let Oracle = contract(oracle);

Kiitos.setProvider(provider);
BoxOffice.setProvider(provider);
Movie.setProvider(provider);
Registry.setProvider(provider);
Oracle.setProvider(provider);

Kiitos = fixTruffleContractCompatibilityIssue(Kiitos);
BoxOffice = fixTruffleContractCompatibilityIssue(BoxOffice);
Movie = fixTruffleContractCompatibilityIssue(Movie);
Registry = fixTruffleContractCompatibilityIssue(Registry);
Oracle = fixTruffleContractCompatibilityIssue(Oracle);

const currentOracle = Registry.deployed()
    .then(registry => registry.currentOracle())
    .then(oracle => Oracle.at(oracle));

export default currentOracle;
export { Kiitos, BoxOffice, Movie };