import { Payment } from '../models/payment.model';

// This simulates an external payment gateway like Stripe, Pagar.me, etc.
export class PaymentGatewayPartner {
  async processPayment(payment: Payment): Promise<{ success: boolean; transactionId: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate payment processing logic (e.g., 90% success rate)
    const success = Math.random() > 0.1;
    
    return {
      success,
      transactionId: `txn_${Math.floor(Math.random() * 1000000)}`
    };
  }
}
