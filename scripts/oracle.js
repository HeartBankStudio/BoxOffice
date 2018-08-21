const axios = require('axios');
const Oracle = artifacts.require("BoxOfficeOracle");

module.exports = callback => {
    Oracle.deployed().then(oracle => {
        oracle.PriceUpdated((err, res) => {
            console.log(res.args.price.toNumber());
        });

        oracle.GetPrice((err, res) => axios.get('https://api.coinbase.com/v2/exchange-rates?currency=ETH')
        .then(response => response.data.data.rates.USD)
        .then(price => oracle.setPrice(parseInt(price)))
        .then(tx => console.log(tx)));

        oracle.updatePrice();
    });
    // callback();
};