export interface TeamSeatSummary {
  used: number;
  limit: number | null;
  unlimited: boolean;
  remaining: number | null;
  planKey: "free" | "pro" | "business";
  planName: string;
}

export interface TeamWorkspaceMember {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  type: "owner" | "member";
  status: "active" | "revoked";
  joinedAt: string | null;
}

export interface TeamWorkspaceResponse {
  canManage: boolean;
  seatSummary: TeamSeatSummary;
  members: TeamWorkspaceMember[];
}

export interface CreateTeamMemberInput {
  fullName: string;
  email: string;
  password: string;
}
