const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("BaseBounty", function () {
  let baseBounty;
  let owner, creator, worker1, worker2, voter1, voter2, platformWallet;
  const PAYMENT = ethers.parseEther("0.1");
  const MIN_PAYMENT = ethers.parseEther("0.000001");

  beforeEach(async function () {
    [owner, creator, worker1, worker2, voter1, voter2, platformWallet] = await ethers.getSigners();

    const BaseBounty = await ethers.getContractFactory("BaseBounty");
    baseBounty = await BaseBounty.deploy(platformWallet.address);
    await baseBounty.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct platform wallet", async function () {
      expect(await baseBounty.platformWallet()).to.equal(platformWallet.address);
    });

    it("Should have zero bounties initially", async function () {
      expect(await baseBounty.getTotalBounties()).to.equal(0);
    });
  });

  describe("Create Bounty", function () {
    it("Should create a bounty successfully", async function () {
      const deadline = (await time.latest()) + 86400; // 1 day from now

      await expect(
        baseBounty.connect(creator).createBounty(
          "Design a logo",
          "Need a modern logo for my startup",
          0, // Design category
          deadline,
          { value: PAYMENT }
        )
      )
        .to.emit(baseBounty, "BountyCreated")
        .withArgs(1, creator.address, "Design a logo", 0, PAYMENT, deadline);

      const bounty = await baseBounty.getBounty(1);
      expect(bounty.creator).to.equal(creator.address);
      expect(bounty.title).to.equal("Design a logo");
      expect(bounty.payment).to.equal(PAYMENT);
      expect(bounty.status).to.equal(0); // Active
    });

    it("Should revert if payment is too low", async function () {
      const deadline = (await time.latest()) + 86400;
      const lowPayment = ethers.parseEther("0.0000001");

      await expect(
        baseBounty.connect(creator).createBounty(
          "Design a logo",
          "Description",
          0,
          deadline,
          { value: lowPayment }
        )
      ).to.be.revertedWithCustomError(baseBounty, "InvalidAmount");
    });

    it("Should revert if deadline is in the past", async function () {
      const pastDeadline = (await time.latest()) - 86400;

      await expect(
        baseBounty.connect(creator).createBounty(
          "Design a logo",
          "Description",
          0,
          pastDeadline,
          { value: PAYMENT }
        )
      ).to.be.revertedWithCustomError(baseBounty, "InvalidDeadline");
    });

    it("Should track user created bounties", async function () {
      const deadline = (await time.latest()) + 86400;

      await baseBounty.connect(creator).createBounty(
        "Task 1",
        "Description",
        0,
        deadline,
        { value: PAYMENT }
      );

      await baseBounty.connect(creator).createBounty(
        "Task 2",
        "Description",
        1,
        deadline,
        { value: PAYMENT }
      );

      const createdBounties = await baseBounty.getUserCreatedBounties(creator.address);
      expect(createdBounties.length).to.equal(2);
      expect(createdBounties[0]).to.equal(1);
      expect(createdBounties[1]).to.equal(2);
    });
  });

  describe("Apply to Bounty", function () {
    let bountyId;
    let deadline;

    beforeEach(async function () {
      deadline = (await time.latest()) + 86400;
      await baseBounty.connect(creator).createBounty(
        "Design a logo",
        "Description",
        0,
        deadline,
        { value: PAYMENT }
      );
      bountyId = 1;
    });

    it("Should allow worker to apply", async function () {
      await expect(
        baseBounty.connect(worker1).applyToBounty(bountyId, "I'm interested!")
      )
        .to.emit(baseBounty, "ApplicationSubmitted")
        .withArgs(bountyId, worker1.address, "I'm interested!");

      const application = await baseBounty.getApplication(bountyId, worker1.address);
      expect(application.worker).to.equal(worker1.address);
      expect(application.coverLetter).to.equal("I'm interested!");
    });

    it("Should track applicants", async function () {
      await baseBounty.connect(worker1).applyToBounty(bountyId, "Application 1");
      await baseBounty.connect(worker2).applyToBounty(bountyId, "Application 2");

      const applicants = await baseBounty.getBountyApplicants(bountyId);
      expect(applicants.length).to.equal(2);
      expect(applicants[0]).to.equal(worker1.address);
      expect(applicants[1]).to.equal(worker2.address);
    });

    it("Should revert if already applied", async function () {
      await baseBounty.connect(worker1).applyToBounty(bountyId, "First application");

      await expect(
        baseBounty.connect(worker1).applyToBounty(bountyId, "Second application")
      ).to.be.revertedWithCustomError(baseBounty, "AlreadyApplied");
    });

    it("Should revert if creator tries to apply", async function () {
      await expect(
        baseBounty.connect(creator).applyToBounty(bountyId, "I want to apply")
      ).to.be.revertedWithCustomError(baseBounty, "NotApplicant");
    });

    it("Should revert if deadline passed", async function () {
      await time.increase(86401); // Move past deadline

      await expect(
        baseBounty.connect(worker1).applyToBounty(bountyId, "Late application")
      ).to.be.revertedWithCustomError(baseBounty, "DeadlinePassed");
    });

    it("Should track user applied bounties", async function () {
      await baseBounty.connect(worker1).applyToBounty(bountyId, "Application");

      const appliedBounties = await baseBounty.getUserAppliedBounties(worker1.address);
      expect(appliedBounties.length).to.equal(1);
      expect(appliedBounties[0]).to.equal(bountyId);
    });
  });

  describe("Submit Work", function () {
    let bountyId;

    beforeEach(async function () {
      const deadline = (await time.latest()) + 86400;
      await baseBounty.connect(creator).createBounty(
        "Design a logo",
        "Description",
        0,
        deadline,
        { value: PAYMENT }
      );
      bountyId = 1;
      await baseBounty.connect(worker1).applyToBounty(bountyId, "I'm interested");
    });

    it("Should allow applicant to submit work", async function () {
      const workUrl = "https://ipfs.io/ipfs/QmXyz...";

      await expect(
        baseBounty.connect(worker1).submitWork(bountyId, workUrl)
      )
        .to.emit(baseBounty, "WorkSubmitted")
        .withArgs(bountyId, worker1.address, workUrl);

      const application = await baseBounty.getApplication(bountyId, worker1.address);
      expect(application.workStatus).to.equal(1); // Submitted
      expect(application.workSubmissionUrl).to.equal(workUrl);
    });

    it("Should revert if not an applicant", async function () {
      await expect(
        baseBounty.connect(worker2).submitWork(bountyId, "https://example.com")
      ).to.be.revertedWithCustomError(baseBounty, "NotApplicant");
    });
  });

  describe("Accept Work", function () {
    let bountyId;

    beforeEach(async function () {
      const deadline = (await time.latest()) + 86400;
      await baseBounty.connect(creator).createBounty(
        "Design a logo",
        "Description",
        0,
        deadline,
        { value: PAYMENT }
      );
      bountyId = 1;
      await baseBounty.connect(worker1).applyToBounty(bountyId, "Application");
      await baseBounty.connect(worker1).submitWork(bountyId, "https://work.com");
    });

    it("Should accept work and transfer payment", async function () {
      const initialBalance = await ethers.provider.getBalance(worker1.address);
      const platformInitialBalance = await ethers.provider.getBalance(platformWallet.address);

      await expect(
        baseBounty.connect(creator).acceptWork(bountyId, worker1.address)
      )
        .to.emit(baseBounty, "WorkAccepted");

      const finalBalance = await ethers.provider.getBalance(worker1.address);
      const platformFinalBalance = await ethers.provider.getBalance(platformWallet.address);

      // Worker should receive payment minus 2% fee
      const expectedPayment = (PAYMENT * 98n) / 100n;
      const platformFee = (PAYMENT * 2n) / 100n;

      expect(finalBalance - initialBalance).to.equal(expectedPayment);
      expect(platformFinalBalance - platformInitialBalance).to.equal(platformFee);

      // Check bounty status
      const bounty = await baseBounty.getBounty(bountyId);
      expect(bounty.status).to.equal(1); // Completed
      expect(bounty.selectedWorker).to.equal(worker1.address);

      // Check reputation updates
      const creatorRep = await baseBounty.getUserReputation(creator.address);
      const workerRep = await baseBounty.getUserReputation(worker1.address);

      expect(creatorRep.completedBounties).to.equal(1);
      expect(creatorRep.totalSpent).to.equal(PAYMENT);
      expect(workerRep.completedWorks).to.equal(1);
      expect(workerRep.totalEarned).to.equal(PAYMENT);
    });

    it("Should revert if not the creator", async function () {
      await expect(
        baseBounty.connect(worker2).acceptWork(bountyId, worker1.address)
      ).to.be.revertedWithCustomError(baseBounty, "NotBountyCreator");
    });

    it("Should revert if work not submitted", async function () {
      await baseBounty.connect(worker2).applyToBounty(bountyId, "Application");

      await expect(
        baseBounty.connect(creator).acceptWork(bountyId, worker2.address)
      ).to.be.revertedWithCustomError(baseBounty, "WorkNotSubmitted");
    });
  });

  describe("Reject Work", function () {
    let bountyId;

    beforeEach(async function () {
      const deadline = (await time.latest()) + 86400;
      await baseBounty.connect(creator).createBounty(
        "Design a logo",
        "Description",
        0,
        deadline,
        { value: PAYMENT }
      );
      bountyId = 1;
      await baseBounty.connect(worker1).applyToBounty(bountyId, "Application");
      await baseBounty.connect(worker1).submitWork(bountyId, "https://work.com");
    });

    it("Should reject work with reason", async function () {
      const reason = "Quality doesn't meet requirements";

      await expect(
        baseBounty.connect(creator).rejectWork(bountyId, worker1.address, reason)
      )
        .to.emit(baseBounty, "WorkRejected")
        .withArgs(bountyId, worker1.address, reason);

      const application = await baseBounty.getApplication(bountyId, worker1.address);
      expect(application.workStatus).to.equal(3); // Rejected
      expect(application.rejectionReason).to.equal(reason);
    });

    it("Should revert if not the creator", async function () {
      await expect(
        baseBounty.connect(worker2).rejectWork(bountyId, worker1.address, "Reason")
      ).to.be.revertedWithCustomError(baseBounty, "NotBountyCreator");
    });
  });

  describe("Dispute System", function () {
    let bountyId;

    beforeEach(async function () {
      const deadline = (await time.latest()) + 86400;
      await baseBounty.connect(creator).createBounty(
        "Design a logo",
        "Description",
        0,
        deadline,
        { value: PAYMENT }
      );
      bountyId = 1;
      await baseBounty.connect(worker1).applyToBounty(bountyId, "Application");
      await baseBounty.connect(worker1).submitWork(bountyId, "https://work.com");
      await baseBounty.connect(creator).rejectWork(bountyId, worker1.address, "Not good");
    });

    it("Should create a dispute", async function () {
      await expect(
        baseBounty.connect(worker1).createDispute(bountyId, "Work was done correctly")
      )
        .to.emit(baseBounty, "DisputeCreated")
        .withArgs(1, bountyId, worker1.address, "Work was done correctly");

      const dispute = await baseBounty.getDispute(1);
      expect(dispute.worker).to.equal(worker1.address);
      expect(dispute.creator).to.equal(creator.address);
      expect(dispute.status).to.equal(0); // Active

      const bounty = await baseBounty.getBounty(bountyId);
      expect(bounty.status).to.equal(3); // InDispute
    });

    it("Should allow voting on dispute", async function () {
      await baseBounty.connect(worker1).createDispute(bountyId, "Dispute reason");
      const disputeId = 1;

      await expect(
        baseBounty.connect(voter1).voteOnDispute(disputeId, true)
      )
        .to.emit(baseBounty, "DisputeVoted")
        .withArgs(disputeId, voter1.address, true);

      const dispute = await baseBounty.getDispute(disputeId);
      expect(dispute.votesForWorker).to.equal(1);

      expect(await baseBounty.hasVotedOnDispute(disputeId, voter1.address)).to.be.true;
    });

    it("Should revert if voting twice", async function () {
      await baseBounty.connect(worker1).createDispute(bountyId, "Dispute reason");
      const disputeId = 1;

      await baseBounty.connect(voter1).voteOnDispute(disputeId, true);

      await expect(
        baseBounty.connect(voter1).voteOnDispute(disputeId, false)
      ).to.be.revertedWithCustomError(baseBounty, "AlreadyVoted");
    });

    it("Should revert if parties try to vote", async function () {
      await baseBounty.connect(worker1).createDispute(bountyId, "Dispute reason");
      const disputeId = 1;

      await expect(
        baseBounty.connect(worker1).voteOnDispute(disputeId, true)
      ).to.be.revertedWithCustomError(baseBounty, "CannotVoteOwnDispute");

      await expect(
        baseBounty.connect(creator).voteOnDispute(disputeId, false)
      ).to.be.revertedWithCustomError(baseBounty, "CannotVoteOwnDispute");
    });

    it("Should resolve dispute in favor of worker", async function () {
      await baseBounty.connect(worker1).createDispute(bountyId, "Dispute reason");
      const disputeId = 1;

      // More votes for worker
      await baseBounty.connect(voter1).voteOnDispute(disputeId, true);
      await baseBounty.connect(voter2).voteOnDispute(disputeId, true);

      // Fast forward past timeout
      await time.increase(72 * 3600 + 1);

      const initialBalance = await ethers.provider.getBalance(worker1.address);

      await baseBounty.resolveDispute(disputeId);

      const finalBalance = await ethers.provider.getBalance(worker1.address);
      const expectedPayment = (PAYMENT * 98n) / 100n;

      expect(finalBalance - initialBalance).to.equal(expectedPayment);

      const dispute = await baseBounty.getDispute(disputeId);
      expect(dispute.status).to.equal(1); // ResolvedForWorker

      const bounty = await baseBounty.getBounty(bountyId);
      expect(bounty.status).to.equal(1); // Completed
    });

    it("Should resolve dispute in favor of creator", async function () {
      await baseBounty.connect(worker1).createDispute(bountyId, "Dispute reason");
      const disputeId = 1;

      // More votes for creator
      await baseBounty.connect(voter1).voteOnDispute(disputeId, false);
      await baseBounty.connect(voter2).voteOnDispute(disputeId, false);

      await time.increase(72 * 3600 + 1);

      const initialBalance = await ethers.provider.getBalance(creator.address);

      const tx = await baseBounty.resolveDispute(disputeId);
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const finalBalance = await ethers.provider.getBalance(creator.address);

      // Creator gets refund
      expect(finalBalance - initialBalance + gasUsed).to.equal(PAYMENT);

      const dispute = await baseBounty.getDispute(disputeId);
      expect(dispute.status).to.equal(2); // ResolvedForCreator
    });

    it("Should revert if resolving before timeout", async function () {
      await baseBounty.connect(worker1).createDispute(bountyId, "Dispute reason");
      const disputeId = 1;

      await expect(
        baseBounty.resolveDispute(disputeId)
      ).to.be.revertedWithCustomError(baseBounty, "DisputeTimeoutNotReached");
    });
  });

  describe("Cancel Bounty", function () {
    it("Should cancel bounty with no applications", async function () {
      const deadline = (await time.latest()) + 86400;
      await baseBounty.connect(creator).createBounty(
        "Design a logo",
        "Description",
        0,
        deadline,
        { value: PAYMENT }
      );
      const bountyId = 1;

      const initialBalance = await ethers.provider.getBalance(creator.address);

      const tx = await baseBounty.connect(creator).cancelBounty(bountyId);
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const finalBalance = await ethers.provider.getBalance(creator.address);

      expect(finalBalance - initialBalance + gasUsed).to.equal(PAYMENT);

      const bounty = await baseBounty.getBounty(bountyId);
      expect(bounty.status).to.equal(2); // Cancelled
    });

    it("Should revert if there are applications", async function () {
      const deadline = (await time.latest()) + 86400;
      await baseBounty.connect(creator).createBounty(
        "Design a logo",
        "Description",
        0,
        deadline,
        { value: PAYMENT }
      );
      const bountyId = 1;

      await baseBounty.connect(worker1).applyToBounty(bountyId, "Application");

      await expect(
        baseBounty.connect(creator).cancelBounty(bountyId)
      ).to.be.revertedWithCustomError(baseBounty, "NoRefundAvailable");
    });

    it("Should revert if not the creator", async function () {
      const deadline = (await time.latest()) + 86400;
      await baseBounty.connect(creator).createBounty(
        "Design a logo",
        "Description",
        0,
        deadline,
        { value: PAYMENT }
      );
      const bountyId = 1;

      await expect(
        baseBounty.connect(worker1).cancelBounty(bountyId)
      ).to.be.revertedWithCustomError(baseBounty, "NotBountyCreator");
    });
  });

  describe("Rating System", function () {
    let bountyId;

    beforeEach(async function () {
      const deadline = (await time.latest()) + 86400;
      await baseBounty.connect(creator).createBounty(
        "Design a logo",
        "Description",
        0,
        deadline,
        { value: PAYMENT }
      );
      bountyId = 1;
      await baseBounty.connect(worker1).applyToBounty(bountyId, "Application");
      await baseBounty.connect(worker1).submitWork(bountyId, "https://work.com");
      await baseBounty.connect(creator).acceptWork(bountyId, worker1.address);
    });

    it("Should allow creator to rate worker", async function () {
      await expect(
        baseBounty.connect(creator).rateUser(bountyId, worker1.address, 5, "Excellent work!")
      )
        .to.emit(baseBounty, "RatingGiven")
        .withArgs(bountyId, creator.address, worker1.address, 5, "Excellent work!");

      const rating = await baseBounty.getRating(bountyId, creator.address);
      expect(rating.score).to.equal(5);
      expect(rating.comment).to.equal("Excellent work!");

      const rep = await baseBounty.getUserReputation(worker1.address);
      expect(rep.totalRatings).to.equal(1);
      expect(rep.sumOfRatings).to.equal(5);

      const avgRating = await baseBounty.getAverageRating(worker1.address);
      expect(avgRating).to.equal(500); // 5.0 * 100
    });

    it("Should allow worker to rate creator", async function () {
      await baseBounty.connect(worker1).rateUser(bountyId, creator.address, 4, "Good client");

      const rating = await baseBounty.getRating(bountyId, worker1.address);
      expect(rating.score).to.equal(4);

      const avgRating = await baseBounty.getAverageRating(creator.address);
      expect(avgRating).to.equal(400); // 4.0 * 100
    });

    it("Should calculate correct average with multiple ratings", async function () {
      // Create and complete another bounty
      const deadline = (await time.latest()) + 86400;
      await baseBounty.connect(creator).createBounty(
        "Another task",
        "Description",
        0,
        deadline,
        { value: PAYMENT }
      );
      const bountyId2 = 2;
      await baseBounty.connect(worker1).applyToBounty(bountyId2, "Application");
      await baseBounty.connect(worker1).submitWork(bountyId2, "https://work.com");
      await baseBounty.connect(creator).acceptWork(bountyId2, worker1.address);

      // Rate in both bounties
      await baseBounty.connect(creator).rateUser(bountyId, worker1.address, 5, "Great");
      await baseBounty.connect(creator).rateUser(bountyId2, worker1.address, 3, "Good");

      const rep = await baseBounty.getUserReputation(worker1.address);
      expect(rep.totalRatings).to.equal(2);
      expect(rep.sumOfRatings).to.equal(8);

      const avgRating = await baseBounty.getAverageRating(worker1.address);
      expect(avgRating).to.equal(400); // 4.0 * 100 = (5+3)/2
    });

    it("Should revert if rating score invalid", async function () {
      await expect(
        baseBounty.connect(creator).rateUser(bountyId, worker1.address, 6, "Too high")
      ).to.be.revertedWithCustomError(baseBounty, "InvalidRating");

      await expect(
        baseBounty.connect(creator).rateUser(bountyId, worker1.address, 0, "Too low")
      ).to.be.revertedWithCustomError(baseBounty, "InvalidRating");
    });

    it("Should revert if bounty not completed", async function () {
      const deadline = (await time.latest()) + 86400;
      await baseBounty.connect(creator).createBounty(
        "Active task",
        "Description",
        0,
        deadline,
        { value: PAYMENT }
      );
      const bountyId2 = 2;

      await expect(
        baseBounty.connect(creator).rateUser(bountyId2, worker1.address, 5, "Comment")
      ).to.be.revertedWithCustomError(baseBounty, "BountyNotActive");
    });

    it("Should revert if rating wrong party", async function () {
      await expect(
        baseBounty.connect(creator).rateUser(bountyId, worker2.address, 5, "Comment")
      ).to.be.revertedWithCustomError(baseBounty, "InvalidRating");
    });

    it("Should revert if not a party in the bounty", async function () {
      await expect(
        baseBounty.connect(worker2).rateUser(bountyId, creator.address, 5, "Comment")
      ).to.be.revertedWithCustomError(baseBounty, "NotApplicant");
    });
  });

  describe("View Functions", function () {
    it("Should return correct average rating with no ratings", async function () {
      const avgRating = await baseBounty.getAverageRating(worker1.address);
      expect(avgRating).to.equal(0);
    });

    it("Should track multiple bounties correctly", async function () {
      const deadline = (await time.latest()) + 86400;

      for (let i = 0; i < 3; i++) {
        await baseBounty.connect(creator).createBounty(
          `Task ${i}`,
          "Description",
          0,
          deadline,
          { value: PAYMENT }
        );
      }

      expect(await baseBounty.getTotalBounties()).to.equal(3);

      const createdBounties = await baseBounty.getUserCreatedBounties(creator.address);
      expect(createdBounties.length).to.equal(3);
    });
  });

  describe("Platform Wallet Update", function () {
    it("Should allow platform wallet to update itself", async function () {
      await baseBounty.connect(platformWallet).updatePlatformWallet(owner.address);
      expect(await baseBounty.platformWallet()).to.equal(owner.address);
    });

    it("Should revert if not platform wallet", async function () {
      await expect(
        baseBounty.connect(creator).updatePlatformWallet(owner.address)
      ).to.be.revertedWith("Not authorized");
    });
  });
});
