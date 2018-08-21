import React, { Component } from "react";
import currentOracle, { Kiitos, BoxOffice } from "../scripts/contracts";
import { Card, Button } from "semantic-ui-react";
import Layout from "../components/Layout";

class TicketBooth extends Component {
    static async getInitialProps() {
        const kiitos = await Kiitos.deployed();
        const supply = await kiitos.totalSupply();
        const boxOffice = await BoxOffice.deployed();
        const listingFee = await boxOffice.listingFee();
        const oracle = await currentOracle;
        const usdPriceOfEth = await oracle.usdPriceOfEth();


        const totalFilms = await boxOffice.getTotalFilms();

        return {films: [...Array(totalFilms).keys()]};
    }

    airDropButton() {} // render kiitos token summary!

    shutDownBoxOfficeButton() {}

    makeFilmPage() {}

    updateFeesModal() {}

    returnPaymentModal() {}

    renderBoxOfficeStats() {}

    renderBoxOfficeMovies() {
        const items = this.props.films.map(filmIndex => {
            return {
                header: filmIndex,
                description: "hello"
            }
        });

        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <div>
                    <h3>Open Movies</h3>
                    <Button 
                        content="Create Movie"
                        icon="add circle"
                        floated="right"
                        primary
                    />
                    {this.renderBoxOfficeMovies()}
                </div>
            </Layout>
        );
    }
}

export default TicketBooth;