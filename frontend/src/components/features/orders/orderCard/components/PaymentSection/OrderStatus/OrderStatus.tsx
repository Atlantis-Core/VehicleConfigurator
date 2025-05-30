import { useState } from 'react';
import { 
  FaCheck, 
  FaTruck, 
  FaWrench, 
  FaRegClock, 
  FaThumbsUp,
  FaInfoCircle
} from 'react-icons/fa';
import styles from "./OrderStatus.module.css";

interface OrderStatusProps {
  orderDate: string;
  status?: string;
}

const OrderStatus: React.FC<OrderStatusProps> = ({ orderDate, status = 'processing' }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Calculate days since order
  const daysSinceOrder = Math.floor(
    (new Date().getTime() - new Date(orderDate).getTime()) / (1000 * 3600 * 24)
  );
  
  // Define status steps and their completion state
  const statusSteps = [
    { 
      label: 'Order Received', 
      completed: true, 
      icon: <FaCheck />,
      description: 'Your order has been received and is being processed.'
    },
    { 
      label: 'Processing', 
      completed: status === 'processing' || status === 'production' || status === 'shipping' || status === 'delivered' || daysSinceOrder > 2, 
      icon: <FaRegClock />,
      description: 'Your order is being processed and prepared for production.'
    },
    { 
      label: 'Production', 
      completed: status === 'production' || status === 'shipping' || status === 'delivered' || daysSinceOrder > 7, 
      icon: <FaWrench />,
      description: 'Your vehicle is currently being manufactured according to your configuration.'
    },
    { 
      label: 'Shipping', 
      completed: status === 'shipping' || status === 'delivered' || daysSinceOrder > 14, 
      icon: <FaTruck />,
      description: 'Your vehicle has been completed and is on its way to your selected dealership.'
    },
    { 
      label: 'Delivered', 
      completed: status === 'delivered' || daysSinceOrder > 21, 
      icon: <FaThumbsUp />,
      description: 'Your vehicle has been delivered and is ready for pickup at your selected dealership.'
    }
  ];

  const currentStep = statusSteps.findIndex(step => !step.completed);
  const isComplete = currentStep === -1;
  
  // Calculate expected delivery date (simple estimate: 21 days from order date)
  const orderDateObj = new Date(orderDate);
  const estimatedDeliveryDate = new Date(orderDateObj);
  estimatedDeliveryDate.setDate(orderDateObj.getDate() + 125);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

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