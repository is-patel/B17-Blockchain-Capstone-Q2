import { ethers } from "hardhat";

async function main() {
    const Lock = await ethers.getContractFactory("Lock");
    const unlockTime = Math.floor(Date.now() / 1000) + 3600; 
    const lock = await Lock.deploy(unlockTime);
    console.log("Lock contract deployed");
}

// Handle errors
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
