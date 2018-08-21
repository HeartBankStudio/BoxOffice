const BoxOffice = artifacts.require("BoxOffice.sol");
const Movie = artifacts.require("BoxOfficeMovie.sol");
const SALES_END_TIME = Date.now()/1000 + 28*60*60*24 | 0;

contract('BoxOffice Movie', accounts => {

  const owner = accounts[0];
  let movie;

  const salesEndTime = SALES_END_TIME;
  const price = web3.toWei(1, "finney");
  const ticketSupply = web3.toWei(1, "ether");
  const movieName = "Casablanca";
  const ticketSymbol = "CSBC";
  const logline = "An American expatriate meets a former lover, with unforeseen complications.";
  const poster = "ipfs hash";
  const trailer = "ipfs hash";

  before(async () => {
    const boxOffice = await BoxOffice.deployed();
    await boxOffice.makeFilm(salesEndTime, price, ticketSupply, movieName, ticketSymbol, logline, poster, trailer);
    const film = await boxOffice.films(0);
    movie = await Movie.at(film);
  });

  it("should get movie details", async () => {
    assert.equal(await movie.name(), movieName);
    assert.equal(await movie.symbol(), ticketSymbol);
    assert.equal(await movie.totalSupply(), ticketSupply);
    
    assert.equal(await movie.boxOffice(), BoxOffice.address);
    assert.equal(await movie.filmmaker(), owner);

    assert.equal(await movie.salesEndTime(), salesEndTime);
    assert.equal(await movie.price(), price);
    assert.equal(await movie.logline(), logline);
    assert.equal(await movie.poster(), poster);
    assert.equal(await movie.trailer(), trailer);
  });

  it("should update film", async () => {   
    movie.FilmUpdated((err, res) => {
      const {salesEndTime, price, movieName, ticketSymbol, logline, poster, trailer} = res.args;
      
      assert.equal(salesEndTime, SALES_END_TIME);
      assert.equal(price, web3.toWei(1, "finney"));
      assert.equal(movieName, "Casablanca");
      assert.equal(ticketSymbol, "CSBC");
      assert.equal(logline, "An American expatriate meets a former lover, with unforeseen complications.");
      assert.equal(poster, "ipfs hash");
      assert.equal(trailer, "ipfs hash");
    });

    await movie.updateFilm(salesEndTime, price, movieName, ticketSymbol, logline, poster, trailer);
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
    const member = await movie.members(0);
    assert.equal(members[0], owner);
    assert.equal(member, owner);
  });

  it("should authenticate audience member", async () => {
    assert.ok(await movie.isAudienceMember(owner));
  });

});
