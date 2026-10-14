import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';

const router = Router();
const paymentController = new PaymentController();

router.post('/payments', paymentController.createPayment);
router.get('/payments/:id', paymentController.getPayment);

export default router;
