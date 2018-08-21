import React from "react";
import { Menu } from "semantic-ui-react";

export default () => {
    return (
        <Menu style={{marginTop: "20px"}}>
            <Menu.Item>HeartBank</Menu.Item>

            <Menu.Menu position="right">
                <Menu.Item>Movies</Menu.Item>
                <Menu.Item>+</Menu.Item>
            </Menu.Menu>
        </Menu>
    );
};