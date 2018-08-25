import React, { Component } from "react";
import { Modal, Form, Input, Message, Button, Icon } from "semantic-ui-react";
import { Router } from "../../routes";
import web3, { BoxOffice } from "../../scripts/contracts";

class BuyTickets extends Component {
    state = {
        ether: "",
        tickets: 1,
        open: false,
        loading: false,
        error: ""
    };

    onSubmit = async event => {
        event.preventDefault();
        this.setState({ loading: true, error: "" });

        try {
            const accounts = await web3.eth.getAccounts();
            const boxOffice = await BoxOffice.deployed();
            await boxOffice.buyTickets(this.props.movie, this.state.tickets, { from: accounts[0], value: web3.utils.toWei(this.state.ether, "ether") });
            this.setState({ open: false });
            Router.replaceRoute(`/movie/${this.props.movie}`);
        } catch(error) {
            this.setState({ error: error.message });
        }

        this.setState({ loading: false, ether: "", tickets: 1 });
    };

    render() {
        return (
            <Modal open={this.state.open} trigger={<Button icon color="green" labelPosition="left" onClick={event => this.setState({open: true})}><Icon name="ticket" />Buy Tickets</Button>}>
                <Modal.Header>Buy Tickets!</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Form onSubmit={this.onSubmit} error={!!this.state.error}>
                            <Form.Field>
                                <label>Number of Tickets</label>
                                <Input
                                    value={this.state.ether}
                                    onChange={event => this.setState({ ether: event.target.value })}
                                    label="ether"
                                    labelPosition="right"
                                />
                            </Form.Field>
                            <Message error header="Oophs!" content={this.state.error} />
                            <Button primary loading={this.state.loading}>
                                Buy Tickets!
                            </Button>
                        </Form>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}

export default BuyTickets;