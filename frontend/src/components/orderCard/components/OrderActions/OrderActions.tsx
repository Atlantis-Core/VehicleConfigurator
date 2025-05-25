import { FaFileInvoiceDollar } from 'react-icons/fa';
import { OrderWithDetails } from "../../../../types/types";
import styles from "./OrderActions.module.css";
import { downloadInvoicePDF } from '@lib/downloadInvoicePDF';

interface OrderActionsProps {
  order: OrderWithDetails;
}

const OrderActions: React.FC<OrderActionsProps> = ({ order }) => {
  const handleDownloadInvoice = () => {
    downloadInvoicePDF(order);
  };

  return (
    <div className={styles.orderActions}>
      <button 
        className={styles.invoiceButton} 
        onClick={handleDownloadInvoice}
        aria-label="Download invoice"
      >
        <FaFileInvoiceDollar className={styles.invoiceIcon} />
        <span>Download Invoice</span>
      </button>
    </div>
  );
};

export default OrderActions;