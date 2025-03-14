async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    // Get the contract to deploy
    const RealEstateToken = await ethers.getContractFactory("RealEstateToken");
    console.log("Deploying RealEstateToken...");
  
    const realEstateToken = await RealEstateToken.deploy();
  
    await realEstateToken.deployed();
    console.log("RealEstateToken deployed to:", realEstateToken.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Error deploying contract:", error);
      process.exit(1);
    });