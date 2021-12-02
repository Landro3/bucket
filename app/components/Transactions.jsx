import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ipcRenderer } from 'electron';
import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';

import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

import AddTransactionModal from '../modals/AddTransactionModal';

import { addTransaction, removeTransaction } from '../slices/buckets';


const Transactions = () => {
  const [addModal, setAddModal] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const selectedBucket = useSelector(state => state.bucketData.selectedBucket);
  const items = selectedBucket === 'All' ? useSelector(state => state.plaid.items) : null;
  const bucket = selectedBucket !== 'All' ? useSelector(
    state => state.bucketData.buckets.find(bucket => bucket.name === selectedBucket)
  ) : null;

  const dispatch = useDispatch();

  useEffect(() => {
    const transactions = [];
    if (selectedBucket === 'All') {
      items.forEach(item => item.transactions.forEach(transaction => transactions.push(transaction)));
    } else if (bucket) {
      bucket.transactions.forEach(transaction => transactions.push(transaction));
    }
   
    transactions.sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());
    setTransactions(transactions);
  }, [items, bucket, selectedBucket]);

  const handleAddToBucket = (transaction) => {
    setTransaction(transaction);
    setAddModal(true);
  };

  const handleTransactionRemove = (transaction) => {
    const { error } = ipcRenderer.sendSync('removeTransaction', [bucket, transaction]);

    if (error) {
      // TODO: error modal
      console.log(error);
    }

    dispatch(
      removeTransaction({ bucketName: bucket.name, transaction })
    );
  };

  const handleBucketClick = (bucket) => {
    const t = {
      ...transaction,
      id: uuid()
    };

    const { error } = ipcRenderer.sendSync('postTransaction', [bucket, t]);

    if (error) {
      // TODO: error modal
    }

    dispatch(
      addTransaction({
        bucketName: bucket.name,
        transaction: t
      })
    );

    setTransaction(null);
    setAddModal(false);
  };

  const handleAddModalClose = () =>  {
    setAddModal(false);
    setTransaction(null);
  };

  return (
    <>
      <AddTransactionModal
        open={addModal}
        handleClose={handleAddModalClose}
        handleBucketClick={handleBucketClick} 
        transaction={transaction}
      />
      <Box
        position="fixed"
        display="flex"
        flexDirection="column"
        left="300px"
        top="30px"
        right="0"
        bottom="250px"
        m={2}
        sx={{ overflowY: 'auto' }}
      >
        <Typography variant="h4">{selectedBucket} Transactions</Typography>
        {selectedBucket === 'All' && (
          <Typography color="gray">Transactions from all linked accounts, add these to other buckets</Typography>
        )}
        {selectedBucket !== 'All' && (
          <Typography color="gray">Transactions in the bucket {selectedBucket}</Typography>
        )}

        {!!transactions.length && (
          <TableContainer sx={{ flexGrow: 1 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Account</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map(transaction => (
                  <TableRow key={transaction.id || transaction.transactionId}>
                    <TableCell>{dayjs(transaction.date).format('MM/DD/YYYY')}</TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>{transaction.name}</TableCell>
                    <TableCell>{transaction.accountName}</TableCell>
                    {selectedBucket === 'All' && (
                      <TableCell>
                        <Button onClick={() => handleAddToBucket(transaction)}>Add to Bucket</Button>
                      </TableCell>
                    )}
                    {selectedBucket !== 'All' && (
                      <TableCell>
                        <Button onClick={() => handleTransactionRemove(transaction)} color="error">Remove</Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </>
  );
};

export default Transactions;
