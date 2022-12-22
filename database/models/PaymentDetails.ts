import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';

export type PaymentDetailsData = {
  paymentId: number;
  type: number;
  value: number;
  proofOfPayment: string;
  isActive: number;
};

class PaymentDetails extends Model {}

PaymentDetails.init(
  {
    paymentId: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.INTEGER,
    },
    value: {
      type: DataTypes.INTEGER,
    },
    proofOfPayment: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'PaymentDetails',
  },
);

export { PaymentDetails };
