const BoxOffice = artifacts.require("BoxOffice.sol");
const Movie = artifacts.require("BoxOfficeMovie.sol");
const SALES_END_DATE = Date.now()/1000 + 28*60*60*24 | 0;

contract('BoxOffice Movie', accounts => {

  const owner = accounts[0];
  let movie;

  const salesEndDate = SALES_END_DATE;
  const availableTickets = web3.toWei(1, "szabo");
  const price = web3.toWei(1, "finney");
  const ticketSupply = web3.toWei(1, "ether");
  const movieName = "Casablanca";
  const ticketSymbol = "CSBC";
  const logline = "An American expatriate meets a former lover, with unforeseen complications.";
  const poster = "ipfs hash";
  const trailer = "youtube id";

  before(async () => {
    const boxOffice = await BoxOffice.deployed();
    await boxOffice.makeFilm(salesEndDate, availableTickets, price, ticketSupply, movieName, ticketSymbol, logline, poster, trailer);
    const film = await boxOffice.films(0);
    movie = await Movie.at(film);
  });

  it("should get movie details", async () => {
    assert.equal(await movie.name(), movieName);
    assert.equal(await movie.symbol(), ticketSymbol);
    assert.equal(await movie.totalSupply(), ticketSupply);
    
    assert.equal(await movie.boxOffice(), BoxOffice.address);
    assert.equal(await movie.filmmaker(), owner);

    // assert.equal(await movie.salesEndDate(), salesEndDate);
    assert.equal(await movie.availableTickets(), availableTickets);
    assert.equal(await movie.price(), price);
    assert.equal(await movie.logline(), logline);
    assert.equal(await movie.poster(), poster);
    assert.equal(await movie.trailer(), trailer);
  });

  it("should get film summary", async () => {
    const [filmmaker, createdTime, salesEndDate, availableTickets, price, movieName, ticketSymbol, logline, poster, trailer] = await movie.getFilmSummary();
    
    assert.equal(filmmaker, owner);
    assert.isBelow(createdTime.toNumber(), Date.now()/1000);
    // assert.equal(salesEndDate, SALES_END_DATE);
    assert.equal(availableTickets, web3.toWei(1, "szabo"));
    assert.equal(price, web3.toWei(1, "finney"));
    assert.equal(movieName, "Casablanca");
    assert.equal(ticketSymbol, "CSBC");
    assert.equal(logline, "An American expatriate meets a former lover, with unforeseen complications.");
    assert.equal(poster, "ipfs hash");
    assert.equal(trailer, "youtube id");
  });

  it("should update film", async () => {   
    movie.FilmUpdated((err, res) => {
      const {salesEndDate, availableTickets, price, movieName, ticketSymbol, logline, poster, trailer} = res.args;
      
      // assert.equal(salesEndDate, SALES_END_DATE);
      assert.equal(availableTickets, web3.toWei(1, "szabo"));
      assert.equal(price, web3.toWei(1, "finney"));
      assert.equal(movieName, "Casablanca");
      assert.equal(ticketSymbol, "CSBC");
      assert.equal(logline, "An American expatriate meets a former lover, with unforeseen complications.");
      assert.equal(poster, "ipfs hash");
      assert.equal(trailer, "youtube id");
    });

    await movie.updateFilm(salesEndDate, availableTickets, price, movieName, ticketSymbol, logline, poster, trailer);
  });

  it("should spend movie ticket", async () => {
    movie.TicketSpent((err, res) => {
      const {holder} = res.args;
      
      assert.equal(holder, owner);
    });

    await movie.spendTicket();
  });

  it("should get audience members", async () => {
    const members = await movie.getAudienceMembers();
    const member = await movie.audienceMembers(0);
    assert.equal(members[0], owner);
    assert.equal(member, owner);
  });

  it("should get film stats", async () => {
    const [sales, fund, ticketsSold, availableSupply, ticketSupply] = await movie.getFilmStats();
    
    assert.equal(sales, 0);
    assert.equal(fund, 0);
    assert.equal(ticketsSold, 1);
    assert.equal(availableSupply, web3.toWei(1, "ether") - 1);
    assert.equal(ticketSupply, web3.toWei(1, "ether"));
  });

});
