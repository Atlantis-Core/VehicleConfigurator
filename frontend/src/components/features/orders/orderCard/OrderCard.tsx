import styles from './OrderCard.module.css';
import { OrderWithDetails } from '../../../../types/types';
import { FaExclamationCircle } from 'react-icons/fa';
import {
  OrderHeader,
  VehicleSection,
  PaymentSection,
  OrderActions
} from './components';
import { ORDER_STATUS_LIST } from '../../../../types/constants';

const OrderCard: React.FC<{ order: OrderWithDetails }> = ({ order }) => {

  return (
    <div key={order.id} className={styles.orderCard}>
      <OrderHeader
        order={order}
      />

      <div className={styles.orderDetails}>
        {order.configuration ? (
          <>
            <div className={styles.orderContent}>
              <VehicleSection
                configuration={order.configuration}
              />
              <PaymentSection
                configuration={order.configuration}
                paymentOption={order.paymentOption}
                financing={typeof order.financing === 'string' ? JSON.parse(order.financing) : order.financing}
                orderDate={order.orderDate}
                status={ORDER_STATUS_LIST[0] /* processing */} />
            </div>
            <OrderActions
              order={order}
            />
          </>
        ) : (
          <div className={styles.missingConfig}>
            <FaExclamationCircle className={styles.errorIcon} />
            <p>Configuration details are not available for this order.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderCard;