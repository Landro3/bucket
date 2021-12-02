import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  errors: []
};

export const plaidSlice = createSlice({
  name: 'plaid',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);

      if (index === -1) {
        state.items.push(action.payload);
      } else {
        state.items[index] = action.payload;
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    removeError: (state, action) => {
      state.errors = state.errors.filter(error => error.accessToken !== action.payload);
    }
  },
});

export const { addItem, removeItem, setItems, setErrors, removeError } = plaidSlice.actions;

export default plaidSlice.reducer;