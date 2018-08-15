const BoxOffice = artifacts.require("BoxOffice.sol");

contract('BoxOffice', accounts => {

  const SALES_END_TIME = Date.now()/1000 + 28*60*60*24 | 0;
  const owner = accounts[0];
  let boxOffice;

  before(async () => {
    boxOffice = await BoxOffice.deployed();
  });

  it("should store initial states", async () => {
    const HEARTBANK = await boxOffice.HEARTBANK();
    const admin = await boxOffice.admin();
    const listingFee = await boxOffice.listingFee();
    const withdrawFee = await boxOffice.withdrawFee();

    assert.equal(HEARTBANK, 0x0);
    assert.equal(admin, accounts[0]);
    assert.equal(listingFee, 2);
    assert.equal(withdrawFee, 1);
  });

  it("should create film and movie tickets", async () => {
    const salesEndTime_ = SALES_END_TIME;
    const price_ = web3.toWei(1, "finney");
    const ticketSupply_ = web3.toWei(1, "ether");
    const movieName_ = "Casablanca";
    const ticketSymbol_ = "CSBC";
    const logline_ = "An American expatriate meets a former lover, with unforeseen complications.";
    const poster_ = "ipfs hash";
    const trailer_ = "ipfs hash";
   
    boxOffice.FilmCreated((err, res) => {
      const {filmIndex, salesEndTime, price, ticketSupply, movieName, ticketSymbol, logline, poster, trailer} = res.args;

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

    await boxOffice.makeFilm(salesEndTime_, price_, ticketSupply_, movieName_, ticketSymbol_, logline_, poster_, trailer_);
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

  it("should receive plain ether transfer and trigger callback", async () => {
    boxOffice.FallbackTriggered((err, res) => {
      const {sender, value} = res.args;

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

  it("should shut down box office and self-destruct", async () => {
    assert.ok(await boxOffice.toggleEmergency());
    assert.ok(await boxOffice.shutDownBoxOffice());
  });
});
