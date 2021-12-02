import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material';
import { Chart, registerables } from 'chart.js';

import { store } from './store';
import { theme } from './theme';

import dotenv from 'dotenv';

import App from './components/App';

dotenv.config();

Chart.register(...registerables);

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('app')
);