import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ipcRenderer } from 'electron';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';

import Bucket from './Bucket';
import AddBucketModal from '../modals/AddBucketModal';

import { selectBucket, deleteBucket } from '../slices/buckets';
import SettingsModal from '../modals/SettingsModal';

const Sidebar = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [settingModalOpen, setSettingModalOpen] = useState(false);
  const dispatch = useDispatch();
  const buckets = useSelector(state => state.bucketData.buckets);
  const selectedBucket = useSelector(state => state.bucketData.selectedBucket);

  const handleBucketClick = (bucketName) => {
    dispatch(selectBucket(bucketName));
  };

  const handleBucketClose = (bucketName) => {
    // TODO: confirmation modal
    const { error } = ipcRenderer.sendSync('deleteBucket', { name: bucketName });

    if (error) {
      // TODO: Error modal
    }

    dispatch(deleteBucket(bucketName));
  };

  return (
    <>
      <AddBucketModal
        open={addModalOpen}
        handleClose={() => setAddModalOpen(false)}
      />
      <SettingsModal
        open={settingModalOpen}
        handleClose={() => setSettingModalOpen(false)}
      />
      <Stack
        position='fixed'
        top='30px'
        left='0'
        bottom='0'
        width='300px'
        bgcolor='#1d2a40'
        sx={{ overflowY: 'auto' }}
      >
        <Box display='flex'>
          <Typography p={1} variant="h6" color="white" flexGrow={1}>Buckets</Typography>
          <Button onClick={() => setSettingModalOpen(true)}>
            <SettingsIcon color="light" size="large" variant="outlined" />
          </Button>
        </Box>
        <Stack>
          {buckets.map((bucket) => (
            <Bucket
              key={bucket.name}
              name={bucket.name}
              handleClick={() => handleBucketClick(bucket.name)}
              handleClose={bucket.name === 'All' ? undefined : () => handleBucketClose(bucket.name)}
              selected={selectedBucket === bucket.name}
            />
          ))}
        </Stack>
        <Box
          height='100%'
          m={3}
          display='flex'
          alignItems='flex-end'
          justifyContent='flex-end'
        >
          <Fab color="secondary" size="medium" onClick={() => setAddModalOpen(true)}>
            <AddIcon />
          </Fab>
        </Box>
      </Stack>
    </>
  );
};

export default Sidebar;