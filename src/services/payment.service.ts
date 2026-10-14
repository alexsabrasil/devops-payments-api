import { PaymentRepository } from '../repositories/payment.repository';
import { PaymentGatewayPartner } from '../partners/paymentGateway.partner';
import redisClient from '../config/redis';
import { Payment } from '../models/payment.model';

export class PaymentService {
  private paymentRepository: PaymentRepository;
  private paymentGateway: PaymentGatewayPartner;

  constructor() {
    this.paymentRepository = new PaymentRepository();
    this.paymentGateway = new PaymentGatewayPartner();
  }

  async processNewPayment(paymentData: Omit<Payment, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<Payment> {
    // 1. Save payment as PENDING in DB
    const newPayment: Payment = {
      ...paymentData,
      status: 'PENDING'
    };
    
    const savedPayment = await this.paymentRepository.createPayment(newPayment);
    const paymentId = savedPayment.id as string;

    // Cache the pending payment in Redis
    await redisClient.setEx(`payment:${paymentId}`, 3600, JSON.stringify(savedPayment));

    try {
      // 2. Call external partner to process payment
      const gatewayResponse = await this.paymentGateway.processPayment(savedPayment);

      // 3. Update status based on partner response
      const newStatus = gatewayResponse.success ? 'COMPLETED' : 'FAILED';
      const updatedPayment = await this.paymentRepository.updatePaymentStatus(paymentId, newStatus);
      
      if (updatedPayment) {
        // Update cache
        await redisClient.setEx(`payment:${paymentId}`, 3600, JSON.stringify(updatedPayment));
        return updatedPayment;
      }
      
      return savedPayment; // Fallback
    } catch (error) {
      // Handle partner failure
      const failedPayment = await this.paymentRepository.updatePaymentStatus(paymentId, 'FAILED');
      if (failedPayment) {
         await redisClient.setEx(`payment:${paymentId}`, 3600, JSON.stringify(failedPayment));
         return failedPayment;
      }
      return savedPayment;
    }
  }

  async getPaymentStatus(id: string): Promise<Payment | null> {
    // Check Redis cache first
    const cachedPayment = await redisClient.get(`payment:${id}`);
    if (cachedPayment) {
      return JSON.parse(cachedPayment);
    }

    // Fallback to DB
    const payment = await this.paymentRepository.getPaymentById(id);
    if (payment) {
      await redisClient.setEx(`payment:${id}`, 3600, JSON.stringify(payment));
    }
    
    return payment;
  }
}
