import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { ipcRenderer } from 'electron';

import { useDispatch } from 'react-redux';
import { addBucket } from '../slices/buckets';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  TextField
} from '@mui/material';

const AddBucketModal = ({ open, handleClose }) => {
  const [error, setError] = useState(null);
  const [bucketName, setBucketName] = useState('');

  const dispatch = useDispatch();

  const handleKeyUp = (e) => {
    if (e.key.toLowerCase() === 'enter' || e.key.toLowerCase() === 'return') {
      handleCreate();
    }
  };

  const handleCreate = () => {
    if (!bucketName) {
      setError('No bucket name provided');
      return;
    }

    if (bucketName.toLowerCase() === 'all') {
      setError('Bucket name already exists');
      return;
    }

    const { error } = ipcRenderer.sendSync('postBucket', { name: bucketName });
    if (error) {
      setError(error);
      return;
    }

    setError(null);
    setBucketName(null);
    dispatch(addBucket({ name: bucketName }));
    handleClose();
  };

  const handleCancel = () => {
    setError(null);
    setBucketName('');
    handleClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Create Bucket</DialogTitle>
      <DialogContent>
        <DialogContentText mb={2}>
          Create a bucket that you would like to organize transactions into
        </DialogContentText>
        <TextField
          label="Bucket Name"
          onChange={(e) => setBucketName(e.target.value)}
          onKeyUp={handleKeyUp}
          autoFocus
          fullWidth
        />
        {error && <FormHelperText ml={1} error>{error}</FormHelperText>}
        <DialogActions>
          <Button onClick={handleCancel} variant="outlined" sx={{ mr: 1 }}>Cancel</Button>
          {/* TODO: add loading button */}
          <Button onClick={handleCreate} type="submit" variant="contained">Create</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

AddBucketModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddBucketModal;