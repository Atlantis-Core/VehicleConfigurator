import {
  FaHandHoldingUsd,
  FaUniversity,
  FaCreditCard,
  FaFileContract
} from 'react-icons/fa';
import styles from "./PaymentTypeCard.module.css";
import { formatCurrency } from "@lib/formatters/formatCurrency";
import { getPaymentBackgroundColor, getPaymentBorderColor } from "../../../helpers/getPaymentColor";
import FinancingDetails from '../FinancingDetails';
import { ConfigurationSummary, FinancingObject } from "../../../../../../../types/types";

interface PaymentTypeCardProps {
  configuration: ConfigurationSummary;
  paymentOption: string;
  financing?: FinancingObject;
}

const PaymentTypeCard: React.FC<PaymentTypeCardProps> = ({
  configuration,
  paymentOption,
  financing
}) => {
  return (
    <div className={styles.paymentTypeCard}
      style={{
        backgroundColor: getPaymentBackgroundColor(paymentOption),
        borderColor: getPaymentBorderColor(paymentOption)
      }}>

      <div className={styles.paymentHeader}>
        {paymentOption === 'cash' && (
          <>
            <div className={styles.paymentIconCircle}>
              <FaHandHoldingUsd className={styles.paymentIcon} />
            </div>
            <div>
              <span className={styles.paymentType}>Cash Payment</span>
              <span className={styles.paymentAmount}>{formatCurrency(configuration.totalPrice)}</span>
            </div>
          </>
        )}
        {paymentOption === 'bank' && (
          <>
            <div className={styles.paymentIconCircle}>
              <FaUniversity className={styles.paymentIcon} />
            </div>
            <div>
              <span className={styles.paymentType}>Bank Transfer</span>
              <span className={styles.paymentAmount}>{formatCurrency(configuration.totalPrice)}</span>
            </div>
          </>
        )}
        {paymentOption === 'card' && (
          <>
            <div className={styles.paymentIconCircle}>
              <FaCreditCard className={styles.paymentIcon} />
            </div>
            <div>
              <span className={styles.paymentType}>Credit Card</span>
              <span className={styles.paymentAmount}>{formatCurrency(configuration.totalPrice)}</span>
            </div>
          </>
        )}
        {paymentOption === 'financing' && (
          <>
            <div className={styles.paymentIconCircle}>
              <FaFileContract className={styles.paymentIcon} />
            </div>
            <div>
              <span className={styles.paymentType}>Financing</span>
              <span className={styles.paymentAmount}>{formatCurrency(configuration.totalPrice)}</span>
            </div>
          </>
        )}
      </div>

      {paymentOption === 'financing' && financing && (
        <FinancingDetails financing={financing} />
      )}
    </div>
  );
};

export default PaymentTypeCard;