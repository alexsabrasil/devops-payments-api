import pool from '../config/db';
import { Payment } from '../models/payment.model';

export class PaymentRepository {
  async createPayment(payment: Payment): Promise<Payment> {
    const query = `
      INSERT INTO payments (amount, currency, user_id, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [payment.amount, payment.currency, payment.user_id, payment.status];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    const query = 'SELECT * FROM payments WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async updatePaymentStatus(id: string, status: string): Promise<Payment | null> {
    const query = 'UPDATE payments SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    return result.rows[0] || null;
  }
}
