import React from 'react';
import ReactModal from 'react-modal';
import styles from './LeasingModal.module.css';
import { IoMdClose } from 'react-icons/io';
import { FaCar, FaInfoCircle } from 'react-icons/fa';
import { useSharedLeasing } from '@context/LeasingContext';
import LeasingPlanCard from '../leasingPlanCard';

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
            <LeasingPlanCard
              key={option.months}
              option={option}
              payment={payment}
              isSelected={selectedOption === option.months}
              onSelect={selectLeasingOption}
            />
          );
        })}
      </div>

      <div className={styles.infoNote}>
        <FaInfoCircle className={styles.infoIcon} />
        <p>Final monthly payment may vary based on your configuration.</p>
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