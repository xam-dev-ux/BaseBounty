const hre = require("hardhat");

async function main() {
  // Get contract address from command line or environment
  const contractAddress = process.env.CONTRACT_ADDRESS || process.argv[2];
  const platformWallet = process.env.PLATFORM_WALLET || process.argv[3];

  if (!contractAddress) {
    console.error("❌ Please provide contract address");
    console.log("Usage: npx hardhat run scripts/verify.js --network base <CONTRACT_ADDRESS> <PLATFORM_WALLET>");
    process.exit(1);
  }

  if (!platformWallet) {
    console.error("❌ Please provide platform wallet address");
    process.exit(1);
  }

  console.log("🔍 Verifying contract on Basescan...");
  console.log("📍 Contract:", contractAddress);
  console.log("🏦 Platform Wallet:", platformWallet);
  console.log("🔗 Network:", hre.network.name);

  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [platformWallet],
    });

    console.log("✅ Contract verified successfully!");
    console.log(`🔗 View on Basescan: https://basescan.org/address/${contractAddress}`);
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract is already verified!");
    } else {
      console.error("❌ Verification failed:");
      console.error(error);
      process.exit(1);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
