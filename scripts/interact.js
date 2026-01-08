const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS || process.argv[2];

  if (!contractAddress) {
    console.error("❌ Please provide contract address");
    console.log("Usage: CONTRACT_ADDRESS=0x... npx hardhat run scripts/interact.js --network base");
    process.exit(1);
  }

  console.log("🔗 Connecting to BaseBounty contract...");
  console.log("📍 Contract:", contractAddress);
  console.log("🌐 Network:", hre.network.name);

  // Get signers
  const [signer] = await hre.ethers.getSigners();
  console.log("👤 Using account:", signer.address);

  // Connect to contract
  const BaseBounty = await hre.ethers.getContractFactory("BaseBounty");
  const baseBounty = BaseBounty.attach(contractAddress);

  console.log("\n📊 Contract Information:");

  // Get platform wallet
  const platformWallet = await baseBounty.platformWallet();
  console.log("🏦 Platform Wallet:", platformWallet);

  // Get total bounties
  const totalBounties = await baseBounty.getTotalBounties();
  console.log("📝 Total Bounties:", totalBounties.toString());

  // Get minimum bounty amount
  const minAmount = await baseBounty.MIN_BOUNTY_AMOUNT();
  console.log("💰 Minimum Bounty:", hre.ethers.formatEther(minAmount), "ETH");

  // Get platform fee
  const platformFee = await baseBounty.PLATFORM_FEE_PERCENT();
  console.log("💸 Platform Fee:", platformFee.toString(), "%");

  // Get dispute timeout
  const disputeTimeout = await baseBounty.DISPUTE_TIMEOUT();
  console.log("⏱️  Dispute Timeout:", (disputeTimeout / 3600n).toString(), "hours");

  // Get user reputation
  const userRep = await baseBounty.getUserReputation(signer.address);
  console.log("\n👤 Your Reputation:");
  console.log("  ⭐ Total Ratings:", userRep.totalRatings.toString());
  console.log("  🎯 Sum of Ratings:", userRep.sumOfRatings.toString());
  console.log("  ✅ Completed Bounties:", userRep.completedBounties.toString());
  console.log("  🎨 Completed Works:", userRep.completedWorks.toString());
  console.log("  💵 Total Earned:", hre.ethers.formatEther(userRep.totalEarned), "ETH");
  console.log("  💸 Total Spent:", hre.ethers.formatEther(userRep.totalSpent), "ETH");

  // Get average rating
  const avgRating = await baseBounty.getAverageRating(signer.address);
  console.log("  📊 Average Rating:", (Number(avgRating) / 100).toFixed(2), "/5");

  // Get user created bounties
  const createdBounties = await baseBounty.getUserCreatedBounties(signer.address);
  console.log("\n📋 Your Created Bounties:", createdBounties.length);

  // Get user applied bounties
  const appliedBounties = await baseBounty.getUserAppliedBounties(signer.address);
  console.log("📝 Your Applied Bounties:", appliedBounties.length);

  // Display recent bounties
  if (totalBounties > 0n) {
    console.log("\n📜 Recent Bounties:");
    const displayCount = totalBounties > 5n ? 5n : totalBounties;

    for (let i = totalBounties; i > totalBounties - displayCount; i--) {
      const bounty = await baseBounty.getBounty(i);
      console.log(`\n  Bounty #${i}:`);
      console.log(`    Title: ${bounty.title}`);
      console.log(`    Creator: ${bounty.creator}`);
      console.log(`    Payment: ${hre.ethers.formatEther(bounty.payment)} ETH`);
      console.log(`    Category: ${getCategoryName(bounty.category)}`);
      console.log(`    Status: ${getStatusName(bounty.status)}`);
      console.log(`    Deadline: ${new Date(Number(bounty.deadline) * 1000).toLocaleString()}`);

      // Get applicants
      const applicants = await baseBounty.getBountyApplicants(i);
      console.log(`    Applicants: ${applicants.length}`);
    }
  }

  console.log("\n✅ Interaction complete!");
}

function getCategoryName(category) {
  const categories = [
    "Design",
    "Development",
    "Writing",
    "Translation",
    "Research",
    "Marketing",
    "DataEntry",
    "Review",
    "Other",
  ];
  return categories[category] || "Unknown";
}

function getStatusName(status) {
  const statuses = ["Active", "Completed", "Cancelled", "InDispute"];
  return statuses[status] || "Unknown";
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
