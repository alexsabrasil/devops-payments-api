import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  createPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { amount, currency, user_id } = req.body;
      
      if (!amount || !currency || !user_id) {
        res.status(400).json({ error: 'Missing required fields: amount, currency, user_id' });
        return;
      }

      if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
         res.status(400).json({
            error: 'Invalid amount: must be a positive number'
         });
         return;
      }      
      
      
if (
  amount > 99999999.99 ||
  !Number.isInteger(Math.round(amount * 100)) ||
  Math.abs(amount * 100 - Math.round(amount * 100)) > 1e-7
) {
  res.status(400).json({
    error: 'Invalid amount: maximum 99999999.99 and up to 2 decimal places'
  });
  return;
}

if (typeof currency !== 'string' || !/^[A-Z]{3}$/.test(currency)) {
  res.status(400).json({
    error: 'Invalid currency: must contain 3 uppercase letters'
  });
  return;
}

if (
  typeof user_id !== 'string' ||
  user_id.trim().length === 0 ||
  user_id.length > 50
) {
  res.status(400).json({
    error: 'Invalid user_id: must be a non-empty string of up to 50 characters'
  });
  return;
}

      const payment = await this.paymentService.processNewPayment({ amount, currency, user_id });
      res.status(201).json(payment);
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const payment = await this.paymentService.getPaymentStatus(id as string);

      if (!payment) {
        res.status(404).json({ error: 'Payment not found' });
        return;
      }

      res.status(200).json(payment);
    } catch (error) {
      console.error('Error fetching payment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
