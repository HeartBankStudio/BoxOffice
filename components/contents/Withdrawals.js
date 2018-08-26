import React from "react";
import { Container, Table, Button, Header } from "semantic-ui-react";
import { toEther } from "../../scripts/offchainwork";

const returnDate = time => {
    const date = new Date(time);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

const renderWithdrawals = (movie, withdrawals) => 
    withdrawals.filter(withdrawal => withdrawal.movie === movie)
        .map((withdrawal, index) => 
            <Table.Row key={index}>
                <Table.Cell>{returnDate(withdrawal.date)}</Table.Cell>
                <Table.Cell>{withdrawal.recipient}</Table.Cell>
                <Table.Cell>{toEther(withdrawal.amount)}</Table.Cell>
                <Table.Cell>{withdrawal.expense}</Table.Cell>
            </Table.Row>);

export default ({ movie, fund, withdrawals }) => 
    <Container>
        <Button content="Fund Balance" active label={{ content: fund }} labelPosition="right" floated="right" style={{ marginTop: "-10px" }} />
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