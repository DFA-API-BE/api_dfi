import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';
import { PaymentDetailBanksData } from './PaymentDetailBanks';
import { PaymentDetailsData } from './PaymentDetails';

export type PaymentData = {
  PaymentDetailsData: Array<PaymentDetailsData>;
  PaymentDetailBanksData: Array<PaymentDetailBanksData>;
  paymentNumber: string;
  paymentDate: string;
  siteCode: string;
  shipperNumber: string;
  customerId: number;
  cash: number;
  giro: number;
  transfer: number;
  retur: number;
  otherPayment: number;
  grandTotal: number;
  note: string;
};
class Payments extends Model {}

Payments.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    paymentNumber: {
      type: DataTypes.STRING,
    },
    paymentDate: {
      type: DataTypes.DATE,
    },
    siteCode: {
      type: DataTypes.STRING,
    },
    shipperNumber: {
      type: DataTypes.STRING,
    },
    customerId: {
      type: DataTypes.INTEGER,
    },
    cash: {
      type: DataTypes.INTEGER,
    },
    giro: {
      type: DataTypes.INTEGER,
    },
    transfer: {
      type: DataTypes.INTEGER,
    },
    retur: {
      type: DataTypes.INTEGER,
    },
    otherPayment: {
      type: DataTypes.INTEGER,
    },
    grandTotal: {
      type: DataTypes.INTEGER,
    },
    note: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'Payments',
  },
);

export { Payments };
