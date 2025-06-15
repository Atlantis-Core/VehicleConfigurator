import { ConfigurationSummary, FinancingObject } from "../../../../../../types/types";
import styles from "./PaymentSection.module.css";
import PaymentTypeCard from "./PaymentTypeCard/PaymentTypeCard";
import OrderStatus from "./OrderStatus";
import { ORDER_STATUS_LIST } from "../../../../../../types/constants";

interface PaymentSectionProps {
  configuration: ConfigurationSummary;
  paymentOption: string;
  financing?: FinancingObject;
  orderDate: string;
  status?: (typeof ORDER_STATUS_LIST)[number];
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  configuration,
  paymentOption,
  financing,
  orderDate,
  status
}) => {
  return (
    <div className={styles.paymentSection}>
      <div className={styles.priceTag}>
        <span className={styles.priceLabel}>Total Price</span>
        <span className={styles.priceValue}>
          {new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0
          }).format(configuration.totalPrice)}
        </span>
      </div>

      <div className={styles.paymentDetails}>
        <PaymentTypeCard
          configuration={configuration}
          paymentOption={paymentOption}
          financing={financing}
        />

        <OrderStatus
          orderDate={orderDate}
          status={status}
        />
      </div>
    </div>
  );
};

export default PaymentSection;