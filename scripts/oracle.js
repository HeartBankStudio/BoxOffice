const axios = require('axios');
const Oracle = artifacts.require("Oracle");

module.exports = callback => {
    Oracle.deployed().then(oracle => {
        const priceUpdated = oracle.PriceUpdated();
        priceUpdated.watch((err, res) => {
            console.log(res.args.price.toNumber());
            priceUpdated.stopWatching();
        });

        const getPrice = oracle.GetPrice();
        getPrice.watch((err, res) => axios.get('https://api.coinbase.com/v2/exchange-rates?currency=ETH')
        .then(response => response.data.data.rates.USD)
        .then(price => oracle.setPrice(parseInt(price)))
        .then(tx => console.log(tx))
        .then(() => getPrice.stopWatching()));

        oracle.updatePrice();
    });
    // callback();
};