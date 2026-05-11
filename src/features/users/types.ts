export interface UserItem {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  branch: { id: string; name: string } | null;
  createdAt: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  branchId: string;
}
