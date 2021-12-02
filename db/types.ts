export type Transaction = {
  id: string | null,
  accountId: string,
  accountName: string,
  amount: number,
  authorizedDate: string,
  category: string[],
  date: string,
  name: string,
  paymentChannel: string,
  paymentMeta: object,
  pending: boolean,
  pendingTransactionId: string,
  transactionId: string
}

export type Bucket = {
  name: string,
  transactions: Transaction[]
};

export type Account = {
  id: string,
  name: string,
  mask: string,
  type: string,
  subtype: string
};

export type Institution = {
  id: string,
  name: string
};

export type Item = {
  id: string,
  institution: Institution,
  accounts: Account[],
  accessToken: string,
  transactions: Transaction[]
};

export type BucketData = {
  plaid: {
    items: Item[],
    errors: any[]
  };
  buckets: Bucket[];
};