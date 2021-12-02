import { getAppData, writeAppData } from './util';

import { Bucket, Transaction } from './types';

export const createBucket = (name: string, transactions: Transaction[] | null | undefined) => {
  const data = getAppData();

  if (data.buckets.some((bucket: Bucket) => bucket.name === name)) {
    return {
      error: 'Bucket already exists'
    };
  }

  data.buckets.push({
    name,
    transactions: transactions || []
  });

  writeAppData(data);

  return {
    message: 'Bucket successfully created'
  };
};

export const deleteBucket = (name: string) => {
  const data = getAppData();

  const index = data.buckets.findIndex(bucket => bucket.name === name);

  if (index === -1) {
    return {
      error: 'Bucket does not exist'
    };
  }

  data.buckets = data.buckets.filter(bucket => bucket.name !== name);

  writeAppData(data);

  return {
    message: 'Bucket successfully deleted'
  };
};

export const addTransaction = (bucketName: string, transaction: Transaction) => {
  const data = getAppData();

  const index = data.buckets.findIndex(bucket => bucket.name === bucketName);

  if (index === -1) {
    return {
      error: 'Bucket does not exist'
    };
  }

  data.buckets[index].transactions.push(transaction);

  writeAppData(data);

  return {
    message: 'Transaction successfully added'
  };
};

export const removeTransaction = (bucketName: string, transaction: Transaction) => {
  const data = getAppData();

  const index = data.buckets.findIndex(bucket => bucket.name === bucketName);

  if (index === -1) {
    return {
      error: 'Bucket does not exist'
    };
  }

  data.buckets[index].transactions = data.buckets[index].transactions.filter(
    t => t.id !== transaction.id
  );

  writeAppData(data);

  return {
    message: 'Transaction successfully removed'
  };
};
