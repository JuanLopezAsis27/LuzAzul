export interface LoadItemRecord {
  id: string;
  section: string;
  quantity: number;
  unit: string;
  product: { id: string; name: string; code: string };
  state: { id: string; name: string } | null;
}

export interface DailyLoadRecord {
  id: string;
  date: string;
  isClosed: boolean;
  items: LoadItemRecord[];
  user: { id: string; name: string };
  branch: { id: string; name: string };
}

export type LoadSection = "MERMA" | "DONACION" | "REFRIGERIO";
