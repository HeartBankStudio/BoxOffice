import React from "react";
import { Segment, List } from "semantic-ui-react";

export default ({ ticketSymbol, availableSupply, ticketSupply, fundingGoal }) => 
    <Segment piled raised style={{ margin: "30px 0" }}>
        <List size="small" horizontal relaxed>
            <List.Item>
                <List.Content>
                    <List.Header>Token Symbol</List.Header>
                    <List.Description>
                        {ticketSymbol}
                    </List.Description>
                </List.Content>
            </List.Item>
            <List.Item>
                <List.Content>
                    <List.Header>Total Available</List.Header>
                    <List.Description title={availableSupply[0]}>
                        {availableSupply[1]}
                    </List.Description>
                </List.Content>
            </List.Item>
            <List.Item>
                <List.Content>
                    <List.Header>Total Supply</List.Header>
                    <List.Description title={ticketSupply[0]}>
                        {ticketSupply[1]}
                    </List.Description>
                </List.Content>
            </List.Item>
            <List.Item>
                <List.Content>
                    <List.Header>Funding Goal</List.Header>
                    <List.Description title={fundingGoal[0]}>
                        {fundingGoal[1]}
                    </List.Description>
                </List.Content>
            </List.Item>
        </List>
    </Segment>;