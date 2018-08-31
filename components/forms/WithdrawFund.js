import React, { Component } from "react";
import { Modal, Form, Button, Message, Input, Icon } from "semantic-ui-react";
import { Router } from "../../routes";
import getAccount, { BoxOffice } from "../../utils/contracts";
import { round } from "../../utils/offchainwork";
import * as gtag from "../../utils/analytics";

class WithdrawFund extends Component {
    state = {
        recipient: "",
        amount: "",
        expense: "",
        open: false,
        loading: false,
        error: ""
    };

    onSubmit = async event => {
        event.preventDefault();
        const { recipient, amount, expense } = this.state;
        this.setState({ loading: true, error: "" });

        gtag.event({
            action: "withdrawFund",
            category: "Movie",
            label: this.props.movie,
            value: amount
        });

        try {
            const account = await getAccount();
            const boxOffice = await BoxOffice.deployed();
            await boxOffice.withdrawFund(this.props.movie, recipient, amount*10**18, expense, {from: account});
            if (this.props.page === "movie") {
                Router.replaceRoute(`/movie/${this.props.movie}`);
                this.setState({ loading: false, open: false });
            } else {
                this.props.dimPage();
                Router.pushRoute(`/movie/${this.props.movie}`);
            }
            
        } catch(error) {
            this.setState({ error: error.message, loading: false });
        }        
    };

    render() {
        return (
            <Modal closeIcon onClose={event => this.setState({ open: false })} open={this.state.open} trigger={<Button icon labelPosition="left" color="grey" onClick={event => this.setState({open: true})}><Icon name="dollar sign" />Withdraw Fund</Button>}>
                <Modal.Header>Pay Expense</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Form loading={this.state.loading} size="large">
                            <Form.Field>
                                <label>Recipient:</label>
                                <Input 
                                    value={this.state.recipient}
                                    onChange={event => this.setState({ recipient: event.target.value })}
                                    placeholder="Recipient's Ethereum account address"
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Amount:</label>
                                <Input 
                                    value={this.state.amount}
                                    onChange={event => this.setState({ amount: event.target.value })}
                                    label={`${round(this.props.fund[0]/10**18 - this.state.amount)} ether left`}
                                    labelPosition="right"
                                    placeholder="Payment amount in ether"
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Expense Description:</label>
                                <Input 
                                    value={this.state.expense}
                                    onChange={event => this.setState({ expense: event.target.value })}
                                    placeholder="What's the reason?"
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Message error hidden={!this.state.error} header="All fields are required." content={this.state.error} />
                    <Button size="large" onClick={this.onSubmit} color="teal" loading={this.state.loading} icon labelPosition="left">
                        <Icon name="dollar" /> Send Payment
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default WithdrawFund;