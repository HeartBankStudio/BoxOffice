import React, { Component } from "react";
import { Form, Input, Button } from "semantic-ui-react";
import Layout from "../../components/Layout";
import { clientWeb3 as web3 } from "../../scripts/web3";
import currentOracle, { Kiitos, BoxOffice, Movie } from "../../scripts/contracts";

class MakeFilm extends Component {
    state = {
        salesEndTime: Date.now()/1000 + 28*60*60*24 | 0,
        price: web3.utils.toWei("1", "finney"),
        ticketSupply: web3.utils.toWei("1", "ether"),
        movieName: "Casablanca",
        ticketSymbol: "CSBC",
        logline: "An American expatriate meets a former lover, with unforeseen complications.",
        poster: "https://en.wikipedia.org/wiki/Casablanca_(film)#/media/File:CasablancaPoster-Gold.jpg",
        trailer: "https://www.imdb.com/title/tt0034583"
    };

    onSubmit = async event => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        const oracle = await currentOracle;
        const boxOffice = await BoxOffice.deployed();
        const kiitos = await Kiitos.deployed();
        
        // const balance = await kiitos.balanceOf(accounts[0]);
        // console.log(balance.toNumber());
        const film = await boxOffice.films(0);
        const movie = await Movie.at(film);

        console.log(movie);

        // await oracle.setPrice(400, {from: accounts[0]});
        //await boxOffice.updateFees(2, 3, {from: accounts[0]});
        await movie.updateFilm(this.state.salesEndTime, this.state.price, this.state.movieName, this.state.ticketSymbol, this.state.logline, this.state.poster, this.state.trailer, {from: accounts[0]});
        //await boxOffice.makeFilm(this.state.salesEndTime, this.state.price, this.state.ticketSupply, this.state.movieName, this.state.ticketSymbol, this.state.logline, this.state.poster, this.state.trailer, {from: accounts[0]});
    };

    render() {
        return (
            <Layout>
                <h3>Create Movie and Tickets!</h3>
                <Form onSubmit={this.onSubmit}>
                    <Form.Field>
                        <label>Ticket Price</label>
                        <Input 
                            label="wei" 
                            labelPosition="right" 
                            value={this.props.price}
                            onChange={event => this.setState({ price: event.target.value })}
                        />
                        <Button primary >Create!</Button>
                    </Form.Field>
                </Form>
            </Layout>
        );
    }
}

export default MakeFilm;