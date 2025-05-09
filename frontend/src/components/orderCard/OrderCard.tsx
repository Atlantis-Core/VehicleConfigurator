import { formatDistanceToNow } from "date-fns";
import { OrderWithDetails } from "../../types/types";
import styles from "./OrderCard.module.css";
import {
  FaCarAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaCalendarAlt,
  FaTachometerAlt,
  FaPaintBrush,
  FaCogs,
  FaChevronDown,
  FaShieldAlt,
  FaCouch,
  FaPercent,
  FaTruck,
  FaFileInvoice,
  FaExclamationCircle,
} from 'react-icons/fa';
import { formatCurrency } from "@lib/formatCurrency";
import { downloadInvoicePDF } from "@lib/downloadInvoicePDF";

const OrderCard: React.FC<{ order: OrderWithDetails }> = ({ order }) => {

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Unknown date';
    }
  };

  const downloadInvoice = () => {
    downloadInvoicePDF(order);
  }

  return (
    <div key={order.id} className={styles.orderCard}>
      {/* Order header */}
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

      <div className={styles.orderDetails}>
        {order.configuration ? (
          <>
            <div className={styles.orderContent}>

              { /* Vehicle Section */}
              <div className={styles.vehicleSection}>
                <div className={styles.vehicleVisual}>
                  {order.configuration.model?.imageUrl ? (
                    <div className={styles.modelImage}>
                      <img 
                        src={order.configuration.model.imageUrl} 
                        alt={`${order.configuration.model?.name || 'Vehicle'} in ${order.configuration.selectedColor?.name || 'selected color'}`}
                        className={styles.vehicleImage}
                      />
                    </div>
                  ) : (
                    <div className={styles.modelBadge} style={{
                      backgroundColor: order.configuration.selectedColor?.hexCode || '#333',
                      color: order.configuration.selectedColor?.hexCode ?? '#fff'
                    }}>
                      <FaCarAlt className={styles.vehicleIconLarge} />
                      <span className={styles.modelName}>{order.configuration.model?.name}</span>
                    </div>
                  )}
                </div>

                <div className={styles.vehicleDetails}>
                  <h4 className={styles.vehicleTitle}>{order.configuration.model?.name || 'Unknown Model'}</h4>
                  <p className={styles.modelType}>{order.configuration.model?.type || ''}</p>

                  <div className={styles.specsTabs}>
                    <div className={styles.specsTab}>
                      <div className={styles.specHeader}>
                        <div className={styles.specIcon}><FaTachometerAlt /></div>
                        <h5>Performance</h5>
                      </div>
                      <div className={styles.tabContent}>
                        {order.configuration.selectedEngine && (
                          <div className={styles.specItem}>
                            <span className={styles.specName}>Engine</span>
                            <span className={styles.specValue}>{order.configuration.selectedEngine.name}</span>
                          </div>
                        )}
                        {order.configuration.selectedTransmission && (
                          <div className={styles.specItem}>
                            <span className={styles.specName}>Transmission</span>
                            <span className={styles.specValue}>{order.configuration.selectedTransmission.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.specsTab}>
                      <div className={styles.specHeader}>
                        <div className={styles.specIcon}><FaPaintBrush /></div>
                        <h5>Appearance</h5>
                      </div>
                      <div className={styles.tabContent}>
                        {order.configuration.selectedColor && (
                          <div className={styles.specItem}>
                            <span className={styles.specName}>Color</span>
                            <span className={styles.specValue}>
                              <span
                                className={styles.colorSwatch}
                                style={{ backgroundColor: order.configuration.selectedColor.hexCode || '#ccc' }}
                              ></span>
                              {order.configuration.selectedColor.name}
                            </span>
                          </div>
                        )}
                        {order.configuration.selectedRim && (
                          <div className={styles.specItem}>
                            <span className={styles.specName}>Wheels</span>
                            <span className={styles.specValue}>{order.configuration.selectedRim.name} ({order.configuration.selectedRim.size}")</span>
                          </div>
                        )}
                        {order.configuration.selectedUpholstery && (
                          <div className={styles.specItem}>
                            <span className={styles.specName}>Interior</span>
                            <span className={styles.specValue}>{order.configuration.selectedUpholstery.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Features Section */}
                  {(order.configuration.selectedAssistance?.length > 0 ||
                    order.configuration.selectedComfort?.length > 0) && (
                      <div className={styles.featuresAccordion}>
                        <details>
                          <summary className={styles.featuresToggle}>
                            <FaCogs className={styles.featureIcon} />
                            <span>Selected Features</span>
                            <FaChevronDown className={styles.toggleIcon} />
                          </summary>
                          <div className={styles.featureColumns}>
                            {order.configuration.selectedAssistance?.length > 0 && (
                              <div className={styles.featureColumn}>
                                <h6><FaShieldAlt /> Assistance Features</h6>
                                <ul className={styles.featureList}>
                                  {order.configuration.selectedAssistance.map(feature => (
                                    <li key={feature.id}>
                                      <span className={styles.featureBullet} />
                                      {feature.name}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {order.configuration.selectedComfort?.length > 0 && (
                              <div className={styles.featureColumn}>
                                <h6><FaCouch /> Comfort Features</h6>
                                <ul className={styles.featureList}>
                                  {order.configuration.selectedComfort.map(feature => (
                                    <li key={feature.id}>
                                      <span className={styles.featureBullet} />
                                      {feature.name}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </details>
                      </div>
                    )}
                </div>
              </div>

              {/* Payment Information */}
              <div className={styles.paymentSection}>
                <div className={styles.priceTag}>
                  <span className={styles.priceLabel}>Total</span>
                  <span className={styles.priceValue}>{formatCurrency(order.configuration.totalPrice)}</span>
                </div>

                <div className={styles.paymentDetails}>
                  <div className={styles.paymentTypeCard}
                    style={{
                      backgroundColor: order.paymentOption === 'financing' ? '#f0f7ff' : '#f7f7f7',
                      borderColor: order.paymentOption === 'financing' ? '#cce0ff' : '#e0e0e0'
                    }}>

                    <div className={styles.paymentHeader}>
                      {order.paymentOption === 'cash' && (
                        <>
                          <div className={styles.paymentIconCircle}>
                            <FaMoneyBillWave className={styles.paymentIcon} />
                          </div>
                          <div>
                            <span className={styles.paymentType}>Full Payment</span>
                            <span className={styles.paymentAmount}>{formatCurrency(order.configuration.totalPrice)}</span>
                          </div>
                        </>
                      )}
                      {order.paymentOption === 'financing' && (
                        <>
                          <div className={styles.paymentIconCircle}>
                            <FaCreditCard className={styles.paymentIcon} />
                          </div>
                          <div>
                            <span className={styles.paymentType}>Financing</span>
                            <span className={styles.paymentAmount}>{formatCurrency(order.configuration.totalPrice)}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {order.paymentOption === 'financing' && order.financing && (() => {
                      try {
                        const financingDetails = typeof order.financing === 'string'
                          ? JSON.parse(order.financing)
                          : order.financing;

                        return (
                          <div className={styles.financingGrid}>
                            <div className={styles.financingItem}>
                              <FaCalendarAlt className={styles.financeItemIcon} />
                              <div>
                                <span className={styles.financeItemLabel}>Term</span>
                                <span className={styles.financeItemValue}>
                                  {financingDetails.label || `${financingDetails.months} Months`}
                                </span>
                              </div>
                            </div>

                            <div className={styles.financingItem}>
                              <FaPercent className={styles.financeItemIcon} />
                              <div>
                                <span className={styles.financeItemLabel}>Interest Rate</span>
                                <span className={styles.financeItemValue}>{financingDetails.rate}</span>
                              </div>
                            </div>

                            <div className={styles.monthlyPayment}>
                              <div>
                                <span className={styles.monthlyLabel}>Monthly Payment</span>
                                <span className={styles.monthlyAmount}>
                                  {formatCurrency(financingDetails.monthlyPayment)}
                                </span>
                              </div>
                              <div className={styles.totalFinanceAmount}>
                                Total: {formatCurrency(financingDetails.totalAmount)}
                              </div>
                            </div>
                          </div>
                        );
                      } catch (e) {
                        return <p>Financing details unavailable</p>;
                      }
                    })()}
                  </div>

                  <div className={styles.orderStatusCard}>
                    <div className={styles.statusHeader}>
                      <FaTruck className={styles.statusIcon} />
                      <span>Order Status</span>
                    </div>

                    <div className={styles.statusSteps}>
                      <div className={`${styles.statusStep} ${styles.completed}`}>
                        <div className={styles.statusDot} />
                        <div>
                          <span className={styles.stepLabel}>Order Placed</span>
                          <span className={styles.stepDate}>{formatDate(order.orderDate)}</span>
                        </div>
                      </div>

                      <div className={`${styles.statusStep} ${styles.current}`}>
                        <div className={styles.statusDot} />
                        <div>
                          <span className={styles.stepLabel}>Processing</span>
                          <span className={styles.stepDate}>In progress</span>
                        </div>
                      </div>

                      <div className={styles.statusStep}>
                        <div className={styles.statusDot} />
                        <div>
                          <span className={styles.stepLabel}>Ready for Delivery</span>
                          <span className={styles.stepDate}>Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Actions */}
            <div className={styles.orderActions}>
              <button className={`${styles.actionButton} ${styles.primaryAction}`} onClick={downloadInvoice}>
                <FaFileInvoice className={styles.buttonIcon} />
                Download Invoice
              </button>
            </div>
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