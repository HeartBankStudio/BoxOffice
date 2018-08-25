import React, { Component } from "react";
import { Container, Divider, Modal, Button, Label, Icon, Grid } from "semantic-ui-react";
import web3 from "../scripts/contracts";

class Footer extends Component {

    state = { 
        network: null
    };

    async componentDidMount() { // to fix: causes warning 
        if (typeof web3.currentProvider !== "undefined")
            this.setState({ network: await web3.eth.net.getNetworkType() });
    }

    render() {
        return (
            <Container textAlign="center" style={{ margin: "40px 0" }}>
                <Divider/>
                <Grid columns='equal'>
                    <Grid.Column>
                        <Modal open={this.state.network !== "private" && this.state.network !== "rinkeby"} basic size="small" centered>
                            <h2>Please install Metamask and connect to the Rinkeby network.</h2>
                            <Modal.Content style={{textAlign: "center"}}>
                                <Button as="a" color="orange" inverted href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">Get Metamask Extension</Button>
                            </Modal.Content>
                        </Modal>
                    </Grid.Column>
                    <Grid.Column>
                        <small>HeartBank &copy; 2018</small>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <Label size="mini" color="grey" as="a" horizontal onClick={event => this.props.toggleSidebar()}><Icon name="user outline" /> Admin</Label>
                    </Grid.Column>
                </Grid>    
            </Container>
        );
    }
}

export default Footer;