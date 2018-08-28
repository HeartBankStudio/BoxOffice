import React, { Component } from "react";
import { Menu, Icon, Popup, Modal, Embed, Label } from "semantic-ui-react";
import { Link, Router } from "../routes";
import getAccount, { Kiitos, Movie } from "../utils/contracts";
import WithdrawFund from "../components/forms/WithdrawFund";

class Header extends Component {

    state = {
        theater: false,
        pending: false,
        error: ""
    };

    renderStyle() {
        return <style>
            {`.rotate {
                -webkit-transform: rotate(45deg);
                -moz-transform: rotate(45deg);
                -o-transform: rotate(45deg);
                -ms-transform: rotate(45deg);
                transform: rotate(45deg);
            }`}
        </style>;
    }
    
    renderMenu() {
        if (this.props.page === "studio") {
            return (
                <Menu.Menu position="right">
                    <Popup trigger={<Menu.Item><strong><Icon name="moon outline" /> {this.props.kiitosBalance[1]} Kiitos</strong></Menu.Item>} content={`You have ${this.props.kiitosBalance[0]} Kiitos coins!`} />
                    <Popup trigger={<Menu.Item onClick={this.airDrop}><Icon name="fly" /> FREE Airdrop<Label color="purple" floating>100</Label></Menu.Item>} content="Get 100 Kiitos coins for FREE!" />
                    <Popup trigger={<Menu.Item active><Icon color="grey" name="address book outline" fitted /></Menu.Item>} content={<span><strong>Your account address</strong>: {this.props.account}</span>} />
                </Menu.Menu>
            );
        } else if (this.props.page === "movie") {
            return (
                <Menu.Menu position="right">
                    <Link route={`/movie/${this.props.movie}/update`}><Menu.Item onClick={event => this.props.dimPage()}><Icon name="edit outline" /> Update Movie</Menu.Item></Link>
                    <Menu.Item><WithdrawFund movie={this.props.movie} dimPage={this.props.dimPage} page={this.props.page} fund={this.props.fund} /></Menu.Item>
                    <Popup trigger={<Menu.Item><Icon name="ticket" /> {this.props.ticketSymbol} Tickets<Label color="purple" floating>{this.props.ticketBalance[1]}</Label></Menu.Item>} content={`You have ${this.props.ticketBalance[0]} ${this.props.ticketSymbol} tickets!`} />
                    <Popup trigger={<Menu.Item active><Icon color="grey" name="address book outline" fitted /></Menu.Item>} content={<span><strong>Your account address</strong>: {this.props.account}</span>} />
                </Menu.Menu>
            );
        } else if (this.props.page === "update") {
            return (
                <Menu.Menu position="right">
                    <Link route={`/movie/${this.props.movie}`}><Menu.Item onClick={event => this.props.dimPage()}><Icon name="arrow left" /> {this.props.movieName}</Menu.Item></Link>
                    <Menu.Item><WithdrawFund movie={this.props.movie} dimPage={this.props.dimPage} page={this.props.page} fund={this.props.fund} /></Menu.Item>
                    <Popup trigger={<Menu.Item><Icon name="ticket" /> {this.props.ticketSymbol} Tickets<Label color="purple" floating>{this.props.ticketBalance[1]}</Label></Menu.Item>} content={`You have ${this.props.ticketBalance[0]} ${this.props.ticketSymbol} tickets!`} />
                    <Popup trigger={<Menu.Item active><Icon color="grey" name="address book outline" fitted /></Menu.Item>} content={<span><strong>Your account address</strong>: {this.props.account}</span>} />
                </Menu.Menu>
            );
        } else if (this.props.page === "theater") {
            return (
                <Menu.Menu position="right">
                    <Menu.Item onClick={this.spendTicket} color="teal"><Icon name="ticket" /> Spend Ticket</Menu.Item>
                    <Modal closeIcon onClose={event => this.setState({ theater: false })} open={this.state.theater} trigger={<Menu.Item onClick={event => this.setState({ theater: true })}><Icon name="video camera" /> Watch Movie</Menu.Item>} size="fullscreen" dimmer="blurring" basic centered>
                        <Modal.Content><Embed hd autoplay id={this.props.trailer} placeholder={`https://ipfs.infura.io/ipfs/${this.props.poster}`} source="youtube" /></Modal.Content>
                    </Modal>
                    <Popup trigger={<Menu.Item><Icon name="users" /> Audience<Label color="purple" floating>{this.props.audience[1]}</Label></Menu.Item>} content={`There are ${this.props.audience[0]} audience members watching with you!`} />
                    <Popup trigger={<Menu.Item active><Icon color="grey" name="address book outline" fitted /></Menu.Item>} content={<span><strong>Your account address</strong>: {this.props.account}</span>} />
                </Menu.Menu>
            );
        }
    }

    airDrop = async () => {
        this.setState({ pending: true, error: "" });
        try {
            const account = await getAccount();
            const kiitos = await Kiitos.deployed();
            await kiitos.airDrop({ from: account });
            // this.props.dimPage();
            Router.replaceRoute(this.props.page === "studio" ? "/" : "/movie/make");
            this.setState({ pending: false });
        } catch(error) {
            this.setState({ error: error.message });
        }
    };

    spendTicket = async () => {
        this.setState({ pending: true, error: "" });
        try {
            const account = await getAccount();
            const movie = await Movie.at(this.props.movie);
            await movie.spendTicket({ from: account });
            // this.props.dimPage();
            // Router.replaceRoute(`/theater/${movie.address}`);
            this.setState({ theater: true, pending: false });
        } catch(error) {
            this.setState({ error: error.message });
        }
    };

    render() {
        return (
            <Menu style={{margin: "20px 0"}}>
                {this.renderStyle()}
                <Modal closeIcon onClose={event => this.setState({pending: false})} open={this.state.pending} basic centered style={{textAlign: "center"}}>
                    <Modal.Header>Please confirm this transaction with Metamask.</Modal.Header>
                    <Modal.Content>{this.state.error}</Modal.Content>
                </Modal>
                <Menu.Menu position="left">
                    <Popup trigger={<Menu.Item as="a" href="https://github.com/HeartBankStudio/BoxOffice" target="_blank"><Icon className="rotate" color="red" name="heart" fitted /></Menu.Item>} content="Help contribute to this open source project on GitHub!" />
                    <Link route="/"><Menu.Item active title="Go to home page" onClick={event => {if (this.props.page !== "studio") this.props.dimPage()}}><h4>HeartBank Studio</h4></Menu.Item></Link>    
                </Menu.Menu>
                {this.renderMenu()}
            </Menu>
        );
    }
}

export default Header;

