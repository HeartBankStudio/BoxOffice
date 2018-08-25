import React, { Component } from "react";
import { Container, Sidebar, Menu, Icon } from "semantic-ui-react";
import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";

class Layout extends Component {
    state = {
        visible: false
    };

    toggleSidebar = () => this.setState({ visible: !this.state.visible });

    render() {
        return (
            <Sidebar.Pushable>
                <Sidebar.Pusher>
                    <Container>
                        <Head>
                            <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"></link>
                        </Head>
                        <Header {...this.props} />
                        {this.props.children}
                        <Footer toggleSidebar={this.toggleSidebar} />
                    </Container>
                </Sidebar.Pusher>
                <Sidebar direction="top" as={Menu} animation="overlay" icon="labeled" size="massive" color="red" inverted vertical visible={this.state.visible}>
                    <Menu.Item as='a'>
                        <Icon name="heart outline" />Donate to Charity
                    </Menu.Item>
                    <Menu.Item as='a'>
                        <Icon name="dollar" />Update Fees
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