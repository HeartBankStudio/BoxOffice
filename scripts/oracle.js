const axios = require('axios');
const Oracle = artifacts.require("BoxOfficeOracle");

module.exports = callback => {
    Oracle.deployed().then(oracle => {
        const getPrice = oracle.GetPrice();
        getPrice.watch((err, res) => axios.get('https://api.coinbase.com/v2/exchange-rates?currency=ETH')
            .then(response => response.data.data.rates.USD)
            .then(price => oracle.setPrice(parseInt(price)))
            .then(tx => getPrice.stopWatching()));

        const priceUpdated =  oracle.PriceUpdated();
        priceUpdated.watch((err, res) => {
            console.log(res.args.price.toNumber());
            priceUpdated.stopWatching();
        });
        
        oracle.updatePrice();
    });
    
    callback(false);
};