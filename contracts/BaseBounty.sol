// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
 * @title BaseBounty
 * @author BaseBounty Team
 * @notice Decentralized marketplace for micro-tasks on Base L2
 * @dev Optimized for low gas costs on Base with comprehensive security measures
 */
contract BaseBounty {
    // ============ Custom Errors ============
    error InvalidAmount();
    error InvalidDeadline();
    error InvalidBountyId();
    error BountyNotActive();
    error BountyAlreadyCompleted();
    error BountyAlreadyCancelled();
    error NotBountyCreator();
    error NotApplicant();
    error AlreadyApplied();
    error NoApplications();
    error DeadlinePassed();
    error DeadlineNotPassed();
    error WorkNotSubmitted();
    error WorkAlreadyAccepted();
    error WorkAlreadyRejected();
    error DisputeAlreadyExists();
    error DisputeNotActive();
    error DisputeTimeoutNotReached();
    error AlreadyVoted();
    error CannotVoteOwnDispute();
    error InvalidRating();
    error TransferFailed();
    error NoRefundAvailable();

    // ============ Enums ============
    enum BountyStatus {
        Active,
        Completed,
        Cancelled,
        InDispute
    }

    enum WorkStatus {
        NotSubmitted,
        Submitted,
        Accepted,
        Rejected
    }

    enum DisputeStatus {
        Active,
        ResolvedForWorker,
        ResolvedForCreator
    }

    enum Category {
        Design,
        Development,
        Writing,
        Translation,
        Research,
        Marketing,
        DataEntry,
        Review,
        Other
    }

    // ============ Structs ============
    struct Bounty {
        uint256 id;
        address creator;
        string title;
        string description;
        Category category;
        uint256 payment;
        uint256 deadline;
        BountyStatus status;
        address selectedWorker;
        uint256 createdAt;
    }

    struct Application {
        address worker;
        string coverLetter;
        uint256 appliedAt;
        WorkStatus workStatus;
        string workSubmissionUrl;
        string rejectionReason;
    }

    struct Dispute {
        uint256 bountyId;
        address worker;
        address creator;
        string reason;
        DisputeStatus status;
        uint256 createdAt;
        uint256 votesForWorker;
        uint256 votesForCreator;
        mapping(address => bool) hasVoted;
    }

    struct Rating {
        uint256 score; // 1-5 stars
        string comment;
        uint256 timestamp;
    }

    struct UserReputation {
        uint256 totalRatings;
        uint256 sumOfRatings;
        uint256 completedBounties;
        uint256 completedWorks;
        uint256 totalEarned;
        uint256 totalSpent;
    }

    // ============ State Variables ============
    uint256 private bountyCounter;
    uint256 private disputeCounter;
    uint256 public constant DISPUTE_TIMEOUT = 72 hours;
    uint256 public constant MIN_BOUNTY_AMOUNT = 0.000001 ether;
    uint256 public constant PLATFORM_FEE_PERCENT = 2; // 2% platform fee

    mapping(uint256 => Bounty) public bounties;
    mapping(uint256 => mapping(address => Application)) public applications;
    mapping(uint256 => address[]) public bountyApplicants;
    mapping(uint256 => Dispute) public disputes;
    mapping(address => UserReputation) public reputations;
    mapping(uint256 => mapping(address => Rating)) public bountyRatings; // bountyId => (rater => rating)
    mapping(address => uint256[]) public userCreatedBounties;
    mapping(address => uint256[]) public userAppliedBounties;

    address public platformWallet;

    // ============ Events ============
    event BountyCreated(
        uint256 indexed bountyId,
        address indexed creator,
        string title,
        Category category,
        uint256 payment,
        uint256 deadline
    );

    event ApplicationSubmitted(
        uint256 indexed bountyId,
        address indexed worker,
        string coverLetter
    );

    event WorkSubmitted(
        uint256 indexed bountyId,
        address indexed worker,
        string workUrl
    );

    event WorkAccepted(
        uint256 indexed bountyId,
        address indexed worker,
        uint256 payment
    );

    event WorkRejected(
        uint256 indexed bountyId,
        address indexed worker,
        string reason
    );

    event DisputeCreated(
        uint256 indexed disputeId,
        uint256 indexed bountyId,
        address indexed worker,
        string reason
    );

    event DisputeVoted(
        uint256 indexed disputeId,
        address indexed voter,
        bool votedForWorker
    );

    event DisputeResolved(
        uint256 indexed disputeId,
        uint256 indexed bountyId,
        DisputeStatus result,
        address winner,
        uint256 payment
    );

    event BountyCancelled(
        uint256 indexed bountyId,
        address indexed creator,
        uint256 refund
    );

    event RatingGiven(
        uint256 indexed bountyId,
        address indexed rater,
        address indexed ratee,
        uint256 score,
        string comment
    );

    // ============ Modifiers ============
    modifier validBounty(uint256 _bountyId) {
        if (_bountyId == 0 || _bountyId > bountyCounter) revert InvalidBountyId();
        _;
    }

    modifier onlyCreator(uint256 _bountyId) {
        if (bounties[_bountyId].creator != msg.sender) revert NotBountyCreator();
        _;
    }

    modifier onlyApplicant(uint256 _bountyId) {
        if (applications[_bountyId][msg.sender].worker == address(0)) revert NotApplicant();
        _;
    }

    // ============ Constructor ============
    constructor(address _platformWallet) {
        platformWallet = _platformWallet;
    }

    // ============ Core Functions ============

    /**
     * @notice Create a new bounty with ETH payment
     * @param _title Bounty title
     * @param _description Detailed description
     * @param _category Bounty category
     * @param _deadline Unix timestamp deadline
     */
    function createBounty(
        string calldata _title,
        string calldata _description,
        Category _category,
        uint256 _deadline
    ) external payable returns (uint256) {
        if (msg.value < MIN_BOUNTY_AMOUNT) revert InvalidAmount();
        if (_deadline <= block.timestamp) revert InvalidDeadline();

        bountyCounter++;
        uint256 bountyId = bountyCounter;

        Bounty storage bounty = bounties[bountyId];
        bounty.id = bountyId;
        bounty.creator = msg.sender;
        bounty.title = _title;
        bounty.description = _description;
        bounty.category = _category;
        bounty.payment = msg.value;
        bounty.deadline = _deadline;
        bounty.status = BountyStatus.Active;
        bounty.createdAt = block.timestamp;

        userCreatedBounties[msg.sender].push(bountyId);

        emit BountyCreated(bountyId, msg.sender, _title, _category, msg.value, _deadline);

        return bountyId;
    }

    /**
     * @notice Apply to an active bounty
     * @param _bountyId Bounty ID
     * @param _coverLetter Application message
     */
    function applyToBounty(uint256 _bountyId, string calldata _coverLetter)
        external
        validBounty(_bountyId)
    {
        Bounty storage bounty = bounties[_bountyId];

        if (bounty.status != BountyStatus.Active) revert BountyNotActive();
        if (block.timestamp > bounty.deadline) revert DeadlinePassed();
        if (bounty.creator == msg.sender) revert NotApplicant();
        if (applications[_bountyId][msg.sender].worker != address(0)) revert AlreadyApplied();

        Application storage app = applications[_bountyId][msg.sender];
        app.worker = msg.sender;
        app.coverLetter = _coverLetter;
        app.appliedAt = block.timestamp;
        app.workStatus = WorkStatus.NotSubmitted;

        bountyApplicants[_bountyId].push(msg.sender);
        userAppliedBounties[msg.sender].push(_bountyId);

        emit ApplicationSubmitted(_bountyId, msg.sender, _coverLetter);
    }

    /**
     * @notice Submit completed work
     * @param _bountyId Bounty ID
     * @param _workUrl URL or IPFS hash of completed work
     */
    function submitWork(uint256 _bountyId, string calldata _workUrl)
        external
        validBounty(_bountyId)
        onlyApplicant(_bountyId)
    {
        Bounty storage bounty = bounties[_bountyId];
        Application storage app = applications[_bountyId][msg.sender];

        if (bounty.status != BountyStatus.Active) revert BountyNotActive();
        if (app.workStatus == WorkStatus.Accepted) revert WorkAlreadyAccepted();
        if (app.workStatus == WorkStatus.Rejected) revert WorkAlreadyRejected();

        app.workStatus = WorkStatus.Submitted;
        app.workSubmissionUrl = _workUrl;

        emit WorkSubmitted(_bountyId, msg.sender, _workUrl);
    }

    /**
     * @notice Accept submitted work and release payment
     * @param _bountyId Bounty ID
     * @param _worker Worker address
     */
    function acceptWork(uint256 _bountyId, address _worker)
        external
        validBounty(_bountyId)
        onlyCreator(_bountyId)
    {
        Bounty storage bounty = bounties[_bountyId];
        Application storage app = applications[_bountyId][_worker];

        if (bounty.status != BountyStatus.Active) revert BountyNotActive();
        if (app.workStatus != WorkStatus.Submitted) revert WorkNotSubmitted();

        // Update state first (Checks-Effects-Interactions pattern)
        app.workStatus = WorkStatus.Accepted;
        bounty.status = BountyStatus.Completed;
        bounty.selectedWorker = _worker;

        // Update reputations
        reputations[bounty.creator].completedBounties++;
        reputations[bounty.creator].totalSpent += bounty.payment;
        reputations[_worker].completedWorks++;
        reputations[_worker].totalEarned += bounty.payment;

        // Calculate platform fee and worker payment
        uint256 platformFee = (bounty.payment * PLATFORM_FEE_PERCENT) / 100;
        uint256 workerPayment = bounty.payment - platformFee;

        emit WorkAccepted(_bountyId, _worker, workerPayment);

        // Transfer funds (interactions last)
        (bool successWorker, ) = payable(_worker).call{value: workerPayment}("");
        if (!successWorker) revert TransferFailed();

        (bool successPlatform, ) = payable(platformWallet).call{value: platformFee}("");
        if (!successPlatform) revert TransferFailed();
    }

    /**
     * @notice Reject submitted work
     * @param _bountyId Bounty ID
     * @param _worker Worker address
     * @param _reason Rejection reason
     */
    function rejectWork(uint256 _bountyId, address _worker, string calldata _reason)
        external
        validBounty(_bountyId)
        onlyCreator(_bountyId)
    {
        Bounty storage bounty = bounties[_bountyId];
        Application storage app = applications[_bountyId][_worker];

        if (bounty.status != BountyStatus.Active) revert BountyNotActive();
        if (app.workStatus != WorkStatus.Submitted) revert WorkNotSubmitted();

        app.workStatus = WorkStatus.Rejected;
        app.rejectionReason = _reason;

        emit WorkRejected(_bountyId, _worker, _reason);
    }

    /**
     * @notice Create a dispute after work rejection
     * @param _bountyId Bounty ID
     * @param _reason Dispute reason
     */
    function createDispute(uint256 _bountyId, string calldata _reason)
        external
        validBounty(_bountyId)
        onlyApplicant(_bountyId)
        returns (uint256)
    {
        Bounty storage bounty = bounties[_bountyId];
        Application storage app = applications[_bountyId][msg.sender];

        if (bounty.status != BountyStatus.Active) revert BountyNotActive();
        if (app.workStatus != WorkStatus.Rejected) revert WorkAlreadyAccepted();
        if (bounty.status == BountyStatus.InDispute) revert DisputeAlreadyExists();

        bounty.status = BountyStatus.InDispute;
        disputeCounter++;
        uint256 disputeId = disputeCounter;

        Dispute storage dispute = disputes[disputeId];
        dispute.bountyId = _bountyId;
        dispute.worker = msg.sender;
        dispute.creator = bounty.creator;
        dispute.reason = _reason;
        dispute.status = DisputeStatus.Active;
        dispute.createdAt = block.timestamp;

        emit DisputeCreated(disputeId, _bountyId, msg.sender, _reason);

        return disputeId;
    }

    /**
     * @notice Vote on an active dispute
     * @param _disputeId Dispute ID
     * @param _voteForWorker True to vote for worker, false for creator
     */
    function voteOnDispute(uint256 _disputeId, bool _voteForWorker) external {
        Dispute storage dispute = disputes[_disputeId];

        if (dispute.status != DisputeStatus.Active) revert DisputeNotActive();
        if (dispute.hasVoted[msg.sender]) revert AlreadyVoted();
        if (msg.sender == dispute.worker || msg.sender == dispute.creator) revert CannotVoteOwnDispute();

        dispute.hasVoted[msg.sender] = true;

        if (_voteForWorker) {
            dispute.votesForWorker++;
        } else {
            dispute.votesForCreator++;
        }

        emit DisputeVoted(_disputeId, msg.sender, _voteForWorker);
    }

    /**
     * @notice Resolve dispute after timeout period
     * @param _disputeId Dispute ID
     */
    function resolveDispute(uint256 _disputeId) external {
        Dispute storage dispute = disputes[_disputeId];

        if (dispute.status != DisputeStatus.Active) revert DisputeNotActive();
        if (block.timestamp < dispute.createdAt + DISPUTE_TIMEOUT) revert DisputeTimeoutNotReached();

        Bounty storage bounty = bounties[dispute.bountyId];

        // Determine winner based on votes
        bool workerWins = dispute.votesForWorker > dispute.votesForCreator;
        address winner;
        uint256 payment;

        if (workerWins) {
            dispute.status = DisputeStatus.ResolvedForWorker;
            bounty.status = BountyStatus.Completed;
            bounty.selectedWorker = dispute.worker;
            winner = dispute.worker;

            // Update reputations
            reputations[bounty.creator].completedBounties++;
            reputations[bounty.creator].totalSpent += bounty.payment;
            reputations[dispute.worker].completedWorks++;
            reputations[dispute.worker].totalEarned += bounty.payment;

            // Calculate payments
            uint256 platformFee = (bounty.payment * PLATFORM_FEE_PERCENT) / 100;
            payment = bounty.payment - platformFee;

            emit DisputeResolved(_disputeId, dispute.bountyId, DisputeStatus.ResolvedForWorker, winner, payment);

            // Transfer funds
            (bool successWorker, ) = payable(dispute.worker).call{value: payment}("");
            if (!successWorker) revert TransferFailed();

            (bool successPlatform, ) = payable(platformWallet).call{value: platformFee}("");
            if (!successPlatform) revert TransferFailed();
        } else {
            dispute.status = DisputeStatus.ResolvedForCreator;
            bounty.status = BountyStatus.Cancelled;
            winner = dispute.creator;
            payment = bounty.payment;

            emit DisputeResolved(_disputeId, dispute.bountyId, DisputeStatus.ResolvedForCreator, winner, payment);

            // Refund creator
            (bool success, ) = payable(dispute.creator).call{value: payment}("");
            if (!success) revert TransferFailed();
        }
    }

    /**
     * @notice Cancel bounty if no applications received
     * @param _bountyId Bounty ID
     */
    function cancelBounty(uint256 _bountyId)
        external
        validBounty(_bountyId)
        onlyCreator(_bountyId)
    {
        Bounty storage bounty = bounties[_bountyId];

        if (bounty.status != BountyStatus.Active) revert BountyNotActive();
        if (bountyApplicants[_bountyId].length > 0) revert NoRefundAvailable();

        bounty.status = BountyStatus.Cancelled;
        uint256 refund = bounty.payment;

        emit BountyCancelled(_bountyId, msg.sender, refund);

        // Refund creator
        (bool success, ) = payable(msg.sender).call{value: refund}("");
        if (!success) revert TransferFailed();
    }

    /**
     * @notice Rate a user after bounty completion
     * @param _bountyId Bounty ID
     * @param _ratee Address to rate
     * @param _score Rating score (1-5)
     * @param _comment Rating comment
     */
    function rateUser(
        uint256 _bountyId,
        address _ratee,
        uint256 _score,
        string calldata _comment
    ) external validBounty(_bountyId) {
        if (_score < 1 || _score > 5) revert InvalidRating();

        Bounty storage bounty = bounties[_bountyId];
        if (bounty.status != BountyStatus.Completed) revert BountyNotActive();

        // Verify rater is either creator or selected worker
        bool isCreator = msg.sender == bounty.creator;
        bool isWorker = msg.sender == bounty.selectedWorker;
        if (!isCreator && !isWorker) revert NotApplicant();

        // Verify ratee is the other party
        bool validRatee = (isCreator && _ratee == bounty.selectedWorker) ||
                         (isWorker && _ratee == bounty.creator);
        if (!validRatee) revert InvalidRating();

        // Check if already rated
        if (bountyRatings[_bountyId][msg.sender].timestamp != 0) revert InvalidRating();

        // Store rating
        Rating storage rating = bountyRatings[_bountyId][msg.sender];
        rating.score = _score;
        rating.comment = _comment;
        rating.timestamp = block.timestamp;

        // Update reputation
        UserReputation storage rep = reputations[_ratee];
        rep.totalRatings++;
        rep.sumOfRatings += _score;

        emit RatingGiven(_bountyId, msg.sender, _ratee, _score, _comment);
    }

    // ============ View Functions ============

    /**
     * @notice Get bounty details
     */
    function getBounty(uint256 _bountyId) external view validBounty(_bountyId) returns (Bounty memory) {
        return bounties[_bountyId];
    }

    /**
     * @notice Get application details
     */
    function getApplication(uint256 _bountyId, address _worker)
        external
        view
        validBounty(_bountyId)
        returns (Application memory)
    {
        return applications[_bountyId][_worker];
    }

    /**
     * @notice Get all applicants for a bounty
     */
    function getBountyApplicants(uint256 _bountyId)
        external
        view
        validBounty(_bountyId)
        returns (address[] memory)
    {
        return bountyApplicants[_bountyId];
    }

    /**
     * @notice Get dispute details
     */
    function getDispute(uint256 _disputeId) external view returns (
        uint256 bountyId,
        address worker,
        address creator,
        string memory reason,
        DisputeStatus status,
        uint256 createdAt,
        uint256 votesForWorker,
        uint256 votesForCreator
    ) {
        Dispute storage dispute = disputes[_disputeId];
        return (
            dispute.bountyId,
            dispute.worker,
            dispute.creator,
            dispute.reason,
            dispute.status,
            dispute.createdAt,
            dispute.votesForWorker,
            dispute.votesForCreator
        );
    }

    /**
     * @notice Get user reputation
     */
    function getUserReputation(address _user) external view returns (UserReputation memory) {
        return reputations[_user];
    }

    /**
     * @notice Get average rating for a user
     */
    function getAverageRating(address _user) external view returns (uint256) {
        UserReputation memory rep = reputations[_user];
        if (rep.totalRatings == 0) return 0;
        return (rep.sumOfRatings * 100) / rep.totalRatings; // Returns rating * 100 (e.g., 450 = 4.5 stars)
    }

    /**
     * @notice Get rating given in a bounty
     */
    function getRating(uint256 _bountyId, address _rater)
        external
        view
        validBounty(_bountyId)
        returns (Rating memory)
    {
        return bountyRatings[_bountyId][_rater];
    }

    /**
     * @notice Get all bounties created by a user
     */
    function getUserCreatedBounties(address _user) external view returns (uint256[] memory) {
        return userCreatedBounties[_user];
    }

    /**
     * @notice Get all bounties a user applied to
     */
    function getUserAppliedBounties(address _user) external view returns (uint256[] memory) {
        return userAppliedBounties[_user];
    }

    /**
     * @notice Get total number of bounties
     */
    function getTotalBounties() external view returns (uint256) {
        return bountyCounter;
    }

    /**
     * @notice Check if user has voted on a dispute
     */
    function hasVotedOnDispute(uint256 _disputeId, address _voter) external view returns (bool) {
        return disputes[_disputeId].hasVoted[_voter];
    }

    /**
     * @notice Update platform wallet (only by current platform wallet)
     */
    function updatePlatformWallet(address _newWallet) external {
        require(msg.sender == platformWallet, "Not authorized");
        platformWallet = _newWallet;
    }
}
