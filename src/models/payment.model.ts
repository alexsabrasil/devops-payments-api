export interface Payment {
  id?: string;
  amount: number;
  currency: string;
  user_id: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  created_at?: Date;
  updated_at?: Date;
}
