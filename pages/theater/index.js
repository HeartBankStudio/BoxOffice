import React, { Component } from "react";
import { Container, Embed, List, Label, Breadcrumb, Dimmer, Loader, Message } from "semantic-ui-react";
import getAccount, { BoxOffice, Movie } from "../../utils/contracts";
import { Link } from "../../routes";
import Layout from "../../components/Layout";
import AudienceMembers from "../../components/contents/AudienceMembers";
import makeShorter, { toDollars } from "../../utils/offchainwork";

const isAudienceMember = (account, members) => {
    for (let member of members) {
        if (member.toString() === account.toString()) return true;
    }
    return false;
};

class BoxOfficeTheater extends Component {
    static async getInitialProps(props) {
        const account = await getAccount();
        const boxOffice = await BoxOffice.deployed();
        const [listingFee, withdrawFee, feesCollected, feesDonated ] = await boxOffice.getBoxOfficeStats();

        const movie = await Movie.at(props.query.movie);
        const [ filmmaker, createdTime, salesEndDate, availableTickets, price, movieName, ticketSymbol, logline, poster, trailer ] = await movie.getFilmSummary();
        const members = await movie.getAudienceMembers();
        const isMember = isAudienceMember(account, members); // members.indexOf(account) > -1; // members.includes(account);

        console.log(account, members, isMember);

        return {
            movie: props.query.movie, 
            feesCollected: [ feesCollected.toNumber(), await toDollars(feesCollected) ],
            film: {
                movieName,
                poster,
                trailer,
                members,
                isMember
            },
            wallet: {
                account,
                audience: [ members.length, makeShorter(members.length) ]
            }
        };
    }

    state = {
        dimmed: false
    };

    dimPage = () => this.setState({ dimmed: true });

    render() {
        return (
            <Dimmer.Dimmable blurring={this.state.dimmed} dimmed>
                <Layout page="theater" movie={this.props.movie} dimPage={this.dimPage} {...this.props.wallet} feesCollected={this.props.feesCollected} {...this.props.film}>
                    <Dimmer active={this.state.dimmed} page>
                        <Loader size="massive" >Connecting to Ethereum</Loader>
                    </Dimmer>
                    <Message positive hidden={!this.props.film.isMember}>
                        <Message.Header>Congratulations!</Message.Header>
                        <p>You have the ticket to watch this movie!</p>
                    </Message>
                    <Message warning hidden={this.props.film.isMember}>
                        <Message.Header>Watch the trailer!</Message.Header>
                        <p>If you have a ticket, spend it to watch this movie!</p>
                    </Message>
                    <Embed hd id={this.props.film.trailer} placeholder={`https://ipfs.infura.io/ipfs/${this.props.film.poster}`} source="youtube" style={{ marginTop: "30px" }} />
                    <Container style={{ marginTop: "8px" }}>
                        <Breadcrumb size="large">
                            <Link route="/"><Breadcrumb.Section onClick={event => this.dimPage()} link>Studio</Breadcrumb.Section></Link>
                            <Breadcrumb.Divider icon="right chevron" />
                            <Link route={`/movie/${this.props.movie}`}><Breadcrumb.Section onClick={event => this.dimPage()} link>{this.props.film.movieName}</Breadcrumb.Section></Link>
                            <Breadcrumb.Divider icon="right arrow" />
                            <Breadcrumb.Section active>Theater</Breadcrumb.Section>
                        </Breadcrumb>
                        <List horizontal floated="right">
                            <List.Item><Label color="teal" tag>New</Label></List.Item>
                            <List.Item><Label color="orange" tag>Upcoming</Label></List.Item>
                            <List.Item><Label color="red" tag>Featured</Label></List.Item>
                        </List>
                    </Container>
                    <AudienceMembers members={this.props.film.members} />
                </Layout>
            </Dimmer.Dimmable>
        );
    }
}

export default BoxOfficeTheater;