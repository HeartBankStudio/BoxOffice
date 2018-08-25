import React from "react";
import { Segment, List } from "semantic-ui-react";

const renderAudienceMembers = members => 
    members.map((member, index) => 
        <List.Item as="a" key={index}>
            <List.Icon color="brown" name="user circle" /> 
            {member}
        </List.Item>
    );

export default ({ members }) =>
    <Segment padded raised piled>
        <List divided relaxed="very" horizontal link>
            {renderAudienceMembers(members)}
        </List>
    </Segment>;
