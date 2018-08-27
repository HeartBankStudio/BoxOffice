const BoxOffice = artifacts.require("BoxOffice.sol");
const SALES_END_DATE = Date.now()/1000 + 28*60*60*24 | 0;

contract('BoxOffice Film', accounts => {

  const owner = accounts[0];
  let boxOffice, film;

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
    boxOffice = await BoxOffice.deployed();
    await boxOffice.makeFilm(salesEndDate, availableTickets, price, ticketSupply, movieName, ticketSymbol, logline, poster, trailer);
    film = await boxOffice.films(0);
  });

  it("should purchase movie tickets with excess payment", async () => {
    boxOffice.TicketsBought((err, res) => {
      const {movie, buyer, price, quantity} = res.args;
      
      assert.equal(movie, film);
      assert.equal(buyer, owner);
      assert.equal(price, web3.toWei(1, "finney"));
      assert.equal(quantity, 2);
    });

    boxOffice.ExcessPaid((err, res) => {
      const {date, movie, buyer, excess} = res.args;
      
      assert.isBelow(date.toNumber(), Date.now()/1000);
      assert.equal(movie, film);
      assert.equal(buyer, owner);
      assert.equal(excess, web3.toWei(1, "finney"));
    });

    await boxOffice.buyTickets(film, 2, {value: web3.toWei(3, "finney")});
  });

  it("should withdraw from fund", async () => {
    boxOffice.FundWithdrawn((err, res) => {
      const {date, movie, recipient, amount, expense} = res.args;
      
      assert.isBelow(date.toNumber(), Date.now()/1000);
      assert.equal(movie, film);
      assert.equal(recipient, accounts[1]);
      assert.equal(amount, web3.toWei(1, "finney"));
      assert.equal(expense, "to pay screenwriter");
    });
    
    await boxOffice.withdrawFund(film, accounts[1], web3.toWei(1, "finney"), "to pay screenwriter");
  });

  it("should donate to charity", async () => {
    boxOffice.CharityDonated((err, res) => {
      const {date, recipient, amount} = res.args;
      
      assert.isBelow(date.toNumber(), Date.now()/1000);
      assert.equal(recipient, accounts[2]);
      assert.equal(amount, 1);
    });
    
    await boxOffice.donateToCharity(accounts[2], 1);
  });

});
