import React, { Component } from "react";
import { Button, Grid, Icon, Sticky, Dimmer, Loader } from "semantic-ui-react";
import { currentOracle, Kiitos, BoxOffice } from "../scripts/contracts";
import { Link } from "../routes";
import Layout from "../components/Layout";
import BoxOfficeMovies from "../components/contents/BoxOfficeMovies";
import BoxOfficeStats from "../components/contents/BoxOfficeStats";

class HeartBankStudio extends Component {
    static async getInitialProps() {
        const kiitos = await Kiitos.deployed();
        const supply = await kiitos.totalSupply();
        const boxOffice = await BoxOffice.deployed();
        const listingFee = await boxOffice.listingFee();
        const oracle = await currentOracle;
        const usdPriceOfEth = await oracle.usdPriceOfEth();

        //const balance = await kiitos.balanceOf(accounts[0]);
        //this.setState({ account: accounts[0], balance: balance.toNumber().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") });

        const films = await boxOffice.getFilms();

        //todo: try catch to show empty page if not connected to right network bc no deployed contracts!!

        return { films };
    }
    
    state = {
        dimmed: false
    };

    dimPage = () => this.setState({ dimmed: true });

    render() {
        return (
            <Dimmer.Dimmable blurring={this.state.dimmed} dimmed>
                <Layout page="studio" movie={null} dimPage={this.dimPage}>
                    <Dimmer active={this.state.dimmed} page>
                        <Loader size="massive" >Page loading</Loader>
                    </Dimmer>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={10}>
                                <BoxOfficeMovies films={this.props.films} dimPage={this.dimPage} />
                            </Grid.Column>
                            <Grid.Column width={6} textAlign="center" style={{ marginTop: "10px" }}>
                                <BoxOfficeStats />
                                <Sticky>
                                    <Link route="/movie/make">
                                        <Button onClick={event => this.setState({ loading: true })} labelPosition="left" icon size="medium" fluid color="green" as="a"><Icon name="video camera" />Create ERC20 Tickets for your Film!</Button>
                                    </Link>
                                </Sticky>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Layout>
            </Dimmer.Dimmable>
        );
    }
}

export default HeartBankStudio;