import React, { Component } from "react";
import { Menu, Icon, Popup, Modal, Embed, Label } from "semantic-ui-react";
import { Link } from "../routes";

class Header extends Component {
    
    renderMenu() {
        if (this.props.page === "studio") {
            return (
                <Menu.Menu position="right">
                    <Popup trigger={<Menu.Item><strong>1,000 Kiitos</strong></Menu.Item>} content={<span><strong>Your Kiitos coin balance</strong>: 1,000</span>} />
                    <Popup trigger={<Menu.Item><Icon name="fly" /> FREE Airdrop<Label color="purple" floating>100</Label></Menu.Item>} content="Get 100 Kiitos coins for FREE from HeartBank!" />
                    <Popup trigger={<Menu.Item active><Icon color="grey" name="address book outline" fitted /></Menu.Item>} content={<span><strong>Your Account address</strong>: 0x0</span>} />
                </Menu.Menu>
            );
        } else if (this.props.page === "movie") {
            return (
                <Menu.Menu position="right">
                    <Link route={`/movie/${this.props.movie}/update`}><Menu.Item>Update Movie</Menu.Item></Link>
                    <Menu.Item>Withdraw Fund</Menu.Item>
                    <Popup trigger={<Menu.Item><Icon name="ticket" /> CSB Tickets<Label color="purple" floating>22</Label></Menu.Item>} content={<span><strong>Your CSGS ticket balance</strong>: 32</span>} />
                    <Popup trigger={<Menu.Item active><Icon color="grey" name="address book outline" fitted /></Menu.Item>} content={<span><strong>Your Account address</strong>: 0x0</span>} />
                </Menu.Menu>
            );
        } else if (this.props.page === "update") {

        } else if (this.props.page === "theater") {
            return (
                <Menu.Menu position="right">
                    <Menu.Item color="teal">Spend Ticket</Menu.Item>
                    <Modal trigger={<Menu.Item>Watch Movie</Menu.Item>} size="fullscreen" dimmer="blurring" basic centered>
                        <Modal.Content><Embed hd autoplay id="-j1VYBvQnxE" placeholder="https://react.semantic-ui.com/images/wireframe/image.png" source="youtube" /></Modal.Content>
                    </Modal>
                    <Popup trigger={<Menu.Item><Icon name="users" /> Audience<Label color="purple" floating>22</Label></Menu.Item>} content={<span><strong>Your CSGS ticket balance</strong>: 32</span>} />
                    <Popup trigger={<Menu.Item active><Icon color="grey" name="address book outline" fitted /></Menu.Item>} content={<span><strong>Your Account address</strong>: 0x0</span>} />
                </Menu.Menu>
            );
        }
    }

    renderStyle() {
        return <style>
            {`.rotate {
                -webkit-transform: rotate(45deg);
                -moz-transform: rotate(45deg);
                -o-transform: rotate(45deg);
                -ms-transform: rotate(45deg);
                transform: rotate(45deg);
            }`}
        </style>;
    }

    render() {
        return (
            <Menu style={{margin: "20px 0"}}>
                {this.renderStyle()}
                <Menu.Menu position="left">
                    <Popup trigger={<Menu.Item as="a" href="https://github.com/HeartBankStudio/BoxOffice" target="_blank"><Icon className="rotate" color="red" name="heart" fitted /></Menu.Item>} content="Help contribute to this open source project on GitHub!" />
                    <Link route="/"><Menu.Item active title="Go to home page" onClick={event => {if (this.props.page !== "studio") this.props.dimPage()}}><h4>HeartBank Studio</h4></Menu.Item></Link>    
                </Menu.Menu>
                {this.renderMenu()}
            </Menu>
        );
    }
}

export default Header;

