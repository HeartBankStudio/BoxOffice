import React, { Component } from "react";
import { Container, Statistic, List, Segment } from "semantic-ui-react";
import makeShorter, { toDollars } from "../../utils/offchainwork";

class BoxOfficeStats extends Component {

    state = {
        ticketsSold: [0, "0"],
        fundsCollected: [0, "$0"]
    };

    async componentWillUpdate() {
        this.setState({ ticketsSold: [this.props.ticketsSold, makeShorter(this.props.ticketsSold)], fundsCollected: [this.props.fundsCollected, await toDollars(this.props.fundsCollected)] });
    }

    render() {
        const { listingFee, withdrawFee, feesDonated } = this.props;
        return (
            <Container>
                <Statistic.Group widths={1}>
                    <Statistic color="blue">
                        <Statistic.Value title={this.state.fundsCollected[0]}>{this.state.fundsCollected[1]}</Statistic.Value>
                        <Statistic.Label>Crowd Funded</Statistic.Label>
                    </Statistic>
                </Statistic.Group>
                <Statistic.Group widths={1} style={{ marginTop: "20px" }}>
                    <Statistic color="orange">
                        <Statistic.Value title={this.state.ticketsSold[0]}>{this.state.ticketsSold[1]}</Statistic.Value>
                        <Statistic.Label>Tickets Pre-Sold</Statistic.Label>
                    </Statistic>
                </Statistic.Group>
                <Statistic.Group widths={1} size="small" style={{ marginTop: "20px" }}>
                    <Statistic color="pink">
                        <Statistic.Value title={feesDonated[0]}>{feesDonated[1]}</Statistic.Value>
                        <Statistic.Label>Donated to Charity</Statistic.Label>
                    </Statistic>
                </Statistic.Group>
                <Segment raised piled style={{ margin: "30px 0" }}>
                    <List size="large" relaxed="very" horizontal>
                        <List.Item>
                            <List.Content>
                                <List.Header>Listing Fee</List.Header>
                                <List.Description title={listingFee[0]}>
                                    {listingFee[1]} Kiitos
                                </List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Content>
                                <List.Header>Withdraw Fee</List.Header>
                                <List.Description>
                                    {withdrawFee} Percent
                                </List.Description>
                            </List.Content>
                        </List.Item>
                    </List>
                </Segment>
            </Container>
        );
    }
}

export default BoxOfficeStats;
    