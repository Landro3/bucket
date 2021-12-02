import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePlaidLink } from 'react-plaid-link';

import { ipcRenderer } from 'electron';

import { addItem, removeItem } from '../../slices/plaid';

import {
  Box,
  Button,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

const Accounts = () => {
  const [config, setConfig] = useState({});

  const dispatch = useDispatch();

  const { open, ready } = usePlaidLink(config);

  const items = useSelector(state => state.plaid.items);

  useEffect(() => {
    const { linkToken, error } = ipcRenderer.sendSync('getLinkToken');
    if (error) {
      // TODO error modal
    }

    const onSuccess = (public_token, metadata) => {
      const { item, error } = ipcRenderer.sendSync('postExchange', [public_token, metadata]);
      if (error) {
        // TODO: do something
      }
      dispatch(addItem(item));
    };

    setConfig({
      onSuccess,
      onExit: (err, metadata) => console.log({ err, metadata }),
      onEvent: (eventName, metadata) => console.log({ eventName, metadata }),
      token: linkToken
    });
  }, []);

  const handleItemRemove = (itemId) => {
    const { error } = ipcRenderer.sendSync('deleteItem', itemId);

    if (error) {
      // TODO: do something
      console.log(error);
    }

    dispatch(removeItem(itemId));
  };

  return (
    <Box>
      <Typography variant="h5">Linked Accounts</Typography>
      {!items.length && <Typography mt="1rem" ml={1} variant="subtitle1">Add accounts to get their transactions</Typography>}
      {!!items.length && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Institution</TableCell>
                <TableCell>Accounts</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.institution.name}</TableCell>
                  <TableCell>
                    {item.accounts.map((account) => (
                      <Box key={account.id}>
                        {account.name}
                        <br />
                      </Box>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleItemRemove(item.id)} color="error">Unlink</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Button onClick={() => open()} disabled={!ready} variant="contained" sx={{ marginTop: '1rem' }}>
        Add Account
      </Button>
    </Box>
  );
};

export default Accounts;