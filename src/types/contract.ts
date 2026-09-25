export type MilestoneStatus = 
  | 'Pending' 
  | 'Submitted' 
  | 'Approved' 
  | 'Disputed' 
  | 'RevisionRequired' 
  | 'TimedOut';

export interface Milestone {
  id: number;
  title: string;
  description: string;
  amount: number; // en USDC
  status: MilestoneStatus;
  proofHash?: string;
  submittedAt?: string;
  deadline?: string;
  extensionDeadline?: string;
  deliverables?: {
    githubPr?: string;
    figmaUrl?: string;
    stagingUrl?: string;
    swaggerUrl?: string;
  };
}

export interface ContractDetails {
  id: string;
  contractId: string;
  tokenAddress: string;
  clientAddress: string;
  freelancerAddress: string;
  arbiterAddress: string;
  totalAmount: number;
  progressThreshold: number; // default 80%
  currentMilestoneIndex: number;
  timeoutDuration: number; // 1209600s = 14d
  createdAt: string;
}

export interface DisputeInfo {
  milestoneId: number;
  milestoneTitle: string;
  functionalScore: number; // e.g. 84.5%
  extensionDays: number; // 5 días
  extensionDeadline: string;
  arbitrationVerdict: 'ExtensionGranted' | 'RefundedToClient' | 'ReleasedToFreelancer';
  rationale: string;
}
