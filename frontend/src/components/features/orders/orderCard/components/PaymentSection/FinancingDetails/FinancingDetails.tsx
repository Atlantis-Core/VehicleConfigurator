import { 
  FaPercentage, 
  FaMoneyBillWave, 
  FaCreditCard 
} from 'react-icons/fa';
import styles from "./FinancingDetails.module.css";
import { formatCurrency } from "@lib/formatCurrency";
import { FinancingObject } from '../../../../../types/types';

interface FinancingDetailsObject {
  financing: FinancingObject;
}

const FinancingDetails: React.FC<FinancingDetailsObject> = ({ financing }) => {

  if (!financing) return null;

  return (
    <div className={styles.financingDetails}>
      <div className={styles.financingGrid}>
        <div className={styles.financingItem}>
          <div className={styles.financeItemIcon}>
            <FaCreditCard />
          </div>
          <div>
            <div className={styles.financeItemLabel}>Payment Plan</div>
            <div className={styles.financeItemValue}>
              {financing.label || "Standard Plan"}
            </div>
          </div>
        </div>
        
        <div className={styles.financingItem}>
          <div className={styles.financeItemIcon}>
            <FaPercentage />
          </div>
          <div>
            <div className={styles.financeItemLabel}>Interest Rate</div>
            <div className={styles.financeItemValue}>
              {financing.rate || "0.00%"}
            </div>
          </div>
        </div>
        
        <div className={styles.financingItem}>
          <div className={styles.financeItemIcon}>
            <FaMoneyBillWave />
          </div>
          <div>
            <div className={styles.financeItemLabel}>Total Finance Amount</div>
            <div className={styles.financeItemValue}>
              {formatCurrency(financing.totalAmount || 0)}
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.monthlyPayment}>
        <div className={styles.monthlyLabel}>Monthly Payment</div>
        <div className={styles.monthlyAmount}>
          {formatCurrency(financing.monthlyPayment || 0)}
        </div>
      </div>
    </div>
  );
};

export default FinancingDetails;