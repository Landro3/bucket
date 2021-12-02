import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { ipcRenderer } from 'electron';

import { Button } from '@mui/material';

import { addItem, removeError } from '../../slices/plaid';
import { usePlaidLink } from 'react-plaid-link';

const LinkButton = ({ accessToken, linkToken }) => {
  const dispatch = useDispatch();

  const onSuccess = (public_token, metadata) => {
    const { item, error } = ipcRenderer.sendSync('postExchange', [public_token, metadata]);
    if (error) {
      // TODO: do something
    }

    dispatch(addItem(item));
    
    dispatch(removeError(accessToken));
    ipcRenderer.send('removePlaidError', accessToken);
  };

  const config = {
    onSuccess,
    onExit: (err, metadata) => console.log({ err, metadata }),
    onEvent: (eventName, metadata) => console.log({ eventName, metadata }),
    token: linkToken
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <Button onClick={() => open()} disabled={!ready} variant="contained">
      Update
    </Button>
  );
};

LinkButton.propTypes = {
  accessToken: PropTypes.string,
  linkToken: PropTypes.string
};

export default LinkButton;