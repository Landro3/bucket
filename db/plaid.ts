import { Account, Institution, Transaction } from './types';
import { getAppData, writeAppData } from './util';

export const getItems = () => {
  const data = getAppData();
  return data.plaid.items;
};

export const getItem = (itemId: string) => {
  const data = getAppData();

  return data.plaid.items.find(item => item.id === itemId);
};

export const saveItem = (
  itemId: string,
  institution: Institution,
  accounts: Account[],
  accessToken: string
) => {
  const data = getAppData();

  const newItem = {
    id: itemId,
    institution,
    accounts,
    accessToken,
    transactions: []
  };

  const index = data.plaid.items.findIndex(item => item.id === itemId);
  if (index === -1) {
    data.plaid.items.push(newItem);
  } else {
    data.plaid.items[index] = newItem;
  }

  writeAppData(data);
};

export const removeItem = (itemId: string) => {
  const data = getAppData();

  data.plaid.items = data.plaid.items.filter(item => item.id !== itemId);

  writeAppData(data);
};

export const setItemTransactions = (itemId: string, transactions: Transaction[]) => {
  const data = getAppData();

  const itemIndex = data.plaid.items.findIndex(item => item.id === itemId);
  data.plaid.items[itemIndex].transactions = transactions;

  writeAppData(data);
};

export const getErrors = () => {
  const data = getAppData();

  return data.plaid.errors;
};

export const saveError = (error: any) => {
  const data = getAppData();

  const index = data.plaid.errors.findIndex(e => e.accessToken === error.accessToken);
  if (index === -1) {
    data.plaid.errors.push(error);
  } else {
    data.plaid.errors[index] = error;
  }

  writeAppData(data);
};

export const deleteError = (accessToken: string) => {
  const data = getAppData();

  data.plaid.errors = data.plaid.errors.filter(error => error.accessToken !== accessToken);

  writeAppData(data);
};
