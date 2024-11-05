# DSC180a_ethstates
DSC180 Final Project - Blockchain Property Platform

## Functional Local TestNet Setup

### Step 0: Entering Enviornment

```sh
cd localtestnet2
```

### Step 1: Installing Dependencies

```sh
npm install
```

### Step 2: HardHat Compilation

```sh
npx hardhat compile
```

### Step 3: Open Ganache LocalTestNet

(ensure port 8545 is open (else change url port in hardhat.config.ts file to port which shows up after running following command))

```sh
npx ganache --wallet.seed 1234
```

### Step 4: Simulating Transaction

In another terminal cd to localtestnet2 folder and run the following command to simulate a blockchain contract

```sh
npx hardhat run scripts/deploy.ts --network ganache
```

### Step 5: Results

One should see both feedback that the contract has been deployed in the second terminal as well as the contract preserved on the testnet in the ganache testnet terminal

## Realestate Smart Contract Unit Tests

### Step 0: Entering Enviornment

```sh
cd real-estate-contract
```

## Frontend Replication

### Step 0: Entering Enviroment

Go back up to the root folder and change directories into the ethstate project inside the frontend folder. Additionally, the starter app has also been hosted live as an alternative to self hosting: https://b17-blockchain-capstone.vercel.app/

```sh
cd frontend/ethstate
```
### Step 1: Installing Dependencies

```sh
npm install
```
### Step 2: Compiling Next.js App

```sh
npm run dev
```
### Step 3: Viewing Live App

The local version of the starter Next.js App should be running on http://localhost:3000
****
