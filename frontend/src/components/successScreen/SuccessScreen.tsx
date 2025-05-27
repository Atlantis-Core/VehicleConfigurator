import { IoCheckmarkCircle } from "react-icons/io5";
import styles from "./SuccessScreen.module.css";
import { ConfigurationSummary, Customer } from "../../types/types";

interface SuccessScreenProps {
  contactInfo: Customer;
  configuration: ConfigurationSummary;
  orderId: String;
  onNavigateHome: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ contactInfo, configuration, orderId, onNavigateHome }) => {
  return (
    <div className={styles.container}>
      <div className={styles.successContainer}>
        <div className={styles.successIcon}>
          <IoCheckmarkCircle />
        </div>
        <h1>Thank You for Your Order!</h1>
        <p>Congratulations, {contactInfo.firstName}! Your {configuration.model.name} has been configured successfully.</p>
        <p className={styles.confirmationDetails}>
          We've sent a detailed confirmation to <strong>{contactInfo.email}</strong> with all the specifications of your dream car.
        </p>
        <div className={styles.orderInfo}>
          <p>Order Number: <strong>CFG-{orderId}</strong></p>
        </div>
        <p className={styles.nextSteps}>
          A dealer representative will contact you within 24-48 hours to discuss delivery options and finalize your purchase.
        </p>
        <div className={styles.buttonGroup}>
          <button
            className={styles.homeButton}
            onClick={onNavigateHome}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessScreen;