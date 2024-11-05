# DSC180a_ethstates
DSC180 Final Project - Blockchain Property platform

### Functional Local TestNet Setup

Step 0: Entering Enviornment

cd into localtestnet2 folder

Step 1: Installing Dependencies

```sh
npm install
```

Step 2: HardHat Compilation

```sh
npx hardhat compile
```

Step 3: Open Ganache LocalTestNet 
(ensure port 8545 (else change url port in hardhat.config.ts file to port which shows up after running following command))

```sh
npx ganache --wallet.seed 1234
```

Step 4: Simulating Transaction
In another terminal cd to localtestnet2 folder and run the following command to simulate a blockchain contract

```sh
npx hardhat run scripts/deploy.ts --network ganache
```

Step 5: Results
One should see both feedback in the second terminal as well as the contract preserved on the testnet in the ganache testnet terminal

### Realestate Smart Contract

Step 0:

### Frontend

Step 0: