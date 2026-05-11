export interface ReportItem {
  id: string;
  section: string;
  quantity: number;
  product: { id: string; name: string; code: string };
  state: { id: string; name: string } | null;
  date: string;
  userName: string;
  branchName: string;
  isClosed: boolean;
}

export interface ReportPagination {
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
}

export interface ReportDailyLoad {
  id: string;
  date: string;
  isClosed: boolean;
  user: { id: string; name: string };
  branch: { id: string; name: string };
  items: Array<{
    id: string;
    section: string;
    quantity: number;
    unit: string;
    product: { id: string; name: string; code: string };
    state: { id: string; name: string } | null;
  }>;
}

export interface ReportData {
  data: ReportDailyLoad[];
  pagination: ReportPagination;
}
