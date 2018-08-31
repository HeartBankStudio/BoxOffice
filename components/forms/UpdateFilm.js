import React, { Component } from "react";
import { Form, Input, Button, Message, Icon, Label, Header, Segment, Image, Progress, Modal, Container } from "semantic-ui-react";
import { Router } from "../../routes";
import ipfs from "../../utils/ipfs";
import getAccount, { BoxOffice, Movie } from "../../utils/contracts";
import * as gtag from "../../utils/analytics";

class UpdateFilm extends Component {

    state = {
        poster: "", // IPFS Hash
        trailer: "", // YouTube Video ID

        movieName: "",
        logline: "",
        
        ticketSymbol: "",
        price: "",
        ticketSupply: "",

        day: "",
        month: "",
        year: "",
        availableTickets: "",

        percent: 100,
        loading: false,
        error: "",
        movie: ""
    };

    async componentDidMount() {
        if (this.props.movie) {
            const movie = await Movie.at(this.props.movie);
            const [ filmmaker, createdTime, salesEndDate, availableTickets, price, movieName, ticketSymbol, logline, poster, trailer ] = await movie.getFilmSummary();
            const [ sales, fund, ticketsSold, availableSupply, ticketSupply ] = await movie.getFilmStats();
            const date = new Date(salesEndDate*1000);

            this.setState({
                poster,
                trailer,
                movieName,
                logline,
                ticketSymbol,
                price: price/10**15,
                ticketSupply,
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                availableTickets
            });
        }
    }

