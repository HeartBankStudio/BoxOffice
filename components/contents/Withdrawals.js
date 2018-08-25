import React from "react";
import { Container, Table, Button, Header } from "semantic-ui-react";
import web3 from "../../scripts/contracts";

const renderWithdrawals = (movie, withdrawals) => 
    withdrawals.filter(withdrawal => withdrawal.movie === movie)
        .map((withdrawal, index) => 
            <Table.Row key={index}>
                <Table.Cell>{index}</Table.Cell>
                <Table.Cell>{withdrawal.recipient}</Table.Cell>
                <Table.Cell>{web3.utils.fromWei(withdrawal.amount.toString(), "ether")}</Table.Cell>
                <Table.Cell>{withdrawal.expense}</Table.Cell>
            </Table.Row>);

export default ({movie, withdrawals}) => 
    <Container>
        <Button content="Fund Balance" active label={{ content: "$34,234" }} labelPosition="right" floated="right" style={{ marginTop: "-10px" }} />
        <Header>Withdrawal History</Header>
        <Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell>Recipient</Table.HeaderCell>
                    <Table.HeaderCell>Amount in Ether</Table.HeaderCell>
                    <Table.HeaderCell>Description of Expense</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {renderWithdrawals(movie, withdrawals)}
            </Table.Body>
        </Table>
    </Container>;