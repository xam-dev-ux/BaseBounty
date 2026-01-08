const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying BaseBounty contract to", hre.network.name);

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Platform wallet address (can be changed)
  const platformWallet = process.env.PLATFORM_WALLET || deployer.address;
  console.log("🏦 Platform wallet:", platformWallet);

  // Deploy contract
  console.log("\n⏳ Deploying contract...");
  const BaseBounty = await hre.ethers.getContractFactory("BaseBounty");
  const baseBounty = await BaseBounty.deploy(platformWallet);

  await baseBounty.waitForDeployment();
  const contractAddress = await baseBounty.getAddress();

  console.log("\n✅ BaseBounty deployed successfully!");
  console.log("📍 Contract address:", contractAddress);
  console.log("🔗 Network:", hre.network.name);
  console.log("⛽ Gas used:", (await hre.ethers.provider.getTransactionReceipt(baseBounty.deploymentTransaction().hash)).gasUsed.toString());

  // Wait for block confirmations before verifying
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting for block confirmations...");
    await baseBounty.deploymentTransaction().wait(5);

    console.log("\n📋 Contract deployed. To verify on Basescan, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress} ${platformWallet}`);
  }

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    platformWallet: platformWallet,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
  };

  console.log("\n📄 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  return contractAddress;
}

main()
  .then((address) => {
    console.log("\n🎉 Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
