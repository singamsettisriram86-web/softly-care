import { cashfreeService } from '../lib/cashfree-service';
import { memoryDataRepository } from '../lib/data-repository';

describe('Cashfree Payments Service', () => {
  it('creates an order in simulator or test sandbox mode', async () => {
    const order = await cashfreeService.createOrder({
      amountINR: 750,
      purpose: 'Medicine refill assistance',
      helperName: 'Ramesh Kumar',
      familyId: 'fam-sharma',
    });

    expect(order.success).toBe(true);
    expect(order.orderId).toBeDefined();
    expect(order.amount).toBe(750);

    const payments = await memoryDataRepository.getPayments('fam-sharma');
    expect(payments.some((p) => p.order_id === order.orderId)).toBe(true);
  });

  it('verifies payment status and marks record as paid', async () => {
    const order = await cashfreeService.createOrder({
      amountINR: 1200,
      purpose: 'Weekly caregiving fee',
      helperName: 'Ramesh Kumar',
      familyId: 'fam-sharma',
    });

    const verifyResult = await cashfreeService.verifyPayment(order.orderId);
    expect(verifyResult.success).toBe(true);
    expect(verifyResult.status).toBe('paid');

    const payments = await memoryDataRepository.getPayments('fam-sharma');
    const record = payments.find((p) => p.order_id === order.orderId);
    expect(record?.status).toBe('paid');
  });
});
