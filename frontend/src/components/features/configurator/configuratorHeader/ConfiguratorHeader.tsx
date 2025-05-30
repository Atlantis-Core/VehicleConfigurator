import React, { useState, useEffect, useCallback } from 'react';
import { IoArrowBack, IoRefreshOutline } from "react-icons/io5";
import { BsBookmark, BsInfoCircleFill } from "react-icons/bs";
import LeasingModal from '@components/features/leasing/leasingModal';
import { Model } from '../../../../types/types';
import styles from './ConfiguratorHeader.module.css';
import { useSharedLeasing } from '@context/LeasingContext';
import { deleteConfigurationLocally, saveConfigurationLocally } from '@hooks/useLocalConfiguration';
import { useConfiguration } from '@context/ConfigurationContext';
import { toast } from 'react-toastify';
import { formatEuro } from '@utils/formatEuro';

interface ConfiguratorHeaderProps {
  onBack: () => void;
  model: Model;
  totalPrice: number;
  loadedSavedConfig: string | null;
}

const ConfiguratorHeader: React.FC<ConfiguratorHeaderProps> = ({ onBack, model, totalPrice, loadedSavedConfig }) => {
  const [isLeasingModalOpen, setIsLeasingModalOpen] = useState(false);
  const { selectedOption: selectedLeasingOption, getMonthlyPaymentFor } = useSharedLeasing();

  const openLeasingModal = () => setIsLeasingModalOpen(true);
  const closeLeasingModal = () => setIsLeasingModalOpen(false);

  const {
    selectedColor, selectedRim, selectedEngine,
    selectedTransmission, selectedUpholstery, 
    selectedAssistance, selectedComfort
  } = useConfiguration();

  const saveConfiguration = useCallback(() => {
    // Create an ID and save it
    const configId = saveConfigurationLocally({
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

    toast.success('Configuration saved successfully!', {
      toastId: 'config-saved', // Prevent duplicate toasts
    });
    
    return configId;
  }, [
    model,
    selectedColor,
    selectedRim,
    selectedEngine,
    selectedTransmission,
    selectedUpholstery,
    selectedAssistance,
    selectedComfort,
    totalPrice
  ]);

  const resetConfiguration = useCallback(() => {
    // Ask for confirmation
    if (window.confirm('Are you sure you want to reset your configuration?')) {
      try {
        if (loadedSavedConfig) {
          deleteConfigurationLocally(loadedSavedConfig);
        }
        
        const url = new URL(window.location.href);
        url.searchParams.set('reset', 'true');
        
        // Add a unique timestamp to ensure the browser doesn't use cached content
        url.searchParams.set('t', Date.now().toString());
        
        // Force a full page refresh
        window.location.href = url.toString();
      } catch (error) {
        console.error('Error during reset:', error);
        toast.error('An error occurred while resetting the configuration');
        
        // Force page reload as a fallback to reset everything
        window.location.reload();
      }
    }
  }, [loadedSavedConfig, model]);
  
  // Check for reset parameter
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('reset') === 'true') {
      // Remove the parameter
      url.searchParams.delete('reset');
      window.history.replaceState({}, document.title, url.toString());
      
      setTimeout(() => toast.info('Configuration has been reset', {
        toastId: 'config-reset'
      }), 100);
    }
  }, []);

  const handleSaveClick = useCallback(() => {
    saveConfiguration();
  }, [saveConfiguration]);

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
            <div className={styles.priceValue}>{ formatEuro(totalPrice) }</div>
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
              { formatEuro(getMonthlyPaymentFor(selectedLeasingOption)) }
              <span className={styles.leaseTerms}>/mo.</span>
            </div>
          </div>
        </div>

        <LeasingModal
          isOpen={isLeasingModalOpen}
          onClose={closeLeasingModal}
        />

        <div className={styles.buttonGroup}>
          <button className={styles.saveButton} onClick={handleSaveClick}>
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