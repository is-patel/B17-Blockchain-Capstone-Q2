async function main() {
    // Get the deployer account from Hardhat runtime environment.
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
  
    // Get the contract factory
    const PropToken = await ethers.getContractFactory("PropToken");
    console.log("Deploying PropToken...");
  
    // Deploy the contract
    const propToken = await PropToken.deploy();
    await propToken.deployed();
  
    console.log("PropToken deployed to:", propToken.address);
  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  