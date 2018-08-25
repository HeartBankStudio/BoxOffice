const HeartBankCoin = artifacts.require("HeartBankCoin");
const OracleStorage = artifacts.require("OracleStorage");
const OracleLibrary = artifacts.require("OracleLibrary");
const Oracle = artifacts.require("Oracle");
const OracleRegistry = artifacts.require("OracleRegistry");
const BoxOffice = artifacts.require("BoxOffice");

module.exports = (deployer, network, accounts) => {
  deployer.deploy(OracleLibrary);
  deployer.link(OracleLibrary, Oracle);

  deployer.deploy(HeartBankCoin)
    .then(() => deployer.deploy(OracleStorage))
    .then(() => deployer.deploy(Oracle, OracleStorage.address))
    .then(() => deployer.deploy(OracleRegistry, Oracle.address))
    .then(() => deployer.deploy(BoxOffice, HeartBankCoin.address))
    .then(() => HeartBankCoin.deployed().then(instance => instance.addAdmin(BoxOffice.address)))
    .then(() => OracleStorage.deployed().then(instance => instance.addAdmin(Oracle.address)));
};