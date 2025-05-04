import React, { useState } from 'react';
import ReactModal from 'react-modal';
import styles from './LeasingModal.module.css';
import { IoMdClose } from 'react-icons/io';
import { FaCar, FaCheck, FaInfoCircle } from 'react-icons/fa';
import { calculateLeasingPrice } from '@lib/calculateLeasingPrice';

interface LeasingModalProps {
  isOpen: boolean;
  onClose: () => void;
  basePrice: number;
}

const LeasingModal: React.FC<LeasingModalProps> = ({ isOpen, onClose, basePrice }) => {
  const [activePlan, setActivePlan] = useState<number>(36); // Default to 36 months
  
  const leasingOptions = [
    { months: 12, label: '12 Months', rate: '4.5%', features: ['Higher monthly payments', 'Newest model sooner', 'Lower total cost'] },
    { months: 24, label: '24 Months', rate: '3.8%', features: ['Balanced option', '2 year warranty coverage', 'Moderate payments'] },
    { months: 36, label: '36 Months', rate: '3.2%', features: ['Most popular plan', 'Lower monthly cost', 'Balanced ownership period'] },
    { months: 48, label: '48 Months', rate: '2.8%', features: ['Lowest monthly payments', 'Longer commitment', 'Higher total interest'] }
  ];

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
      ariaHideApp={false}
    >
      <div className={styles.modalHeader}>
        <div className={styles.modalTitle}>
          <FaCar className={styles.modalIcon} />
          <h2>Leasing Options</h2>
        </div>
        <button onClick={onClose} className={styles.closeModalButton}>
          <IoMdClose />
        </button>
      </div>

      <div className={styles.modalDescription}>
        <p>Select the leasing term that best fits your needs:</p>
      </div>

      <div className={styles.leasingPlans}>
        {leasingOptions.map(option => (
          <div 
            key={option.months}
            className={`${styles.leasingPlan} ${activePlan === option.months ? styles.activePlan : ''}`}
            onClick={() => setActivePlan(option.months)}
          >
            <div className={styles.planHeader}>
              <h3>{option.label}</h3>
              {activePlan === option.months && <FaCheck className={styles.checkIcon} />}
            </div>
            <div className={styles.planPrice}>
              <span className={styles.amount}>{calculateLeasingPrice(option.months, basePrice)} €</span>
              <span className={styles.period}>/month</span>
            </div>
            <div className={styles.planRate}>Interest rate: {option.rate}</div>
            <ul className={styles.planFeatures}>
              {option.features.map((feature, index) => (
                <li key={index}>
                  <span className={styles.featureBullet}>•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.infoNote}>
        <FaInfoCircle className={styles.infoIcon} />
        <p>Prices are based on the base model without additional features. Final monthly payment may vary based on your configuration.</p>
      </div>

      <div className={styles.modalActions}>
        <button onClick={onClose} className={styles.secondaryButton}>
          Cancel
        </button>
        <button onClick={onClose} className={styles.primaryButton}>
          Apply {activePlan} Month Plan
        </button>
      </div>
    </ReactModal>
  );
}

export default LeasingModal;