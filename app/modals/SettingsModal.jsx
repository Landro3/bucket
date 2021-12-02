import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import Accounts from './components/Accounts';

const SettingsModal = ({ open, handleClose }) => {
  const [tab, setTab] = useState('accounts');
  
  const handleAccounts = () => {
    setTab('accounts');
  };

  // const handleSomethingElse = () => {
  //   setTab('something else');
  // };

  return (
    <Dialog maxWidth="md" open={open} fullWidth>
      <DialogTitle display="flex" justifyContent="space-between">
        Settings
        <Button onClick={handleClose}><CloseIcon /></Button>
      </DialogTitle>
      <Divider variant="middle" />
      <DialogContent sx={{ display: 'flex', flexDirection: 'row', height: '500px' }}>
        <Box
          display="flex"
          flexDirection="column"
          flexShrink="0"
          width="175px"
        >
          <Button
            onClick={handleAccounts}
            variant={tab === 'accounts' ? 'contained' : 'text'}
          >
            <Box width="100%" textAlign="left">
              Accounts
            </Box>
          </Button>
          {/* <Button
            onClick={handleSomethingElse}
            variant={tab === 'something else' ? 'contained' : 'text'}
          >
            <Box width="100%" textAlign="left">Something Else</Box>
          </Button> */}
        </Box>
        <Box
          width="800px"
          ml="1rem"
          paddingX="1rem"
        >
          {tab === 'accounts' && <Accounts />}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

SettingsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default SettingsModal;
