import { useState } from 'react';
import styles from './Pricing.module.css';
import { BsInfoCircleFill } from 'react-icons/bs';
import { useSharedLeasing } from '@context/LeasingContext';
import { formatEuro } from '@utils/formatEuro';
import { useAppSelector } from '@state/hooks';
import { selectTotalPrice } from '@state/configuration/selectors';

const PricingPanel = () => {
  const [selectedOption, setSelectedOption] = useState<'cash' | 'leasing'>('cash');

  const { selectedOption: leasingSelectedOption, leasingOptions, getMonthlyPaymentFor } = useSharedLeasing();
  const totalPrice = useAppSelector(selectTotalPrice);

  const renderPricingDetails = () => {
    switch (selectedOption) {
      case 'cash':
        return (
          <div className={styles.pricingDetails}>
            <h4>
              Cash Payment
              <span className={styles.infoIcon} title="One-time payment of the total amount">
                <BsInfoCircleFill />
              </span>
            </h4>
            <p><strong>Total price:</strong> {formatEuro(totalPrice)}</p>
          </div>
        );
      case 'leasing':
        return (
          <div className={styles.pricingDetails}>
            <h4>
              Leasing
              <span className={styles.infoIcon} title="Vehicle use with monthly payments">
                <BsInfoCircleFill />
              </span>
            </h4>
            {leasingOptions.filter((leasingOption) => leasingOption.months === leasingSelectedOption).map((leasingOption) => (
              <div key={leasingOption.months}>
                <p><strong>Monthly cost:</strong> {formatEuro(getMonthlyPaymentFor(leasingOption.months))}</p>
                <p><strong>Term:</strong> {leasingOption.months} months</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.pricingContainer}>
      <h3>Financing Options</h3>
      <div className={styles.options}>
        <button
          className={`${styles.optionButton} ${selectedOption === 'cash' ? styles.selected : ''}`}
          onClick={() => setSelectedOption('cash')}
        >
          Cash Payment
        </button>
        <button
          className={`${styles.optionButton} ${selectedOption === 'leasing' ? styles.selected : ''}`}
          onClick={() => setSelectedOption('leasing')}
        >
          Leasing
        </button>
      </div>
      {renderPricingDetails()}
    </div>
  );
};

export default PricingPanel;