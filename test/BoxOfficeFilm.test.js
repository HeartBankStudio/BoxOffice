const BoxOffice = artifacts.require("BoxOffice.sol");
const SALES_END_TIME = Date.now()/1000 + 28*60*60*24 | 0;

contract('BoxOffice Film', accounts => {

  const owner = accounts[0];
  let boxOffice, film;

  const salesEndTime = SALES_END_TIME;
  const price = web3.toWei(1, "finney");
  const ticketSupply = web3.toWei(1, "ether");
  const movieName = "Casablanca";
  const ticketSymbol = "CSBC";
  const logline = "An American expatriate meets a former lover, with unforeseen complications.";
  const poster = "ipfs hash";
  const trailer = "ipfs hash";

  before(async () => {
    boxOffice = await BoxOffice.deployed();
    await boxOffice.makeFilm(salesEndTime, price, ticketSupply, movieName, ticketSymbol, logline, poster, trailer);
    film = await boxOffice.films(0);
  });

  it("should purchase movie tickets with excess payment", async () => {
    boxOffice.TicketsBought((err, res) => {
      const {movie, buyer, quantity} = res.args;
      
      assert.equal(movie, film);
      assert.equal(buyer, owner);
      assert.equal(quantity, 2);
    });

    boxOffice.ExcessPayment((err, res) => {
      const {movie, buyer, excess} = res.args;
      
      assert.equal(movie, film);
      assert.equal(buyer, owner);
      assert.equal(excess, web3.toWei(1, "finney"));
    });

    await boxOffice.buyTickets(film, 2, {value: web3.toWei(3, "finney")});
  });

  it("should withdraw from fund", async () => {
    boxOffice.FundWithdrawn((err, res) => {
      const {movie, recipient, amount, expense} = res.args;
      
      assert.equal(movie, film);
      assert.equal(recipient, owner);
      assert.equal(amount, web3.toWei(1, "finney"));
      assert.equal(expense, "to pay screenwriter");
    });
    
    await boxOffice.withdrawFund(film, owner, web3.toWei(1, "finney"), "to pay screenwriter");
  });

});
