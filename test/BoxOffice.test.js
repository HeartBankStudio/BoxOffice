const BoxOffice = artifacts.require("BoxOffice.sol");
const Kiitos = artifacts.require("HeartBankCoin.sol");
const SALES_END_DATE = Date.now()/1000 + 28*60*60*24 | 0;

contract('BoxOffice', accounts => {

  const owner = accounts[0];
  let boxOffice;

  before(async () => {
    boxOffice = await BoxOffice.deployed();
  });

  it("should store initial states", async () => {
    const admin = await boxOffice.admin();
    const kiitos = await boxOffice.kiitos();
    const heartbank = await boxOffice.heartbank();
    const charity = await boxOffice.charity();
    const listingFee = await boxOffice.listingFee();
    const withdrawFee = await boxOffice.withdrawFee();

    assert.equal(admin, owner);
    assert.equal(kiitos, Kiitos.address);
    assert.equal(heartbank, 0);
    assert.equal(charity, 0);
    assert.equal(listingFee, 2);
    assert.equal(withdrawFee, 1);
  });

  it("should create film and movie tickets", async () => {
    const salesEndDate_ = SALES_END_DATE;
    const availableTickets_ = web3.toWei(1, "szabo");
    const price_ = web3.toWei(1, "finney");
    const ticketSupply_ = web3.toWei(1, "ether");
    const movieName_ = "Casablanca";
    const ticketSymbol_ = "CSBC";
    const logline_ = "An American expatriate meets a former lover, with unforeseen complications.";
    const poster_ = "ipfs hash";
    const trailer_ = "youtube id";
   
    boxOffice.FilmCreated((err, res) => {
      const {movie, salesEndDate, availableTickets, price, ticketSupply, movieName, ticketSymbol, logline, poster, trailer} = res.args;

      assert.ok(movie);
      // assert.equal(salesEndDate, salesEndDate_);
      assert.equal(availableTickets, availableTickets_);
      assert.equal(price, price_);
      assert.equal(ticketSupply, ticketSupply_);
      assert.equal(movieName, movieName_);
      assert.equal(ticketSymbol, ticketSymbol_);
      assert.equal(logline, logline_);
      assert.equal(poster, poster_);
      assert.equal(trailer, trailer_);
    });

    const gas = await boxOffice.makeFilm.estimateGas(salesEndDate_, availableTickets_, price_, ticketSupply_, movieName_, ticketSymbol_, logline_, poster_, trailer_);
    assert.isBelow(gas, 8003877);

    await boxOffice.makeFilm(salesEndDate_, availableTickets_, price_, ticketSupply_, movieName_, ticketSymbol_, logline_, poster_, trailer_);
  });

  it("should update fees", async () => {
    boxOffice.FeesUpdated((err, res) => {
      const {listingFee, withdrawFee} = res.args;
      
      assert.equal(listingFee, 3);
      assert.equal(withdrawFee, 2);
    });

    await boxOffice.updateFees(3, 2);
  });

  it("should return excess payment", async () => {
    await boxOffice.send(web3.toWei(1, "finney"));
    await boxOffice.returnExcessPayment(owner, web3.toWei(1, "finney"));
    assert.equal(await web3.eth.getBalance(boxOffice.address), 0);
  });

  it("should receive plain ether transfer and trigger fallback", async () => {
    boxOffice.FallbackTriggered((err, res) => {
      const {date, sender, value} = res.args;

      assert.isBelow(date.toNumber(), Date.now()/1000);
      assert.equal(sender, owner);
      assert.equal(value, web3.toWei(1, "finney"));
    });

    const balanceBefore = await web3.eth.getBalance(owner).toNumber();
    await boxOffice.send(web3.toWei(1, "finney"));
    const balanceAfter = await web3.eth.getBalance(owner).toNumber();
    const balance = await web3.eth.getBalance(boxOffice.address).toNumber();
    
    assert.isBelow(balanceAfter, balanceBefore - web3.toWei(1, "finney"));
    assert.equal(balance, web3.toWei(1, "finney"));
  });

  it("should get box office stats");

  it("should shut down box office and self-destruct", async () => {
    assert.ok(await boxOffice.toggleEmergency());
    assert.ok(await boxOffice.shutDownBoxOffice());
  });
});
