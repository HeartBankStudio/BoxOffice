import React, { Component } from "react";
import { Container, Sidebar, Menu, Icon, Message } from "semantic-ui-react";
import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import { clientWeb3 as web3 } from "../scripts/web3";

class Layout extends Component {
    state = {
        network: null,
        visible: false
    };

    toggleSidebar = () => this.setState({ visible: !this.state.visible });

    async componentDidMount() { // to fix: causes warning 
        if (typeof web3.currentProvider !== "undefined")
            this.setState({ network: await web3.eth.net.getNetworkType() });
    }

    render() {
        return (
            <Sidebar.Pushable>
                <Sidebar.Pusher>
                    <Container>
                        <Head>
                            <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"></link>
                        </Head>
                        <Message style={{ marginTop: "20px", textAlign: "center" }} color="orange" hidden={this.state.network === null || this.state.network === "private" || this.state.network === "rinkeby"}>
                            <p>Please <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">install Metamask</a> and connect to the <strong>Rinkeby network</strong>.</p>
                        </Message>
                        <Header {...this.props} />
                        {this.props.children}
                        <Footer toggleSidebar={this.toggleSidebar} feesCollected={this.props.feesCollected}/>
                    </Container>
                </Sidebar.Pusher>
                <Sidebar direction="top" as={Menu} animation="overlay" icon="labeled" size="massive" color="red" inverted vertical visible={this.state.visible}>
                    <Menu.Item as='a'>
                        <Icon name="heart outline" />Donate to Charity
                    </Menu.Item>
                    <Menu.Item as='a'>
                        <Icon name="tag" />Update Fees
                    </Menu.Item>
                    <Menu.Item as='a'>
                        <Icon name="payment" />Return Excess Payment
                    </Menu.Item>
                    <Menu.Item as='a'>
                        <Icon name="window close outline" />Shut Down
                    </Menu.Item>
                    <Menu.Item as='a' onClick={event => this.toggleSidebar()}>
                        <Icon name="arrow alternate circle up outline" />Close Menu
                    </Menu.Item>
                </Sidebar>    
            </Sidebar.Pushable>
        );
    }
}

export default Layout;