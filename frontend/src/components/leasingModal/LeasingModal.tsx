import React from 'react';
import ReactModal from 'react-modal';
import styles from './LeasingModal.module.css';
import { IoMdClose } from 'react-icons/io';
import { FaCar, FaCheck, FaInfoCircle } from 'react-icons/fa';
import { useSharedLeasing } from '@context/LeasingContext';

interface LeasingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeasingModal: React.FC<LeasingModalProps> = ({ isOpen, onClose }) => {
  
  const {
    leasingOptions,
    selectedOption,
    getMonthlyPaymentFor,
    selectLeasingOption
  } = useSharedLeasing();

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
        {leasingOptions.map(option => {
          const payment = getMonthlyPaymentFor(option.months);
          
          return (
            <div 
              key={option.months}
              className={`${styles.leasingPlan} ${selectedOption === option.months ? styles.activePlan : ''}`}
              onClick={() => selectLeasingOption(option.months)}
            >
              <div className={styles.planHeader}>
                <h3>{option.label}</h3>
                {selectedOption === option.months && <FaCheck className={styles.checkIcon} />}
              </div>
              <div className={styles.planPrice}>
                <span className={styles.amount}>
                  {payment.toLocaleString()} €
                </span>
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
          );
        })}
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
          Apply {selectedOption} Month Plan
        </button>
      </div>
    </ReactModal>
  );
}

export default LeasingModal;