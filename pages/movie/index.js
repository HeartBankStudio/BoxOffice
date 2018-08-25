import React, { Component } from "react";
import { Progress, Grid, Button, Icon, Dimmer, Loader } from "semantic-ui-react";
import web3, { currentOracle, Kiitos, BoxOffice, Movie } from "../../scripts/contracts";
import { Link } from "../../routes";
import Layout from "../../components/Layout";
import MovieDetails from "../../components/contents/MovieDetails";
import MovieStats from "../../components/contents/MovieStats";
import TokenDetails from "../../components/contents/TokenDetails";
import BuyTickets from "../../components/forms/BuyTickets";
import Withdrawals from "../../components/contents/Withdrawals";

class BoxOfficeMovie extends Component {
    static async getInitialProps(props) {
        const kiitos = await Kiitos.deployed();
        const supply = await kiitos.totalSupply();
        const boxOffice = await BoxOffice.deployed();
        const listingFee = await boxOffice.listingFee();
        const oracle = await currentOracle;
        const usdPriceOfEth = await oracle.usdPriceOfEth();

        const movie = await Movie.at(props.query.movie);
        const film = {
            filmmaker: await movie.filmmaker(),
            title: await movie.name(),
            logline: await movie.logline(),
            poster: await movie.poster()
        };
        
        const accounts = await web3.eth.getAccounts();
        const tickets = await movie.balanceOf(accounts[0]);

        return { movie: props.query.movie, film, tickets: tickets.toNumber() };
    }

    state = {
        withdrawals: [],
        dimmed: false
    };

    dimPage = () => this.setState({ dimmed: true });

    async componentDidMount() {
        const boxOffice = await BoxOffice.deployed();
        boxOffice.FundWithdrawn(null, { fromBlock: 0, toBlock: "latest" }, (err, res) => this.setState({ withdrawals: [res.args, ...this.state.withdrawals] }));
    }

    render() {
        return (
            <Dimmer.Dimmable blurring={this.state.dimmed} dimmed>
                <Layout page="movie" movie={this.props.movie} dimPage={this.dimPage}>
                    <Dimmer active={this.state.dimmed} page>
                        <Loader size="massive" >Page loading</Loader>
                    </Dimmer>
                    <Grid style={{ marginTop: "20px" }}>
                        <Grid.Row>
                            <Grid.Column width={7}>   
                                <MovieDetails movie={this.props.movie} {...this.props.film} />
                            </Grid.Column>
                            <Grid.Column width={9} textAlign="center">
                                <MovieStats />
                                <Button.Group fluid style={{ marginTop: "30px"}}>
                                    <BuyTickets movie={this.props.movie}/>
                                    <Link route={`/theater/${this.props.movie}`}><Button onClick={event => this.dimPage()} color="green" icon labelPosition="left"><Icon name="image" />Watch Movie</Button></Link>
                                </Button.Group>
                                <TokenDetails />
                                <Progress color="yellow" percent={34} progress />
                            </Grid.Column>   
                        </Grid.Row>      
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Withdrawals movie={this.props.movie} withdrawals={this.state.withdrawals} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Layout>
            </Dimmer.Dimmable>
        );
    }
}

export default BoxOfficeMovie;