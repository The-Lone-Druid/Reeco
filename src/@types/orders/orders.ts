export interface Order {
  id: string;
  supplier_id: string;
  department_id: string;
  card_id: string;
  shipping_date: string;
  order_total: number;
  supplier_details: SupplierDetails;
  categories: OrderCategory[];
  order_status: string;
}

export interface OrderCategory {
  category_id: number;
  category_name: string;
}

export interface SupplierDetails {
  id: string;
  supplier_name: string;
}
