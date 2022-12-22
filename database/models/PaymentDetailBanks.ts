import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';

export type PaymentDetailBanksData = {
  paymentId: number;
  giroDate: string;
  clearDate: string;
  giroNumber: string;
  bankId: number;
  value: number;
  isActive: number;
};

class PaymentDetailBanks extends Model {}

PaymentDetailBanks.init(
  {
    paymentId: {
      type: DataTypes.INTEGER,
    },
    giroDate: {
      type: DataTypes.DATE,
    },
    clearDate: {
      type: DataTypes.DATE,
    },
    giroNumber: {
      type: DataTypes.STRING,
    },
    bankId: {
      type: DataTypes.INTEGER,
    },
    value: {
      type: DataTypes.INTEGER,
    },
    isActive: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'PaymentDetailBanks',
  },
);

export { PaymentDetailBanks };
