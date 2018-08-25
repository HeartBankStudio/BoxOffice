import React, { Component } from "react";
import { Form, Input, Button, Message, Icon, Label, Header, Segment } from "semantic-ui-react";
import { Router } from "../../routes";
import web3, { currentOracle, Kiitos, BoxOffice, Movie } from "../../scripts/contracts";

class UpdateFilm extends Component {

    state = {
        movieName: "",
        logline: "",
        trailer: "", // YouTube Video ID
        
        ticketSymbol: "",
        price: web3.utils.toWei("1", "finney"),
        ticketSupply: web3.utils.toWei("1", "ether"),
        salesEndTime: Date.now()/1000 + 28*60*60*24 | 0,

        loading: false,
        error: ""
    };

    onSubmit = async event => {
        event.preventDefault();
        this.setState({ loading: true, error: "" });

        try {
            const accounts = await web3.eth.getAccounts();
            const oracle = await currentOracle;
            const boxOffice = await BoxOffice.deployed();
            const kiitos = await Kiitos.deployed();

            // await oracle.setPrice(400, {from: accounts[0]});
            // await boxOffice.updateFees(2, 3, {from: accounts[0]});

            // const film = await boxOffice.films(0);
            // const movie = await Movie.at(film);
            // await movie.updateFilm(this.state.salesEndTime, this.state.price, this.state.movieName, this.state.ticketSymbol, this.state.logline, this.state.poster, this.state.trailer, {from: accounts[0]});
            
            await boxOffice.makeFilm(this.state.salesEndTime, this.state.price, this.state.ticketSupply, this.state.movieName, this.state.ticketSymbol, this.state.logline, this.state.poster, this.state.trailer, {from: accounts[0]});
            Router.pushRoute("/");
        } catch (error) {
            this.setState({ error: error.message });
        }

        this.setState({ loading: false });
    };

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.error} style={{ marginTop: "30px" }}>
                <Segment raised padded>
                    <Form.Group>
                        <Form.Field width={4}>
                            <label>Movie Poster</label>
                            <Label as="label" htmlFor="file">
                                <Icon size="big" name="cloud upload" />
                                <span style={{ fontSize: "10pt" }}>Upload to IPFS</span>
                            </Label>
                            <input id="file" hidden type="file" onChange={this.submitToInfura} />
                        </Form.Field>
                        <Form.Field width={6}>
                            <label>IPFS Hash</label>
                            <Input iconPosition="left" loading placeholder="IPFS Hash of Poster" label={{ icon: "asterisk" }} labelPosition="right corner" />
                        </Form.Field>
                        <Form.Field width={6}>
                            <label>Movie Trailer</label>
                            <Input icon="youtube" iconPosition="left" placeholder="YouTube Video ID" label={{ icon: "asterisk" }} labelPosition="right corner" />
                        </Form.Field>
                    </Form.Group>
                </Segment>
                <Header>Movie Details</Header>
                <Segment raised padded>
                    <Form.Group>
                        <Form.Field width={16}>
                            <label>Movie Title</label>
                            <Input placeholder="Title of Movie" label={{ icon: "asterisk" }} labelPosition="right corner" />
                        </Form.Field>
                    </Form.Group>
                    <Form.Group>
                        <Form.Field width={16}>
                            <label>Movie Logline</label>
                            <Form.TextArea placeholder="Logline of Movie"></Form.TextArea>
                        </Form.Field>
                    </Form.Group>
                </Segment>
                <Header>Token Details</Header>
                <Segment raised padded>
                    <Form.Group>
                        <Form.Field width={5}>
                            <label>Ticket Symbol</label>
                            <Input placeholder="Token Symbol" label={{ icon: "asterisk" }} labelPosition="right corner" />
                        </Form.Field>
                        <Form.Field width={5}>
                            <label>Ticket Price</label>
                            <Input 
                                placeholder="Token Price"
                                label="wei" 
                                labelPosition="right" 
                                value={this.props.price}
                                onChange={event => this.setState({ price: event.target.value })}
                            />
                        </Form.Field>
                        <Form.Field width={6}>
                            <label>Ticket Supply</label>
                            <Input placeholder="Token Supply" label={{ icon: "asterisk" }} labelPosition="right corner" />
                        </Form.Field>
                    </Form.Group>
                </Segment>
                <Header>Sales Campaign</Header>
                <Segment raised padded>
                    <Form.Group>
                        <Form.Field width={3}>
                            <label>Ending Day</label>
                            <Input placeholder="Day" label={{ icon: "asterisk" }} labelPosition="right corner" />
                        </Form.Field>
                        <Form.Field width={3}>
                            <label>Ending Month</label>
                            <Input placeholder="Month" label={{ icon: "asterisk" }} labelPosition="right corner" />
                        </Form.Field>
                        <Form.Field width={4}>
                            <label>Ending Year</label>
                            <Input placeholder="Year" label={{ icon: "asterisk" }} labelPosition="right corner" />
                        </Form.Field>
                        <Form.Field width={6}>
                            <label>Available Tickets</label>
                            <Input placeholder="Quantity" label={{ icon: "asterisk" }} labelPosition="right corner" />
                        </Form.Field>
                    </Form.Group>
                </Segment>
                <Message error header="Oops!" content={this.state.error} />
                <Button style={{ marginTop: "35px" }} loading={this.state.loading} labelPosition="left" icon size="large" fluid color="blue" as="a"><Icon name="chain" />Submit to Ethereum Blockchain</Button>
            </Form>
        );
    }
}

export default UpdateFilm;