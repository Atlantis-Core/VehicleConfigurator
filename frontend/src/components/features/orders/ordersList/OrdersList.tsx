import { FaFileAlt } from 'react-icons/fa';
import { OrderWithDetails } from '../../../../types/types';
import OrderCard from '../orderCard';
import styles from './OrdersList.module.css';

interface OrdersListProps {
  orders: OrderWithDetails[];
  isLoading: boolean;
  onConfigureClick: () => void;
}

const OrdersList = ({ orders, isLoading, onConfigureClick }: OrdersListProps) => {
  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loader}></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={styles.emptyState}>
        <FaFileAlt size={48} />
        <h2>No Orders Found</h2>
        <p>You haven't placed any orders yet</p>
        <button className={styles.configureButton} onClick={onConfigureClick}>
          Configure a Vehicle
        </button>
      </div>
    );
  }

  return (
    <div className={styles.ordersList}>
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrdersList;