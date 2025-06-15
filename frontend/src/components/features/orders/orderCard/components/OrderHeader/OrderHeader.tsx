import { formatDistanceToNow } from "date-fns";
import { OrderWithDetails } from "../../../../../../types/types";
import styles from "./OrderHeader.module.css";
import { formatCurrency } from "@lib/formatters/formatCurrency";

interface OrderHeaderProps {
  order: OrderWithDetails;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ order }) => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Unknown date';
    }
  };

  return (
    <div className={styles.orderHeader}>
      <div className={styles.orderInfo}>
        <h3>Order #{order.id}</h3>
        <span className={styles.orderDate}>
          {formatDate(order.orderDate)}
        </span>
      </div>
      <div className={styles.orderAmount}>
        {order.configuration ?
          formatCurrency(order.configuration.totalPrice) :
          'Price unavailable'}
      </div>
    </div>
  );
};

export default OrderHeader;