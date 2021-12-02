import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useSelector } from 'react-redux';

const AddTransactionModal = ({ open, handleBucketClick, handleClose }) => {
  const buckets = useSelector(state => state.bucketData.buckets);

  return (
    <Dialog open={open}>
      <DialogTitle display="flex" justifyContent="space-between">
        Add Transaction
        <Button onClick={handleClose}><CloseIcon /></Button>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select the bucket to add the transaction to
        </DialogContentText>
        <Box display="flex" flexDirection="column" mt={1}>
          {buckets.map(bucket => (
            bucket.name !== 'All' && (
              <Button
                key={bucket.name}
                onClick={() => handleBucketClick(bucket)}
                variant="outlined"
              >
                {bucket.name}
              </Button>
            )
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

AddTransactionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleBucketClick: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default AddTransactionModal;
