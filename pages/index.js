import React, { Component } from "react";
import { Button, Grid, Icon, Sticky, Dimmer, Loader } from "semantic-ui-react";
import getAccount, { Kiitos, BoxOffice } from "../utils/contracts";
import { Link } from "../routes";
import Layout from "../components/Layout";
import BoxOfficeMovies from "../components/contents/BoxOfficeMovies";
import BoxOfficeStats from "../components/contents/BoxOfficeStats";
import makeShorter, { toDollars } from "../utils/offchainwork";

class HeartBankStudio extends Component {
    static async getInitialProps() {
        const kiitos = await Kiitos.deployed();
        const boxOffice = await BoxOffice.deployed();

        const account = await getAccount();
        const kiitosBalance = await kiitos.balanceOf(account);
        
        const films = await boxOffice.getFilms();
        const [ listingFee, withdrawFee, feesCollected, feesDonated ] = await boxOffice.getBoxOfficeStats();

        return { 
            films: films.reverse(), 
            feesCollected: [ feesCollected.toNumber(), await toDollars(feesCollected) ], 
            wallet: { 
                account, 
                kiitosBalance: [ kiitosBalance.toNumber(), makeShorter(kiitosBalance) ]
            }, 
            stats: { 
                listingFee: [ listingFee.toNumber(), makeShorter(listingFee) ], 
                withdrawFee: withdrawFee.toNumber(), 
                feesDonated: [ feesDonated.toNumber(), await toDollars(feesDonated) ]
            } 
        };
    }
    
    state = {
        fundsCollected: 0,
        ticketsSold: 0,
        dimmed: false
    };

    dimPage = () => this.setState({ dimmed: true });

    async componentDidMount() {
        const boxOffice = await BoxOffice.deployed();
        boxOffice.TicketsBought(null, { fromBlock: 0, toBlock: "latest" }, (err, res) => this.setState({ fundsCollected: this.state.fundsCollected + res.args.price*res.args.quantity, ticketsSold: this.state.ticketsSold + res.args.quantity }));
    }

    render() {
        return (
            <Dimmer.Dimmable blurring={this.state.dimmed} dimmed>
                <Layout page="studio" movie={null} dimPage={this.dimPage} {...this.props.wallet} feesCollected={this.props.feesCollected}>
                    <Dimmer active={this.state.dimmed} page>
                        <Loader size="massive" >Connecting to Ethereum</Loader>
                    </Dimmer>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={10}>
                                <BoxOfficeMovies films={this.props.films} dimPage={this.dimPage} />
                            </Grid.Column>
                            <Grid.Column width={6} textAlign="center" style={{ marginTop: "10px" }}>
                                <BoxOfficeStats {...this.props.stats} ticketsSold={this.state.ticketsSold} fundsCollected={this.state.fundsCollected} />
                                <Sticky>
                                    <Link route="/movie/make">
                                        <Button onClick={event => this.dimPage()} labelPosition="left" icon size="medium" fluid color="green" as="a"><Icon name="video camera" />Create ERC20 Tickets for your Film!</Button>
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