    submitToInfura = event => {
        event.preventDefault();
        this.setState({ percent: 20 });

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

    submitToBoxOffice = async event => {
        event.preventDefault();
        this.setState({ loading: true, error: "" });

        gtag.event({
            action: "makeFilm",
            category: "BoxOffice",
            label: this.props.movie,
            value: this.state.movieName
        });

        try {
            const account = await getAccount();
            const salesEndDate = (new Date(this.state.year, parseInt(this.state.month) - 1, this.state.day)) / 1000 | 0;

            if (this.props.movie) {
                const movie = await Movie.at(this.props.movie);
                await movie.updateFilm(salesEndDate, this.state.availableTickets, this.state.price*10**15, this.state.movieName, this.state.ticketSymbol, this.state.logline, this.state.poster, this.state.trailer, {from: account});
                Router.pushRoute(`/movie/${movie.address}`);
            } else {
                const boxOffice = await BoxOffice.deployed();
                boxOffice.FilmCreated((err, res) => this.setState({ movie: res.args.movie })); // not useful because activated by Metamask's dry run
                await boxOffice.makeFilm(salesEndDate, this.state.availableTickets, this.state.price*10**15, this.state.ticketSupply, this.state.movieName, this.state.ticketSymbol, this.state.logline, this.state.poster, this.state.trailer, {from: account});
                // Router.pushRoute(`/movie/${this.state.movie}`);
                Router.pushRoute("/");
            }            
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    };

    render() {
        return (
            <Container style={{ marginTop: "20px" }}>
                <Modal open={this.state.percent < 100} basic centered>
                    <Progress percent={this.state.percent} indicating inverted color="orange" size="big" />
                    <Header inverted size="huge" textAlign="center">Uploading to IPFS</Header>
                </Modal>
                <Image src={this.state.poster && `https://ipfs.infura.io/ipfs/${this.state.poster}`} size="large" centered />
                <Form onSubmit={this.submitToBoxOffice} loading={this.state.loading} error={!!this.state.error} style={{ marginTop: "30px" }}>
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
                                <Input 
                                    value={this.state.poster} 
                                    iconPosition="left" 
                                    loading={!this.state.poster} 
                                    placeholder="IPFS Hash of Poster" 
                                    label={{ icon: "asterisk" }} 
                                    labelPosition="right corner" 
                                    value={this.state.poster}
                                    onChange={event => this.setState({ poster: event.target.value })}
                                />
                            </Form.Field>
                            <Form.Field width={6}>
                                <label>Movie Trailer</label>
                                <Input 
                                    icon="youtube" 
                                    iconPosition="left" 
                                    placeholder="YouTube Video ID" 
                                    label={{ icon: "asterisk" }} 
                                    labelPosition="right corner" 
                                    value={this.state.trailer}
                                    onChange={event => this.setState({ trailer: event.target.value })}
                                />
                            </Form.Field>
                        </Form.Group>
                    </Segment>
                    <Header>Movie Details</Header>
                    <Segment raised padded>
                        <Form.Group>
                            <Form.Field width={16}>
                                <label>Movie Title</label>
                                <Input 
                                    placeholder="What's the title of your movie?" 
                                    label={{ icon: "asterisk" }} 
                                    labelPosition="right corner" 
                                    value={this.state.movieName}
                                    onChange={event => this.setState({ movieName: event.target.value })}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group>
                            <Form.Field width={16}>
                                <label>Movie Logline</label>
                                <Form.TextArea 
                                    placeholder="In a sentence or two, what's your movie about?"
                                    value={this.state.logline}
                                    onChange={event => this.setState({ logline: event.target.value })}
                                ></Form.TextArea>
                            </Form.Field>
                        </Form.Group>
                    </Segment>
                    <Header>Token Details</Header>
                    <Segment raised padded>
                        <Form.Group>
                            <Form.Field width={5}>
                                <label>Ticket Symbol</label>
                                <Input 
                                    placeholder="What symbol would you like for your tickets?" 
                                    label={{ icon: "asterisk" }} 
                                    labelPosition="right corner" 
                                    value={this.state.ticketSymbol}
                                    onChange={event => this.setState({ ticketSymbol: event.target.value })}
                                />
                            </Form.Field>
                            <Form.Field width={5}>
                                <label>Ticket Price</label>
                                <Input 
                                    placeholder="How much does each ticket cost?"
                                    label="finney" 
                                    labelPosition="right" 
                                    value={this.state.price}
                                    onChange={event => this.setState({ price: event.target.value })}
                                />
                            </Form.Field>
                            <Form.Field width={6}>
                                <label>Ticket Supply</label>
                                <Input 
                                    placeholder="How many tickets would you like to create?" 
                                    label={{ icon: "asterisk" }} 
                                    labelPosition="right corner" 
                                    value={this.state.ticketSupply}
                                    onChange={event => { if (!this.props.movie) this.setState({ ticketSupply: event.target.value })}}
                                />
                            </Form.Field>
                        </Form.Group>
                    </Segment>
                    <Header>Sales Campaign</Header>
                    <Segment raised padded>
                        <Form.Group>
                            <Form.Field width={3}>
                                <label>Ending Day</label>
                                <Input 
                                    placeholder="Day (1 to 31)" 
                                    label={{ icon: "asterisk" }} 
                                    labelPosition="right corner"
                                    value={this.state.day}
                                    onChange={event => this.setState({ day: event.target.value })}
                                />
                            </Form.Field>
                            <Form.Field width={3}>
                                <label>Ending Month</label>
                                <Input 
                                    placeholder="Month (1 to 12)" 
                                    label={{ icon: "asterisk" }} 
                                    labelPosition="right corner" 
                                    value={this.state.month}
                                    onChange={event => this.setState({ month: event.target.value })}
                                />
                            </Form.Field>
                            <Form.Field width={4}>
                                <label>Ending Year</label>
                                <Input 
                                    placeholder="Year (4 digits)" 
                                    label={{ icon: "asterisk" }} 
                                    labelPosition="right corner" 
                                    value={this.state.year}
                                    onChange={event => this.setState({ year: event.target.value })}
                                />
                            </Form.Field>
                            <Form.Field width={6}>
                                <label>Available Tickets</label>
                                <Input 
                                    placeholder="How many should be available for sale?" 
                                    label={{ icon: "asterisk" }} 
                                    labelPosition="right corner" 
                                    value={this.state.availableTickets}
                                    onChange={event => this.setState({ availableTickets: event.target.value })}
                                />
                            </Form.Field>
                        </Form.Group>
                    </Segment>
                    <Message error style={{ marginTop: "30px" }}>
                        <Message.Header>Every field is required!</Message.Header>
                        <Message.Content>All can be changed later except the total supply of tickets.</Message.Content>
                        <Message.Content><em>{this.state.error}</em></Message.Content>
                    </Message>
                    <Button style={{ marginTop: "35px" }} loading={this.state.loading} labelPosition="left" icon size="large" fluid color="blue"><Icon name="chain" />Submit to Ethereum</Button>
                </Form>
            </Container>
        );
    }
}

export default UpdateFilm;