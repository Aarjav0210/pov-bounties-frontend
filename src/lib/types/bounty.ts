export interface Bounty {
  id: string;
  title: string;
  company: string;
  reward: number;
  industry: string;
  difficulty: "easy" | "medium" | "hard";
  duration: string;
  description: string;
  requirements: string[];
  examples?: string[];
  faq?: { question: string; answer: string }[];
  createdAt: string;
}

export interface Submission {
  id: string;
  bountyId: string;
  videoUrl: string;
  status: "pending" | "validating" | "completed" | "rejected";
  qualityScore?: number;
  createdAt: string;
}

