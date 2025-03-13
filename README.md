# DSC180B-PropChain
DSC180B Final Project - PropChain: A Blockchain-Based Framework for Automated
Property Transfers and Smart Contract Integration

## Team and Mentor
Mentor: Professor Rajesh Gupta

Team: 
- Dhruv Kanetkar
- Ish Patel
- Raghava Bandla

## Live Project Link
https://b17-blockchain-capstone-q2.vercel.app/

## Project Report Website
https://dhruvk0.github.io/propchain_project_website/

## Artifact Repository
https://github.com/DhruvK0/artifact-directory-b17

## Project Requirements

Node v20+

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

## Deploying Smart Contracts

### Prerequisites

To run this project, ensure you have the following dependencies installed:

- **Node.js** (v14 or higher/Check their website)
- **npm**
```sh
npm install
```
- **Hardhat** - Ethereum development environment
- **Ethers.js** - Library to interact with the Ethereum blockchain
```sh
npm install --save-dev hardhat ethers
```
- **OpenZeppelin** - Open source contract library
```sh
npm install @openzeppelin/contracts
```

## Real Estate Token Contract

In one terminal window run the following commands

### Step 1: Entering Environment

```sh
cd real-estate-contract
```

### Step 2: Creating Local Network
```sh
npx hardhat node
```

Once the local network is up and runnning, navigate to a new terminal window inside the `real-estate-contract` directory

### Step 3: Deploying Contract
```sh
npx hardhat run scripts/deploy.js --network localhost
```

The real estate contract is deployed now.

## Prop Token Contract

In one terminal window run the following commands

### Step 1: Entering Environment

```sh
cd prop-token-contracts
```

### Step 2: Creating Local Network
```sh
npx hardhat node
```

Once the local network is up and runnning, navigate to a new terminal window inside the prop-token-contracts directory

### Step 3: Deploying Contract
```sh
npx hardhat run scripts/deploy.js --network localhost
```

The prop token contract is deployed now.

## Frontend Replication

### Step 0: Entering Enviroment

Go back up to the root folder and change directories into the ethstate project inside the frontend folder. Additionally, the starter app has also been hosted live as an alternative to self hosting: https://b17-blockchain-capstone-q2.vercel.app/

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


## Zillow Scraper 

### Step 0: Entering Folder

```sh
cd scraper
```

### Step 1: Set Up Virtual Environment
Create a python virutal environment, activate the environment, and install the necessary packaes from requirements.txt in order to run the scraper script

```sh
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
```

### Step 2: Run Scraper Script

```sh
python zillow_scrape.py
```


### Step 3: Results
A local csv file called 'zillow.csv' should be generated with a few properties from the first page of zillow

## Escrow and Bank API Server Replication

### Step 0: Entering Folder
```sh
cd apis
```

### Step 1: Running Bank API Tests
```sh
cd bank
```

```sh
# First, start the Bank server
python bank_server.py

# In a new terminal window, run the bank tests
./bank_test.sh
```

### Step 2: Running Escrow API Tests
```sh
# Switch to escrow folder from bank folder
cd ../escrow
```

```sh
# First, start the Escrow server
python escrow_server.py

# In a new terminal window, run the escrow tests
./test_escrow.sh
```
### Step 3: Results
For both test scripts, the tests will appear in the terminal, with checks for proper successful requests and proper failed requests.

## Isolated Clerk and Image Upload Interface

### Step 0: Entering Enviornment

```sh
cd googleoauth
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

The local version of the authentication App should be running on http://localhost:3000

### Step 4: Interact With Live App

On the web page there is a login/sign-up button to authentication with a Google account to unlock the rest of the features, such as image upload, and internal coin transfers.
****
