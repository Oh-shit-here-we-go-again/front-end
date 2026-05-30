export interface ShopItem {
  id: string | number;
  name: string;
  emoji: string;
  image_url?: string;
  cost: number;
  description: string;
  type: string;
}

export interface OrderItem {
  id: string;
  product: {
    id: string;
    name?: string;
    avatar_name?: string;
    price_points: number;
    image_url?: string;
  };
  quantity: number;
  points_at_purchase: number;
}

export interface Order {
  id: string;
  status: "pending" | "completed" | "cancelled";
  total_points: number;
  items: OrderItem[];
  created_at: string;
}

