import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ipcRenderer } from 'electron';

import { selectBucket, setBuckets } from '../slices/buckets';
import { setErrors, setItems } from '../slices/plaid';

import { Box } from '@mui/material';

// import Header from './Header';
import Sidebar from './Sidebar';
import Summary from './Summary';
import Transactions from './Transactions';

import ItemErrorModal from '../modals/ItemErrorModal';
import { useSelector } from 'react-redux';


const App = () => {
  const [errorModal, setErrorModal] = useState(false);

  const errors = useSelector(state => state.plaid.errors);

  const dispatch = useDispatch();

  useEffect(() => {
    const { buckets, plaid } = ipcRenderer.sendSync('loadAppData');
    dispatch(setItems(plaid.items));
    const allBucket = {
      name: 'All',
      transactions: []
    };
    dispatch(setBuckets([allBucket, ...buckets]));
    dispatch(selectBucket('All'));

    if (plaid.errors.length) {
      setErrorModal(true);
    }

    dispatch(setErrors(plaid.errors));
  }, []);

  useEffect(() => {
    if (!errors.length) {
      setErrorModal(false);
    } else {
      setErrorModal(true);
    }
  }, [errors]);

  return (
    <Box height='100%'>
      <ItemErrorModal
        open={errorModal}
        handleClose={() => setErrorModal(false)}
      />
      {/* <Header /> */}
      <Sidebar />
      <Transactions />
      <Summary />
    </Box>
  );
};

export default App;