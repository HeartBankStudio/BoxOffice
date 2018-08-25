const axios = require('axios');
const Oracle = artifacts.require("Oracle");

module.exports = async () => {
    const oracle = await Oracle.deployed();

    const getPrice = oracle.GetPrice();
    getPrice.watch(async (err, res) => {
        const price = await axios.get('https://api.coinbase.com/v2/exchange-rates?currency=ETH')
            .then(response => response.data.data.rates.USD);
        await oracle.setPrice(parseInt(price));
        getPrice.stopWatching();
    });

    const priceUpdated = oracle.PriceUpdated();
    priceUpdated.watch((err, res) => {
        console.log(res.args.price.toNumber());
        priceUpdated.stopWatching();
    });

    await oracle.updatePrice();
};