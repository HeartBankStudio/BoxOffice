const SimpleStorage = artifacts.require("SimpleStorage");
const TutorialToken = artifacts.require("TutorialToken");
const ComplexStorage = artifacts.require("ComplexStorage");

const HeartBankToken = artifacts.require("HeartBankToken");
const BoxOfficeOracleStorage = artifacts.require("BoxOfficeOracleStorage");
const BoxOfficeOracleLibrary = artifacts.require("BoxOfficeOracleLibrary");
const BoxOfficeOracle = artifacts.require("BoxOfficeOracle");
const BoxOffice = artifacts.require("BoxOffice");
const BoxOfficeRegistry = artifacts.require("BoxOfficeRegistry");

module.exports = (deployer, network, accounts) => {
  deployer.deploy(SimpleStorage);
  deployer.deploy(TutorialToken);
  deployer.deploy(ComplexStorage);

  deployer.deploy(BoxOfficeOracleLibrary);
  deployer.deploy(BoxOfficeOracleStorage);    
  deployer.link(BoxOfficeOracleLibrary, BoxOfficeOracle);

  deployer.deploy(HeartBankToken)
    .then(() => deployer.deploy(BoxOfficeOracle, BoxOfficeOracleStorage.address))
    .then(() => deployer.deploy(BoxOffice, HeartBankToken.address, BoxOfficeOracle.address))
    .then(() => deployer.deploy(BoxOfficeRegistry, BoxOfficeOracle.address))
    .then(() => BoxOfficeOracleStorage.deployed().then(instance => instance.addAdmin(BoxOfficeOracle.address)));
};