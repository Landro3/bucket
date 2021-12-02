import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { ipcRenderer } from 'electron';

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle, 
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import LinkButton from './components/LinkButton';


const ItemErrorModal = ({ open, handleClose }) => {
  const errors = useSelector(state => state.plaid.errors);

  return (
    <Dialog open={open}>
      <DialogTitle display="flex" justifyContent="space-between">
        Linked Account Errors
        <Button onClick={handleClose}><CloseIcon /></Button>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          The following linked accounts have errors and require a new login
        </DialogContentText>
        <Box mt={2}>
          {errors.map(error => {
            const { linkToken } = ipcRenderer.sendSync('getLinkUpdateToken', error.accessToken);

            return (
              <Box key={error.accessToken} display="flex" justifyContent="space-between">
                <Typography variant="body1">{error.itemName}</Typography>
                <LinkButton accessToken={error.accessToken} linkToken={linkToken} />
              </Box>
            );
          })}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

ItemErrorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ItemErrorModal;