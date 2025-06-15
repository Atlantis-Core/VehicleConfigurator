import { useState } from 'react';
import { FaCheck, FaThumbsUp, FaInfoCircle } from 'react-icons/fa';
import styles from "./OrderStatus.module.css";
import { getStatusSteps } from '@lib/getStatusSteps';
import { formatDate } from '@lib/formatters/formatData';
import { ORDER_STATUS_LIST } from '../../../../../../../types/constants';

interface OrderStatusProps {
  orderDate: string;
  status?: (typeof ORDER_STATUS_LIST)[number];
}

const OrderStatus: React.FC<OrderStatusProps> = ({ orderDate, status = 'processing' }) => {
  const [showDetails, setShowDetails] = useState(false);

  const daysSinceOrder = Math.floor(
    (new Date().getTime() - new Date(orderDate).getTime()) / (1000 * 3600 * 24)
  );

  const statusSteps = getStatusSteps(status, daysSinceOrder);

  const currentStep = statusSteps.findIndex(step => !step.completed);
  const isComplete = currentStep === -1;

  const orderDateObj = new Date(orderDate);
  const estimatedDeliveryDate = new Date(orderDateObj);
  estimatedDeliveryDate.setDate(orderDateObj.getDate() + 125);

  return (
    <div className={styles.orderStatusCard}>
      <div className={styles.statusHeader}>
        <div className={styles.statusIconContainer}>
          <div className={`${styles.statusIcon} ${isComplete ? styles.completed : ''}`}>
            {isComplete ? <FaThumbsUp /> : statusSteps[currentStep]?.icon}
          </div>
        </div>

        <div className={styles.statusInfo}>
          <h4>{isComplete ? 'Order Complete' : statusSteps[currentStep]?.label}</h4>
          <p className={styles.statusDescription}>
            {isComplete
              ? 'Your vehicle has been delivered and is ready for pickup!'
              : statusSteps[currentStep]?.description}
          </p>
        </div>

        <button
          className={`${styles.detailsToggle} ${showDetails ? styles.active : ''}`}
          onClick={() => setShowDetails(!showDetails)}
          aria-label={showDetails ? "Hide delivery process" : "Show delivery process"}
        >
          <span className={styles.toggleText}>
            {showDetails ? 'Hide Process' : 'Show Process'}
          </span>
          <FaInfoCircle size={16} className={styles.toggleIcon} />
        </button>
      </div>

      {showDetails && (
        <div className={styles.statusDetailsContainer}>
          <div className={styles.deliveryEstimate}>
            <span>Ordered: {formatDate(orderDateObj)}</span>
            <span className={styles.estimatedDelivery}>
              Est. Delivery: {formatDate(estimatedDeliveryDate)}
            </span>
          </div>

          <div className={styles.statusProgress}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${Math.min(100, (isComplete ? 100 : (currentStep / statusSteps.length) * 100))}%`
                }}
              />
            </div>
          </div>

          <div className={styles.statusSteps}>
            {statusSteps.map((step, index) => (
              <div
                key={index}
                className={`${styles.statusStep} ${step.completed ? styles.completed : ''} ${currentStep === index ? styles.current : ''}`}
              >
                <div className={styles.stepIconContainer}>
                  <div className={styles.statusDot}>
                    {step.completed && <FaCheck className={styles.completedIcon} />}
                  </div>
                  <div className={styles.stepConnector} />
                </div>
                <div className={styles.stepInfo}>
                  <span className={styles.stepLabel}>{step.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;