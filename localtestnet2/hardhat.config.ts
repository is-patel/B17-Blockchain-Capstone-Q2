import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";

const config: HardhatUserConfig = {
  solidity: "0.8.27", // Change to match your .sol file’s version if different
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545", // Ganache RPC server URL 127.0.0.1:8545
      accounts: [
        "0x" + "9e72e5257645bebc6e3423696be498c6973cc23cee4aaad507d04331d51fcef6", // Replace with a private key from Ganache accounts
      ],
    },
  },
};

export default config;
