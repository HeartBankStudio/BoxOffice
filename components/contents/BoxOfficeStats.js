import React from "react";
import { Container, Statistic, List, Segment } from "semantic-ui-react";

export default () => 
    <Container>
        <Statistic.Group widths={1}>
            <Statistic color="blue">
                <Statistic.Value>$133,000</Statistic.Value>
                <Statistic.Label>Crowd Funded</Statistic.Label>
            </Statistic>
        </Statistic.Group>
        <Statistic.Group widths={1} style={{ marginTop: "20px" }}>
            <Statistic color="orange">
                <Statistic.Value>31,200</Statistic.Value>
                <Statistic.Label>Tickets Pre-Sold</Statistic.Label>
            </Statistic>
        </Statistic.Group>
        <Statistic.Group widths={1} size="small" style={{ marginTop: "20px" }}>
            <Statistic color="pink">
                <Statistic.Value>$2,334</Statistic.Value>
                <Statistic.Label>Donated to Charity</Statistic.Label>
            </Statistic>
        </Statistic.Group>
        <Segment raised piled style={{ margin: "30px 0" }}>
            <List size="large" relaxed="very" horizontal>
                <List.Item>
                    <List.Content>
                        <List.Header>Listing Fee</List.Header>
                        <List.Description>
                            2 Kiitos
                        </List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content>
                        <List.Header>Withdraw Fee</List.Header>
                        <List.Description>
                            1 Percent
                        </List.Description>
                    </List.Content>
                </List.Item>
            </List>
        </Segment>
    </Container>;