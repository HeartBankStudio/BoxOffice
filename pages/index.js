import React, { Component } from "react";
import web3, { Kiitos } from "../contracts";

class BoxOffice extends Component {
    async componentDidMount() {
        const kiitos = await Kiitos.deployed();
        const supply = await kiitos.totalSupply();
        console.log(supply.toNumber());
    }

    render() {
        return <div>Homepage!</div>;
    }
}

export default BoxOffice;