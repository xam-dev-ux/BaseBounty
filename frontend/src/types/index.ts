export enum BountyStatus {
  Active = 0,
  Completed = 1,
  Cancelled = 2,
  InDispute = 3,
}

export enum WorkStatus {
  NotSubmitted = 0,
  Submitted = 1,
  Accepted = 2,
  Rejected = 3,
}

export enum DisputeStatus {
  Active = 0,
  ResolvedForWorker = 1,
  ResolvedForCreator = 2,
}

export enum Category {
  Design = 0,
  Development = 1,
  Writing = 2,
  Translation = 3,
  Research = 4,
  Marketing = 5,
  DataEntry = 6,
  Review = 7,
  Other = 8,
}

export const CategoryLabels: Record<Category, string> = {
  [Category.Design]: "Design",
  [Category.Development]: "Development",
  [Category.Writing]: "Writing",
  [Category.Translation]: "Translation",
  [Category.Research]: "Research",
  [Category.Marketing]: "Marketing",
  [Category.DataEntry]: "Data Entry",
  [Category.Review]: "Review",
  [Category.Other]: "Other",
};

export const StatusLabels: Record<BountyStatus, string> = {
  [BountyStatus.Active]: "Active",
  [BountyStatus.Completed]: "Completed",
  [BountyStatus.Cancelled]: "Cancelled",
  [BountyStatus.InDispute]: "In Dispute",
};

export interface Bounty {
  id: bigint;
  creator: string;
  title: string;
  description: string;
  category: Category;
  payment: bigint;
  deadline: bigint;
  status: BountyStatus;
  selectedWorker: string;
  createdAt: bigint;
}

export interface Application {
  worker: string;
  coverLetter: string;
  appliedAt: bigint;
  workStatus: WorkStatus;
  workSubmissionUrl: string;
  rejectionReason: string;
}

export interface Dispute {
  bountyId: bigint;
  worker: string;
  creator: string;
  reason: string;
  status: DisputeStatus;
  createdAt: bigint;
  votesForWorker: bigint;
  votesForCreator: bigint;
}

export interface Rating {
  score: bigint;
  comment: string;
  timestamp: bigint;
}

export interface UserReputation {
  totalRatings: bigint;
  sumOfRatings: bigint;
  completedBounties: bigint;
  completedWorks: bigint;
  totalEarned: bigint;
  totalSpent: bigint;
}
