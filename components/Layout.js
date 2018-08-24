import React from "react";
import { Container } from "semantic-ui-react";
import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";

// todo: for admin functions use sidebar
// updateFees() {}  
// withdrawBoxOffice() {}
// shutDownBoxOffice() {}

export default props => {
    return (
        <Container>
            <Head>
                <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"></link>
            </Head>
            <Header {...props} />
            {props.children}
            <Footer/>
        </Container>
    );
};