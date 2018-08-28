import React from "react";
import { Container, Card, Icon, Header, Label, Button } from "semantic-ui-react";
import { Link } from "../../routes";
import makeShorter from "../../utils/offchainwork";
    
const renderFilms = (films, dimPage) => 
     films.map((address, index) => 
        <Card color="brown" fluid raised key={index}>
            <Card.Content>
                <Label color="brown" ribbon="right">Featured</Label>
                <Card.Header style={{ marginTop: "-25px"}}><Header color="brown"><Icon name="film" /> {address}</Header></Card.Header>
                <Card.Meta>ERC20 Token Address</Card.Meta>
                <Card.Description>Movie tickets are ERC20 compatible!</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Link route={`/movie/${address}`}>
                    <Button onClick={event => dimPage()} color="red" fluid icon labelPosition="left">
                        <Icon name="ticket" />Buy Movie Tickets!
                    </Button>
                </Link>
            </Card.Content>
        </Card>);

export default ({ films, dimPage }) => 
    <Container>
        <Header>Film Projects in Development<Label color="brown" horizontal title={films.length}>{makeShorter(films.length)}</Label></Header>  
        <Card.Group>{renderFilms(films, dimPage)}</Card.Group>
    </Container>;