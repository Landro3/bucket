import { app, BrowserWindow, ipcMain, Menu, MenuItemConstructorOptions } from "electron";
import path from 'path';
import {
  Configuration,
  CountryCode,
  ItemPublicTokenExchangeRequest,
  LinkTokenCreateRequest,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from 'plaid';

import dayjs from "dayjs";
import dotenv from 'dotenv';

import { addTransaction, createBucket, deleteBucket, removeTransaction } from './db/buckets';
import { setItemTransactions, deleteError, getErrors, getItem, getItems, removeItem, saveError, saveItem } from './db/plaid';
import { getAppData } from "./db/util";
import { Account, Institution, Transaction } from "./db/types";

dotenv.config();

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    }
  }
});

const plaidApi = new PlaidApi(configuration);

const createWindow = () => {
  const isMac = process.platform === 'darwin';

  const template: MenuItemConstructorOptions[] = [
    {
      label: 'Bucket',
      submenu: [
        { role: 'quit' }
      ]
    },
    {
      label: 'File',
      submenu: [
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 750,
    // titleBarStyle: 'hidden',
    webPreferences: {
      plugins: true,
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'public', 'index.html'));
  // mainWindow.webContents.openDevTools();
};

app.on('ready', async () => {
  // const data = getAppData();
  // if (data.plaid.items[0]) {
  //   await plaidApi.sandboxItemResetLogin({
  //     access_token: data.plaid.items[0].accessToken
  //   });
  // }
  await refreshTransactions();
  createWindow();
});

ipcMain.on('loadAppData', (e) => {
  const data = getAppData();

  e.returnValue = {
    buckets: data.buckets,
    plaid: data.plaid
  };
});

ipcMain.on('getPlaidErrors', (e) => {
  e.returnValue = { errors: getErrors() };
});

ipcMain.on('removePlaidError', (_e, accessToken) => {
  deleteError(accessToken);
});

ipcMain.on('postBucket', (e, args) => {
  const { name, transactions } = args;

  const result = createBucket(name, transactions);

  if (result.error) {
    e.returnValue = { error: result.error };
    return;
  }

  e.returnValue = { message: result.message };
});

ipcMain.on('deleteBucket', (e, args) => {
  const { name } = args;
  
  const result = deleteBucket(name);

  if (result.error) {
    e.returnValue = { error: result.error };
    return;
  }

  e.returnValue = { message: result.message };
});

ipcMain.on('postTransaction', (e, args) => {
  const bucket = args[0];
  const transaction = args[1];

  const result = addTransaction(bucket.name, transaction);

  if (result.error) {
    e.returnValue = { error: result.error };
    return;
  }

  e.returnValue = { message: result.message };
});

ipcMain.on('removeTransaction', (e, args) => {
  const bucket = args[0];
  const transaction = args[1];

  const result = removeTransaction(bucket.name, transaction);

  if (result.error) {
    e.returnValue = { error: result.error };
    return;
  }

  e.returnValue = { message: result.message };
});

ipcMain.on('getLinkToken', async (e) => {
  const request: LinkTokenCreateRequest = {
    user: {
      client_user_id: 'sandbox'
    },
    client_name: 'Bucket',
    products: [Products.Auth, Products.Transactions],
    country_codes: [CountryCode.Us],
    language: 'en'
  };

  try {
    const response = await plaidApi.linkTokenCreate(request);

    e.returnValue = {
      linkToken: response.data.link_token
    };
  } catch (error) {
    e.returnValue = { error };
  }
});

ipcMain.on('getLinkUpdateToken', async (e, args) => {
  const request: LinkTokenCreateRequest = {
    user: {
      client_user_id: 'sandbox'
    },
    client_name: 'Bucket',
    country_codes: [CountryCode.Us],
    language: 'en',
    access_token: args
  };

  try {
    const response = await plaidApi.linkTokenCreate(request);

    e.returnValue = {
      linkToken: response.data.link_token
    };
  } catch (error) {

    console.log(error);
    e.returnValue = { error };
  }
});

ipcMain.on('postExchange', async (e, args) => {
  const publicToken = args[0];
  const metadata = args[1];

  const request: ItemPublicTokenExchangeRequest = {
    public_token: publicToken
  };

  try {
    const response = await plaidApi.itemPublicTokenExchange(request);
    const { access_token, item_id } = response.data;

    const institution: Institution = {
      id: metadata.institution.institution_id,
      name: metadata.institution.name
    };

    saveItem(item_id, institution, metadata.accounts, access_token);

    const { transactions, error } = await getPlaidTransactions(access_token, metadata.accounts);

    if (error) {
      // TODO: do something?
    }

    setItemTransactions(item_id, transactions);

    e.returnValue = {
      item: {
        id: item_id,
        institution: {
          id: metadata.institution.id,
          name: metadata.institution.name,
        },
        accounts: metadata.accounts,
        transactions
      }
    };
  } catch (error) {
    e.returnValue = { error };
  }
});

ipcMain.on('deleteItem', async (e, args) => {
  const itemId = args;

  const item = getItem(itemId);

  try {
    await plaidApi.itemRemove({ access_token: item.accessToken });
    removeItem(itemId);
    e.returnValue = { message: 'Item successfully removed' };
  } catch(error) {
    e.returnValue = { error };
  }
});

const getPlaidTransactions = async (accessToken: string, itemAccounts: Account[]) => {
  try {
    const startDate = dayjs().subtract(32, 'day').format('YYYY-MM-DD');
    const endDate = dayjs().format('YYYY-MM-DD');

    const response = await plaidApi.transactionsGet({
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
    });
    
    const transactions = response.data.transactions;
    
    // Paginated response
    const totalTransactions = response.data.total_transactions;
    while (transactions.length < totalTransactions) {
      const paginatedResponse = await plaidApi.transactionsGet({
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
        options: {
          offset: transactions.length
        }
      });
      transactions.push(...paginatedResponse.data.transactions);
    }

    const accountMap = {};
    itemAccounts.forEach(account => {
      accountMap[account.id] = account.name;
    });

    const bucketTransactions: Transaction[] = transactions.map(t => ({
      id: null,
      accountId: t.account_id,
      accountName: accountMap[t.account_id],
      amount: t.amount,
      authorizedDate: t.authorized_date,
      category: t.category,
      date: t.date,
      name: t.name,
      paymentChannel: t.payment_channel,
      paymentMeta: t.payment_meta,
      pending: t.pending,
      pendingTransactionId: t.pending_transaction_id,
      transactionId: t.transaction_id,
    }));

    return { transactions: bucketTransactions };
  } catch (error) {
    return { error };
  }
};

const refreshTransactions = async () => {
  const items = getItems();
  for (const item of items) {
    const { transactions, error } = await getPlaidTransactions(item.accessToken, item.accounts);
    
    if (error) { 
      saveError({
        ...error.response.data,
        accessToken: item.accessToken,
        itemName: item.institution.name
      }); 
    }
    if (transactions) { setItemTransactions(item.id, transactions); }
  }
};
