export interface Product {
  id: number;
  product_name: string;
  brand: string;
  quantity: number;
  status: string;
  product_price: number;
  discounted_price: number;
  product_unit: string;
  product_image: string;
}

export enum ProductStatus {
  MISSING = "Missing",
  MISSING_URGENT = "Missing - Urgent",
  APPROVED = "Approved",
}
