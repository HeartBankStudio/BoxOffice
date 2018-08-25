import React from "react";
import { Container, Statistic } from "semantic-ui-react";

export default () => 
    <Container>
        <Statistic.Group size="small" widths={2}>
            <Statistic color="blue" size="small">
                <Statistic.Value>$43,000</Statistic.Value>
                <Statistic.Label>Crowd Funded</Statistic.Label>
            </Statistic>
            <Statistic color="orange">
                <Statistic.Value>1,300</Statistic.Value>
                <Statistic.Label>Tickets Pre-Sold</Statistic.Label>
            </Statistic>
        </Statistic.Group>
        <Statistic.Group size="tiny" widths={2}>
            <Statistic color="purple" style={{ marginTop: "20px" }}>
                <Statistic.Value>$2</Statistic.Value>
                <Statistic.Label>Ticket Price</Statistic.Label>
            </Statistic>
            <Statistic color="olive" style={{ marginTop: "20px" }}>
                <Statistic.Value>425</Statistic.Value>
                <Statistic.Label>Tickets Available</Statistic.Label>
            </Statistic>
        </Statistic.Group>
        <Statistic.Group size="small" widths={1}>
            <Statistic color="red" style={{ marginTop: "20px" }}>
                <Statistic.Value>10 Days</Statistic.Value>
                <Statistic.Label>Sales Ends In</Statistic.Label>
            </Statistic>
        </Statistic.Group>
    </Container>;