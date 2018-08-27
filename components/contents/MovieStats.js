import React from "react";
import { Container, Statistic } from "semantic-ui-react";

const returnDays = time => {
    const days = (time - Date.now())/(1000*60*60*24) | 0;
    return days + (days === 1 ? " Day" : " Days");
};

export default ({ salesEndDate, price, availableTickets, ticketsSold, sales }) => 
    <Container>
        <Statistic.Group size="small" widths={2}>
            <Statistic color="blue" size="small">
                <Statistic.Value title={sales[0]}>{sales[1]}</Statistic.Value>
                <Statistic.Label>Crowd Funded</Statistic.Label>
            </Statistic>
            <Statistic color="orange">
                <Statistic.Value title={ticketsSold[0]}>{ticketsSold[1]}</Statistic.Value>
                <Statistic.Label>Tickets Pre-Sold</Statistic.Label>
            </Statistic>
        </Statistic.Group>
        <Statistic.Group size="tiny" widths={2}>
            <Statistic color="purple" style={{ marginTop: "20px" }}>
                <Statistic.Value title={price[0]}>{price[1]}</Statistic.Value>
                <Statistic.Label>Ticket Price</Statistic.Label>
            </Statistic>
            <Statistic color="olive" style={{ marginTop: "20px" }}>
                <Statistic.Value title={availableTickets[0]}>{availableTickets[1]}</Statistic.Value>
                <Statistic.Label>Tickets Available</Statistic.Label>
            </Statistic>
        </Statistic.Group>
        <Statistic.Group size="small" widths={1}>
            <Statistic color="red" style={{ marginTop: "20px" }}>
                <Statistic.Value>{returnDays(salesEndDate)}</Statistic.Value>
                <Statistic.Label>Sales Ends In</Statistic.Label>
            </Statistic>
        </Statistic.Group>
    </Container>;