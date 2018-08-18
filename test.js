const BoxOffice = artifacts.require("BoxOffice");

const salesEndTime = Date.now()/1000 + 28*60*60*24 | 0;;
const price = web3.toWei(1, "finney");
const ticketSupply = web3.toWei(1, "ether");
const movieName = "Casablanca";
const ticketSymbol = "CSBC";
const logline = "An American expatriate meets a former lover, with unforeseen complications.";
const poster = "https://en.wikipedia.org/wiki/Casablanca_(film)#/media/File:CasablancaPoster-Gold.jpg";
const trailer = "https://www.imdb.com/title/tt0034583";

module.exports = callback => {
    //console.log(web3.eth.accounts[0]);

    BoxOffice.deployed().then(instance => instance.makeFilm(salesEndTime, price, ticketSupply, movieName, ticketSymbol, logline, poster, trailer))
    .then(result => console.log(result));

    //BoxOffice.deployed().then(instance => instance.films(0))
    //.then(result => console.log(result));

    callback(false);
};