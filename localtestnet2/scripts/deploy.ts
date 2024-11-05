import { ethers } from "hardhat";

async function main() {
    // Get the ContractFactory and Signers here.
    const RealEstateTransaction = await ethers.getContractFactory("RealEstateTransaction");
    const realEstateTransaction = await RealEstateTransaction.deploy();

    // Wait for the contract to be deployed
    await realEstateTransaction.deployed();

    console.log("RealEstateTransaction deployed to:", realEstateTransaction.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
