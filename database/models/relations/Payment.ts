import { Payments } from '../Payment';
import { PaymentDetailBanks } from '../PaymentDetailBanks';
import { PaymentDetails } from '../PaymentDetails';

Payments.hasMany(PaymentDetails, {
  foreignKey: 'paymentId',
  as: 'payment_details',
});
Payments.hasMany(PaymentDetailBanks, {
  foreignKey: 'paymentId',
  as: 'payment_detail_banks',
});

export { Payments as PaymentsRelation };
