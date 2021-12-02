import { app } from 'electron';
import fs from 'fs';
import path from 'path';

import { BucketData } from './types';

const appDataPath = path.join(app.getPath('appData'), 'bucket', 'data.json');

export const getAppData = () => {
  if (!fs.existsSync(appDataPath)) {
    const initialData: BucketData = {
      plaid: {
        items: [],
        errors: []
      },
      buckets: [],
    };
    fs.appendFileSync(appDataPath, JSON.stringify(initialData));
  }

  const fileContents = fs.readFileSync(
    appDataPath,
    { encoding: 'utf-8' }
  );

  return JSON.parse(fileContents) as BucketData;
};

export const writeAppData = (data: BucketData) => {
  fs.writeFileSync(appDataPath, JSON.stringify(data));
};