import React, { Component } from "react";
import { Modal, Form, Input, Message, Button, Icon } from "semantic-ui-react";
import { Router } from "../../routes";
import getAccount, { BoxOffice } from "../../utils/contracts";
import { round } from "../../utils/offchainwork";
import * as gtag from "../../utils/analytics";

class BuyTickets extends Component {
    state = {
        tickets: "",
        open: false,
        loading: false,
        error: ""
    };

    onSubmit = async event => {
        event.preventDefault();
        this.setState({ loading: true, error: "" });

        gtag.event({
            action: "buyTickets",
            category: "Movie",
            label: this.props.movie,
            value: this.state.tickets
        });

        try {
            const account = await getAccount();
            const boxOffice = await BoxOffice.deployed();
            await boxOffice.buyTickets(this.props.movie, this.state.tickets, { from: account, value: this.state.tickets*this.props.price[0] });
            this.props.dimPage();
            Router.pushRoute(`/theater/${this.props.movie}`);
            // this.setState({ loading: false, open: false });
        } catch(error) {
            this.setState({ loading: false, error: error.message });
        }
    };

    render() {
        return (
            <Modal closeIcon onClose={event => this.setState({ open: false })} open={this.state.open} trigger={<Button icon color="green" labelPosition="left" onClick={event => this.setState({open: true})}><Icon name="ticket" />Buy Tickets</Button>}>
                <Modal.Header>Buy {this.props.ticketSymbol} Tickets!</Modal.Header>
                <Modal.Content>
                    <Form size="large" loading={this.state.loading}>
                        <Form.Field>
                            <label>Number of Tickets</label>
                            <Input
                                value={this.state.tickets}
                                onChange={event => this.setState({ tickets: event.target.value })}
                                label={`${round(this.state.tickets*this.props.price[0]/10**15)} finney`}
                                labelPosition="right"
                                placeholder="How many tickets would you like to purchase?"
                            />
                        </Form.Field>        
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Message error hidden={!this.state.error} header="Please try again!" content={this.state.error} />
                    <Button size="large" onClick={this.onSubmit} color="green" loading={this.state.loading} icon labelPosition="left">
                        <Icon name="ticket" /> Buy Tickets
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default BuyTickets;