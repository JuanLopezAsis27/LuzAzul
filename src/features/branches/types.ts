export interface BranchItem {
  id: string;
  name: string;
  address: string | null;
  isActive: boolean;
  _count: { users: number };
}
