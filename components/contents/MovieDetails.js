import React from "react";
import { Card, Header, Icon, Image, Label } from "semantic-ui-react";

const returnDate = time => {
    const date = new Date(time);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

export default ({ movie, createdTime, filmmaker, movieName, logline, poster }) => 
    <Card color="brown" fluid raised>
        <Image src={`https://ipfs.infura.io/ipfs/${poster}`} fluid />
        <Card.Content>
            <Label color="brown" corner="left"><Icon name="hotjar" /></Label>
            <Card.Header><Header color="brown">{movieName}</Header></Card.Header>
            <Card.Meta>{filmmaker}</Card.Meta>
            <Card.Description><em>{logline}</em><p style={{ fontSize: "x-small", marginTop: "15px" }}>{movie}</p></Card.Description>
        </Card.Content>
        <Card.Content extra>
            <strong>Crowd Saled On</strong>: {returnDate(createdTime)}
        </Card.Content>
    </Card>;