import React, { Component } from "react";
import { Dimmer, Loader, Step, Icon, Image, Progress, Header } from "semantic-ui-react";
import ipfs from "../../scripts/ipfs";
import web3, { currentOracle, Kiitos, BoxOffice, Movie } from "../../scripts/contracts";
import Layout from "../../components/Layout";
import UpdateFilm from "../../components/forms/UpdateFilm";

class MakeFilm extends Component {
    static async getInitialProps(props) {
        const kiitos = await Kiitos.deployed();
        const supply = await kiitos.totalSupply();
        const boxOffice = await BoxOffice.deployed();
        const listingFee = await boxOffice.listingFee();
        const oracle = await currentOracle;
        const usdPriceOfEth = await oracle.usdPriceOfEth();

        /*const movie = await Movie.at(props.query.movie);
        const film = {
            filmmaker: await movie.filmmaker(),
            title: await movie.name(),
            logline: await movie.logline(),
            poster: await movie.poster()
        };
        
        const accounts = await web3.eth.getAccounts();
        const tickets = await movie.balanceOf(accounts[0]);*/

        return { movie: props.query.movie };
    }

    state = {
        poster: "", // IPFS Hash
        percent: 100,
        dimmed: false,
        loading: false
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

    render() {
        return (
            <Dimmer.Dimmable blurring={this.state.dimmed || this.state.percent < 100} dimmed>
                <Layout page={this.props.movie ? "movie" : "studio"} movie={this.props.movie} dimPage={this.dimPage}>
                    <Dimmer active={this.state.dimmed} page>
                        <Loader size="massive" >Page loading</Loader>
                    </Dimmer>
                    <Dimmer active={this.state.percent < 100} page>
                        <Progress percent={this.state.percent} indicating inverted color="orange" size="big" />
                        <Header inverted size="huge">Uploading to IPFS</Header>
                    </Dimmer>

                    <Step.Group fluid size="large">
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
                    <UpdateFilm movie={this.props.movie} poster={this.state.poster}></UpdateFilm>
                </Layout>
            </Dimmer.Dimmable>
        );
    }
}

export default MakeFilm;