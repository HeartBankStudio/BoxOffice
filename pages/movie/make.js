import React, { Component } from "react";
import { Router } from "../../routes";
import { Form, Input, Button, Message, Dimmer, Loader, Step, Icon, Label, Image, Progress, Header, Segment } from "semantic-ui-react";
import Layout from "../../components/Layout";
import web3, { currentOracle, Kiitos, BoxOffice, Movie } from "../../scripts/contracts";
import ipfs from "../../scripts/ipfs";

class MakeFilm extends Component {
    state = {
        poster: "", // IPFS Hash
        movieName: "",
        logline: "",
        trailer: "", // YouTube Video ID
        
        ticketSymbol: "",
        price: web3.utils.toWei("1", "finney"),
        ticketSupply: web3.utils.toWei("1", "ether"),
        salesEndTime: Date.now()/1000 + 28*60*60*24 | 0,

        percent: 100,
        dimmed: false,
        loading: false,
        error: ""
    };

    dimPage = () => this.setState({ dimmed: true });

    submitToInfura = event => {
        event.preventDefault();
        this.setState({ percent: 35 });
        const image = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(image);
        reader.onloadend = () => {
            const buffer = Buffer(reader.result);
            ipfs.add(buffer, { progress: progress => this.setState({ percent: progress/buffer.byteLength*100 }) })
                .then(response => this.setState({ poster: response[0].hash }))
                .catch(error => this.setState({ error: error.message }));

            /*ipfs.files.add(Buffer(reader.result), (err, res) => {
                if (err) {
                    this.setState({ error: err.message });
                } else {
                    this.setState({ poster: res[0].hash });
                }
                this.setState({ dimmed: false });
            });*/
        };     
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
            <Dimmer.Dimmable blurring={this.state.dimmed || this.state.percent < 100} dimmed>
                <Layout page="studio" movie={null} dimPage={this.dimPage}>
                    <Dimmer active={this.state.dimmed} page>
                        <Loader size="massive" >Page loading</Loader>
                    </Dimmer>
                    <Dimmer active={this.state.percent < 100} page>
                        <Progress percent={this.state.percent} indicating inverted color="orange" size="big" />
                        <Header inverted size="huge">Uploading to IPFS</Header>
                    </Dimmer>

                    <Step.Group fluid size="small">
                        <Step active>
                        <Icon name="heart outline" color="red" />
                        <Step.Content>
                            <Step.Title>Support <span style={{ margin: "0 -2px 0 0" }}>Heart</span><Icon className="rotate" color="green" name="heart" fitted /><span style={{ margin: "0 0 0 1px" }}>ank</span></Step.Title>
                            <Step.Description>1. Buy Kiitos Coins</Step.Description>
                        </Step.Content>
                        </Step>
                        <Step active>
                        <Icon name="film" color="red" />
                        <Step.Content>
                            <Step.Title>Describe Film Project</Step.Title>
                            <Step.Description>2. Enter Movie Details</Step.Description>
                        </Step.Content>
                        </Step>
                        <Step active>
                        <Icon name="ticket" color="red" />
                        <Step.Content>
                            <Step.Title>Create Movie Tickets</Step.Title>
                            <Step.Description>3. Enter ERC20 Token Details</Step.Description>
                        </Step.Content>
                        </Step>
                    </Step.Group>

                    <Image src={this.state.poster && `https://ipfs.infura.io/ipfs/${this.state.poster}`} size="big" centered style={{ marginTop: "20px" }} />
                       
                    <Form onSubmit={this.onSubmit} error={!!this.state.error} style={{ marginTop: "30px" }}>
                        <Segment raised padded>
                            <Form.Group>
                                <Form.Field width={4}>
                                    <label>Movie Poster</label>
                                    <Label as="label" htmlFor="file">
                                        <Icon size="big" name="image" />
                                        <span style={{ fontSize: "12pt" }}>Upload to IPFS</span>
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
                                    <label>Quantity Limit</label>
                                    <Input placeholder="Quantity" label={{ icon: "asterisk" }} labelPosition="right corner" />
                                </Form.Field>
                            </Form.Group>
                        </Segment>
                        <Message error header="Oops!" content={this.state.error} />
                        <Button style={{ marginTop: "35px" }} loading={this.state.loading} labelPosition="left" icon size="large" fluid color="blue" as="a"><Icon name="chain" />Submit your Film Project to the Ethereum Blockchain!</Button>
                    </Form>
                </Layout>
            </Dimmer.Dimmable>
        );
    }
}

export default MakeFilm;