import React, { useState } from 'react';
import { IoArrowBack } from "react-icons/io5";
import { BsBookmark, BsInfoCircleFill } from "react-icons/bs";
import LeasingModal from '@components/leasingModal';
import { Model } from '../../../types/types';
import styles from './ConfiguratorHeader.module.css';
import { useSharedLeasing } from '@context/LeasingContext';

interface ConfiguratorHeaderProps {
  onBack: () => void;
  model: Model;
  totalPrice: number;
}

const ConfiguratorHeader: React.FC<ConfiguratorHeaderProps> = ({ 
  onBack, 
  model, 
  totalPrice 
}) => {
  const [isLeasingModalOpen, setIsLeasingModalOpen] = useState(false);
  const { selectedOption: selectedLeasingOption, getMonthlyPaymentFor } = useSharedLeasing();

  const openLeasingModal = () => setIsLeasingModalOpen(true);
  const closeLeasingModal = () => setIsLeasingModalOpen(false);

  return (
    <div className={styles.topHeader}>
      <div className={styles.headerLeft}>
        <button onClick={onBack} className={styles.backButton}>
          <IoArrowBack />
          <span>Back</span>
        </button>
      </div>

      <div className={styles.headerCenter}>
        <h1 className={styles.modelName}>{model.name}</h1>
        <div className={styles.modelSubtitle}>{model.type}</div>
      </div>

      <div className={styles.headerRight}>
        <div className={styles.priceWrapper}>
          <div className={styles.priceDetail}>
            <div className={styles.priceLabel}>Total Price</div>
            <div className={styles.priceValue}>{totalPrice.toLocaleString()} €</div>
          </div>

          <div className={styles.priceDivider}></div>

          <div className={styles.priceDetail}>
            <div className={styles.priceLabel}>
              Monthly Leasing
              <button
                className={styles.infoButton}
                onClick={openLeasingModal}
                aria-label="View leasing options"
              >
                <span className={styles.infoIconWrapper}>
                  <BsInfoCircleFill />
                </span>
              </button>
            </div>
            <div className={styles.priceValue}>
              {getMonthlyPaymentFor(selectedLeasingOption)}
              <span className={styles.leaseTerms}>/mo.</span>
            </div>
          </div>
        </div>

        <LeasingModal
          isOpen={isLeasingModalOpen}
          onClose={closeLeasingModal}
        />

        <button className={styles.saveButton}>
          <BsBookmark />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

export default ConfiguratorHeader;