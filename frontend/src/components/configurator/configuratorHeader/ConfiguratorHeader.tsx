import React, { useState, useEffect } from 'react';
import { IoArrowBack, IoRefreshOutline } from "react-icons/io5"; // Added IoRefreshOutline for reset icon
import { BsBookmark, BsInfoCircleFill } from "react-icons/bs";
import LeasingModal from '@components/leasingModal';
import { Model } from '../../../types/types';
import styles from './ConfiguratorHeader.module.css';
import { useSharedLeasing } from '@context/LeasingContext';
import { saveConfigurationLocally, clearConfigurationLocally } from '@hooks/useLocalConfiguration';
import { useConfiguration } from '@context/ConfigurationContext';
import { toast } from 'react-toastify';

interface ConfiguratorHeaderProps {
  onBack: () => void;
  model: Model;
  totalPrice: number;
}

const ConfiguratorHeader: React.FC<ConfiguratorHeaderProps> = ({ onBack, model, totalPrice }) => {
  const [isLeasingModalOpen, setIsLeasingModalOpen] = useState(false);
  const { selectedOption: selectedLeasingOption, getMonthlyPaymentFor } = useSharedLeasing();

  const openLeasingModal = () => setIsLeasingModalOpen(true);
  const closeLeasingModal = () => setIsLeasingModalOpen(false);

  const {
    selectedColor, selectedRim, selectedEngine,
    selectedTransmission, selectedUpholstery, 
    selectedAssistance, selectedComfort
  } = useConfiguration();

  const saveConfiguration = () => {
    saveConfigurationLocally({
      model,
      selectedColor,
      selectedRim,
      selectedEngine,
      selectedTransmission,
      selectedUpholstery,
      selectedAssistance,
      selectedComfort,
      totalPrice
    });

    toast.success('Configuration saved successfully!');
  };

    const resetConfiguration = () => {
    // Ask for confirmation
    if (window.confirm('Are you sure you want to reset your configuration?')) {
      // Clear saved configuration from localStorage
      clearConfigurationLocally(model.id);
      
      // Add a flag to URL to indicate we're reloading after reset
      const url = new URL(window.location.href);
      url.searchParams.set('reset', 'true');
      
      // Replace current URL with the new one (with the reset parameter)
      window.location.href = url.toString();
    }
  };
  
  // Check for reset parameter
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('reset') === 'true') {
      // Remove the parameter
      url.searchParams.delete('reset');
      window.history.replaceState({}, document.title, url.toString());
      
      setTimeout(() => toast.info('Configuration has been reset'), 10);
    }
  }, []);

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

        <div className={styles.buttonGroup}>
          <button className={styles.saveButton} onClick={saveConfiguration}>
            <BsBookmark />
            <span>Save</span>
          </button>
          
          <button className={styles.resetButton} onClick={resetConfiguration}>
            <IoRefreshOutline />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfiguratorHeader;