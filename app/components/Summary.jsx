import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import dayjs from 'dayjs';

import { Box, Typography } from '@mui/material';
import { Chart } from 'chart.js';

const Summary = () => {
  const [chart, setChart] = useState(null);
  const [bucketTotal, setBucketTotal] = useState(0);

  const selectedBucket = useSelector(state => state.bucketData.selectedBucket);
  const items = selectedBucket === 'All' ? useSelector(state => state.plaid.items) : null;
  const bucket = selectedBucket !== 'All' ? useSelector(
    state => state.bucketData.buckets.find(bucket => bucket.name === selectedBucket)
  ) : null;

  useEffect(() => {
    if (chart) { chart.destroy(); }
    setBucketTotal(0);

    const transactions = [];
    if (selectedBucket === 'All') {
      items.forEach(item => item.transactions.forEach(transaction => transactions.push(transaction)));
    } else if (bucket) {
      bucket.transactions.forEach(transaction => transactions.push(transaction));
    }
   
    if (!transactions.length) {
      const emptyChartConfig = {
        type: 'line',
        data: {},
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      };
      setChart(new Chart(document.getElementById('line').getContext('2d'), emptyChartConfig));
      return;
    }

    transactions.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());

    const data = [];
    const labels = [];
    let currentDay = dayjs(transactions[0].date);
    let dayTotal = 0;
    let bucketTotal = 0;
    for (let transaction of transactions) {
      if (dayjs(transaction.date).isSame(currentDay, 'day')) {
        dayTotal += transaction.amount;
      } else {
        data.push(dayTotal);
        labels.push(currentDay.format('MMM DD'));
        currentDay = dayjs(transaction.date);
        dayTotal = transaction.amount;
      }
      bucketTotal += transaction.amount;
    }
    
    if (dayTotal) {
      data.push(dayTotal);
      labels.push(currentDay.format('MMM DD'));
    }

    setBucketTotal(bucketTotal);

    const dataConfig = {
      labels,
      datasets: [{
        label: selectedBucket,
        backgroundColor: '#31BC0E',
        borderColor: '#1d2a40',
        data,
        tension: 0.25
      }]
    };

    const chartConfig = {
      type: 'line',
      data: dataConfig,
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    };

    setChart(new Chart(document.getElementById('line').getContext('2d'), chartConfig));
  }, [items, bucket, selectedBucket]);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      position="fixed"
      right="0"
      left="300px"
      bottom="0"
      height="250px"
      p={2}
    >
      <Box>
        <Box display="flex" width="50%">
          <Typography variant="h5"><b>Total: </b></Typography>
          <Typography variant="h5" ml={1}>${bucketTotal.toFixed(2)}</Typography>
        </Box>
      </Box>
      <Box height="100%" width="50%">
        <canvas id="line" />
      </Box>
    </Box>
  );
};

export default Summary;