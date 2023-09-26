export interface Cart {
  id: string;
  products: Product[];
}

export interface Product {
  id: number;
  product_name: string;
  brand: string;
  quantity: number;
  status: string;
  product_price: number;
  product_unit: string;
  product_image: string;
}
