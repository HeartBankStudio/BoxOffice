const BoxOffice = artifacts.require("BoxOffice.sol");

contract('BoxOffice Film', accounts => {

  const SALES_END_TIME = Date.now()/1000 + 28*60*60*24 | 0;
  const owner = accounts[0];
  let boxOffice;

  before(async () => {
    const salesEndTime = SALES_END_TIME;
    const price = web3.toWei(1, "finney");
    const ticketSupply = web3.toWei(1, "ether");
    const movieName = "Casablanca";
    const ticketSymbol = "CSBC";
    const logline = "An American expatriate meets a former lover, with unforeseen complications.";
    const poster = "ipfs hash";
    const trailer = "ipfs hash";

    boxOffice = await BoxOffice.deployed();
    await boxOffice.makeFilm(salesEndTime, price, ticketSupply, movieName, ticketSymbol, logline, poster, trailer);
  });

  it("should update film and token", async () => {
    const salesEndTime_ = SALES_END_TIME;
    const price_ = web3.toWei(1, "finney");
    const movieName_ = "Casablanca";
    const ticketSymbol_ = "CSBC";
    const logline_ = "An American expatriate meets a former lover, with unforeseen complications.";
    const poster_ = "ipfs hash";
    const trailer_ = "ipfs hash";
   
    boxOffice.FilmUpdated((err, res) => {
      const {filmIndex, salesEndTime, price, movieName, ticketSymbol, logline, poster, trailer} = res.args;
      
      assert.equal(filmIndex, 0);
      assert.equal(salesEndTime, salesEndTime_);
      assert.equal(price, price_);
      assert.equal(movieName, movieName_);
      assert.equal(ticketSymbol, ticketSymbol_);
      assert.equal(logline, logline_);
      assert.equal(poster, poster_);
      assert.equal(trailer, trailer_);
    });

    await boxOffice.updateFilm(0, salesEndTime_, price_, movieName_, ticketSymbol_, logline_, poster_, trailer_);
  });

  it("should purchase movie tickets with excess payment", async () => {
    boxOffice.TicketsBought((err, res) => {
      const {filmIndex, buyer, quantity} = res.args;
      
      assert.equal(filmIndex, 0);
      assert.equal(buyer, owner);
      assert.equal(quantity, 2);
    });

    boxOffice.ExcessPayment((err, res) => {
      const {filmIndex, buyer, excess} = res.args;
      
      assert.equal(filmIndex, 0);
      assert.equal(buyer, owner);
      assert.equal(excess, web3.toWei(1, "finney"));
    });

    await boxOffice.buyTickets(0, 2, {value: web3.toWei(3, "finney")});
  });

  it("should spend movie ticket", async () => {
    boxOffice.TicketSpent((err, res) => {
      const {filmIndex, holder} = res.args;
      
      assert.equal(filmIndex, 0);
      assert.equal(holder, owner);
    });

    await boxOffice.spendTicket(0);
  });

  it("should withdraw from fund", async () => {
    boxOffice.FundWithdrawn((err, res) => {
      const {filmIndex, recipient, amount, expense} = res.args;
      
      assert.equal(filmIndex, 0);
      assert.equal(recipient, owner);
      assert.equal(amount, web3.toWei(1, "finney"));
      assert.equal(expense, "to pay screenwriter");
    });
    
    await boxOffice.withdrawFund(0, owner, web3.toWei(1, "finney"), "to pay screenwriter");
  });

  it("should get audience members", async () => {
    const members = await boxOffice.getAudienceMembers(0);
    assert.equal(members[0], owner);
  });

  it("should authenticate audience member", async () => {
    assert.ok(await boxOffice.isAudienceMember(0, owner));
  });

  it("should get withdrawal", async () => {
    const [recipient, amount, expense] = await boxOffice.getWithdrawal(0, 0);
    assert.equal(recipient, owner);
    assert.equal(amount, web3.toWei(1, "finney"));
    assert.equal(expense, "to pay screenwriter");
  });

  it("should get film summary", async () => {
    const [movie, filmmaker, salesEndTime, price, ticketSupply, movieName, ticketSymbol, logline, poster, trailer] = await boxOffice.getFilmSummary(0);
    assert.ok(movie);
    assert.equal(filmmaker, owner);
    assert.equal(salesEndTime, SALES_END_TIME);
    assert.equal(price, web3.toWei(1, "finney"));
    assert.equal(ticketSupply, web3.toWei(1, "ether"));
    assert.equal(movieName, "Casablanca");
    assert.equal(ticketSymbol, "CSBC");
    assert.equal(logline, "An American expatriate meets a former lover, with unforeseen complications.");
    assert.equal(poster, "ipfs hash");
    assert.equal(trailer, "ipfs hash");
  });

  it("should get film stats", async () => {
    const [price, totalAudienceMembers, totalWithdraws, ticketSupply, ticketsAvailable, ticketsSold, filmMarketValue, fundsCollected, fundsWithdrawn, fundBalance] = await boxOffice.getFilmStats(0);
    assert.equal(price, web3.toWei(1, "finney"));
    assert.equal(totalAudienceMembers, 1);
    assert.equal(totalWithdraws, 1);
    assert.equal(ticketSupply, web3.toWei(1, "ether"));
    assert.equal(ticketsAvailable, web3.toWei(1, "ether") - 1);
    assert.equal(ticketsSold, 1);
    assert.equal(filmMarketValue, web3.toWei(1, "finney") * web3.toWei(1, "ether"));
    assert.equal(fundsCollected, web3.toWei(2, "finney"));
    assert.equal(fundsWithdrawn, web3.toWei(1, "finney"));
    assert.equal(fundBalance, web3.toWei(1, "finney"));
  });

  it("should get box office stats", async () => {
    const [totalReceipts, totalFilms] = await boxOffice.getBoxOfficeStats();
    assert.equal(totalReceipts, web3.toWei(2, "finney"));
    assert.equal(totalFilms, 1);
  });

});
