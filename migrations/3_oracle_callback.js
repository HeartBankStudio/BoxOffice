const axios = require('axios');
const BoxOfficeOracle = artifacts.require("BoxOfficeOracle");

module.exports = (deployer, network, accounts) => 
  axios.get('https://api.coinbase.com/v2/exchange-rates?currency=ETH')
    .then(response => response.data.data.rates.USD)
    .then(price => BoxOfficeOracle.deployed().then(instance => instance.setPrice(parseInt(price))));
    // .then(() => BoxOfficeOracle.deployed().then(instance => instance.usdPriceOfEth()))
    // .then(price => console.log(price > 1));