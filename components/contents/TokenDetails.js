import React from "react";
import { Segment, List } from "semantic-ui-react";

export default () => 
    <Segment piled raised style={{ margin: "30px 0" }}>
        <List size="small" horizontal relaxed>
            <List.Item>
                <List.Content>
                    <List.Header>Token Symbol</List.Header>
                    <List.Description>
                        CSB
                    </List.Description>
                </List.Content>
            </List.Item>
            <List.Item>
                <List.Content>
                    <List.Header>Total Available</List.Header>
                    <List.Description>
                        3,243,234
                    </List.Description>
                </List.Content>
            </List.Item>
            <List.Item>
                <List.Content>
                    <List.Header>Total Supply</List.Header>
                    <List.Description>
                        1,000,000
                    </List.Description>
                </List.Content>
            </List.Item>
            <List.Item>
                <List.Content>
                    <List.Header>Funding Goal</List.Header>
                    <List.Description>
                        $4,354,235
                    </List.Description>
                </List.Content>
            </List.Item>
        </List>
    </Segment>;