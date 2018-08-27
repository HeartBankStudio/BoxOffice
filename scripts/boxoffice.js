const BoxOffice = artifacts.require("BoxOffice");
// const owner = web3.eth.accounts[0];

const movies = [
    {
        salesEndDate: Date.now()/1000 + 7*60*60*24 | 0,
        availableTickets: 1000,
        price: web3.toWei(1, "szabo"),
        ticketSupply: web3.toWei(1, "finney"),
        movieName: "Casablanca",
        ticketSymbol: "CSBC",
        logline: "An American expatriate meets a former lover, with unforeseen complications.",
        poster: "QmWrdc5yX2iJLVrU992b5DKhHPtye5cgskQQcRiFB8ojsL",
        trailer: "S9ID5DHsX8g"
    
    },
    {
        salesEndDate: Date.now()/1000 + 14*60*60*24 | 0,
        availableTickets: 500,
        price: web3.toWei(2, "szabo"),
        ticketSupply: web3.toWei(2, "finney"),
        movieName: "Titanic",
        ticketSymbol: "TTN",
        logline: "A journey of forbidden love between a poor boy and a rich girl on the final voyage of the RMS Titanic.",
        poster: "QmaJCd8PLjxrjVC4isskXGDNS6JsX2s397FHFeh55bzVTu",
        trailer: "2e-eXJ6HgkQ"
    },
    {
        salesEndDate: Date.now()/1000 + 3*60*60*24 | 0,
        availableTickets: 200,
        price: web3.toWei(3, "szabo"),
        ticketSupply: web3.toWei(3, "finney"),
        movieName: "Avatar",
        ticketSymbol: "AVT",
        logline: "A handicapped mercenary soldier inhabits an alien body to learn their culture and abandons his human body to save the aliens from his fellow mercenaries.",
        poster: "QmZqMXXf9bz89XWSQ9W8QABrpbRoVsdTneZD7NcWtCahgN",
        trailer: "5PSNL1qE6VY"
    }, 
    {
        salesEndDate: Date.now()/1000 + 28*60*60*24 | 0,
        availableTickets: 800,
        price: web3.toWei(4, "szabo"),
        ticketSupply: web3.toWei(4, "finney"),
        movieName: "Finding Nemo",
        ticketSymbol: "FN",
        logline: "After his son is captured in the Great Barrier Reef and taken to Sydney, a timid clownfish sets out on a journey to bring him home.",
        poster: "QmQdJHiwLF4yyGF2fsoHQtT4GBSvEovQ8uQHd5n5gRVMQM",
        trailer: "2zLkasScy7A"
    }
];

module.exports = callback => {
    movies.map(movie => BoxOffice.deployed().then(boxOffice => boxOffice.makeFilm(movie.salesEndDate, movie.availableTickets, movie.price, movie.ticketSupply, movie.movieName, movie.ticketSymbol, movie.logline, movie.poster, movie.trailer))
    .then(tx => console.log(tx)));
    // callback();
};