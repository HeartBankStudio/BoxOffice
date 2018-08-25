import React from "react";
import { Card, Header, Icon, Image, Label } from "semantic-ui-react";

export default ({ movie, filmmaker, title, logline, poster }) => 
    <Card color="brown" fluid raised>
        <Image src="https://react.semantic-ui.com/images/wireframe/image.png" fluid />
        <Card.Content>
            <Label color="brown" corner="left"><Icon name="hotjar" /></Label>
            <Card.Header><Header color="brown">{title}</Header></Card.Header>
            <Card.Meta>{movie}</Card.Meta>
            <Card.Description><em>{logline}</em><p style={{ fontSize: "x-small", marginTop: "15px" }}>{filmmaker}</p></Card.Description>
        </Card.Content>
        <Card.Content extra>
            <strong>Crowd Saled On</strong>: June 2, 2018
        </Card.Content>
    </Card>;