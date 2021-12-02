import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedBucket: '',
  buckets: [],
};

export const bucketSlice = createSlice({
  name: 'buckets',
  initialState,
  reducers: {
    selectBucket: (state, action) => {
      state.selectedBucket = action.payload;
    },
    addBucket: (state, action) => {
      const { name, transactions } = action.payload;
      state.buckets.push({
        name: name,
        transactions: transactions || []
      });
    },
    deleteBucket: (state, action) => {
      state.buckets = state.buckets.filter(bucket => bucket.name !== action.payload);
      if (action.payload === state.selectedBucket) {
        state.selectedBucket = '';
      }
    },
    addTransaction: (state, action) => {
      const { bucketName, transaction } = action.payload;
      const index = state.buckets.findIndex(bucket => bucket.name === bucketName);
      state.buckets[index].transactions.push(transaction);
    },
    removeTransaction: (state, action) => {
      const { bucketName, transaction } = action.payload;
      const index = state.buckets.findIndex(bucket => bucket.name === bucketName);

      console.log({ transaction });

      state.buckets[index].transactions = state.buckets[index].transactions.filter(
        t => t.id !== transaction.id
      );
    },
    setBuckets: (state, action) => {
      state.buckets = action.payload;
    },
    setTransactions: (state, action) => {
      const { bucketName, transactions } = action.payload;
      const index = state.buckets.findIndex(bucket => bucket.name === bucketName);
      state.buckets[index].transactions = transactions;
    }
  }
});

export const {
  selectBucket,
  addBucket,
  deleteBucket,
  addTransaction,
  removeTransaction,
  setBuckets,
  setTransactions
} = bucketSlice.actions ;

export default bucketSlice.reducer;