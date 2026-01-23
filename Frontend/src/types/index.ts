export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipType: "Premium" | "Standard" | "Basic";
  status: "Active" | "Inactive" | "Pending";
  joinDate: string;
  avatar?: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  schedule: string;
  instructor: string;
  maxParticipants: number;
  currentParticipants: number;
  status: "Active" | "Upcoming" | "Full" | "Cancelled";
  category: string;
  image?: string;
}

export interface Registration {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  activityId: string;
  activityName: string;
  registrationDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface DashboardStats {
  totalMembers: number;
  activeActivities: number;
  pendingRegistrations: number;
  monthlyRevenue: number;
  memberGrowth: number;
  activityGrowth: number;
  registrationGrowth: number;
  revenueGrowth: number;
}
