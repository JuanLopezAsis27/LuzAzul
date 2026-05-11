export interface ProductItem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  label: string | null;
  barcode: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ProductFormData {
  code: string;
  name: string;
  description: string;
  label: string;
  barcode: string;
  [key: string]: unknown;
}
