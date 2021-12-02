import { configureStore } from '@reduxjs/toolkit';
import bucketsReducer from './slices/buckets';
import plaidReducer from './slices/plaid';

export const store = configureStore({
  reducer: {
    bucketData: bucketsReducer,
    plaid: plaidReducer
  },
});