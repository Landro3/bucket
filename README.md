# Bucket
Customized Transaction Organization

This app works with [Plaid](https://plaid.com/) and is written on top of the [Electron Framework](https://www.electronjs.org/) to provide a cross-platform desktop application that enables users to access their financial transactions and organize them into buckets they create!

### Some tools used in this project
- React
- Redux
- Typescript
- Material UI
- ChartJS

### Getting Started
NOTE: Plaid API keys are needed for this app to work in a development environment, reach out to me for them if you want to contribute!
1. Clone repo and install node modules.
2. This app is back into development only, add an env with the following data
```
PLAID_CLIENT_ID=<client-id>
PLAID_PUBLIC_KEY=<public-key>
PLAID_SECRET=<secret-key>
```
3. Run `yarn start`

### Additional Notes
- Run `yarn dist` to build distribution files.
- I created the webpack configuration for style loaders, typescript support in the electrton main file, and bundle creation
- The package electron-builder is used for creating the distribution files
