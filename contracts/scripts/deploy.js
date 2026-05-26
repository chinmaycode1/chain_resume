const hre = require("hardhat");

async function main() {
  console.log("Deploying ChainResume contract...");

  const ChainResume = await hre.ethers.getContractFactory("ChainResume");
  const chainResume = await ChainResume.deploy();

  await chainResume.waitForDeployment();

  const address = await chainResume.getAddress();
  console.log(`ChainResume deployed to: ${address}`);
  console.log(`Save this address to your .env file as VITE_CONTRACT_ADDRESS`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
