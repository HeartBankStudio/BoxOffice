const BoxOffice = artifacts.require("BoxOffice.sol");

contract('BoxOffice', accounts => {

  const owner = accounts[0];
  let boxOffice;

  beforeEach(async () => {
    boxOffice = await BoxOffice.deployed();
  });

  it("should store initial states", async () => {
    const HEARTBANK = await boxOffice.HEARTBANK.call();
    const admin = await boxOffice.admin.call();
    const listingFee = await boxOffice.listingFee.call();
    const withdrawFee = await boxOffice.withdrawFee.call();

    assert.equal(HEARTBANK, 0x0);
    assert.equal(admin, accounts[0]);
    assert.equal(listingFee, 2);
    assert.equal(withdrawFee, 1);
  });

  it("should create film and movie tickets", async () => {
    const salesEndTime_ = Date.now() + 28*60*60*24;
    const price_ = web3.toWei(1, "finney");
    const ticketSupply_ = web3.toWei(1, "ether");
    const movieName_ = "Casablanca";
    const ticketSymbol_ = "CSBC";
    const logline_ = "An American expatriate meets a former lover, with unforeseen complications.";
    const poster_ = "ipfs hash";
    const trailer_ = "ipfs hash";

    // let filmIndex, salesEndTime, price, ticketSupply, movieName, ticketSymbol, logline, poster, trailer;
   
    boxOffice.FilmCreated().watch((err, res) => {
      ({filmIndex, salesEndTime, price, ticketSupply, movieName, ticketSymbol, logline, poster, trailer} = res.args);
    });

    await boxOffice.makeFilm(salesEndTime_, price_, ticketSupply_, movieName_, ticketSymbol_, logline_, poster_, trailer_, {from: owner});
    
    assert.equal(filmIndex, 0);
    assert.equal(salesEndTime, salesEndTime_);
    assert.equal(price, price_);
    assert.equal(ticketSupply, ticketSupply_);
    assert.equal(movieName, movieName_);
    assert.equal(ticketSymbol, ticketSymbol_);
    assert.equal(logline, logline_);
    assert.equal(poster, poster_);
    assert.equal(trailer, trailer_);
  });

  

});
