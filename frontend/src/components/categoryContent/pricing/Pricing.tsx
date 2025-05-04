import React, { useState } from 'react';
import styles from './Pricing.module.css';
import { BsInfoCircleFill } from 'react-icons/bs';

interface PricingProps {
  totalPrice: number;
}

const Pricing: React.FC<PricingProps> = ({ totalPrice }) => {
  const [selectedOption, setSelectedOption] = useState<'cash' | 'leasing' | 'financing'>('cash');

  const leasingDetails = {
    duration: 36, // in months
    interestRate: 0.03, // 3% annual interest
    downPayment: totalPrice * 0.2, // 20% of total price
  };

  const financingDetails = {
    duration: 60, // in months
    interestRate: 0.05, // 5% annual interest
    downPayment: totalPrice * 0.1, // 10% of total price
  };

  const calculateMonthlyCost = (price: number, duration: number, interestRate: number, downPayment: number) => {
    const loanAmount = price - downPayment;
    const monthlyInterestRate = interestRate / 12;
    return (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -duration));
  };

  const renderPricingDetails = () => {
    switch (selectedOption) {
      case 'cash':
        return (
          <div className={styles.pricingDetails}>
            <h4>
              Barzahlung
              <span className={styles.infoIcon} title="Einmalige Zahlung des Gesamtbetrags">
                <BsInfoCircleFill />
              </span>
            </h4>
            <p><strong>Gesamtpreis:</strong> {totalPrice.toLocaleString()} €</p>
          </div>
        );
      case 'leasing':
        const leasingMonthlyCost = calculateMonthlyCost(
          totalPrice,
          leasingDetails.duration,
          leasingDetails.interestRate,
          leasingDetails.downPayment
        );
        return (
          <div className={styles.pricingDetails}>
            <h4>
              Leasing
              <span className={styles.infoIcon} title="Fahrzeugnutzung gegen monatliche Zahlungen">
                <BsInfoCircleFill />
              </span>
            </h4>
            <p><strong>Monatliche Kosten:</strong> {leasingMonthlyCost.toFixed(2)} €</p>
            <p><strong>Laufzeit:</strong> {leasingDetails.duration} Monate</p>
            <p><strong>Anzahlung:</strong> {leasingDetails.downPayment.toLocaleString()} €</p>
          </div>
        );
      case 'financing':
        const financingMonthlyCost = calculateMonthlyCost(
          totalPrice,
          financingDetails.duration,
          financingDetails.interestRate,
          financingDetails.downPayment
        );
        return (
          <div className={styles.pricingDetails}>
            <h4>
              Finanzierung
              <span className={styles.infoIcon} title="Kauf mit Ratenzahlung">
                <BsInfoCircleFill />
              </span>
            </h4>
            <p><strong>Monatliche Kosten:</strong> {financingMonthlyCost.toFixed(2)} €</p>
            <p><strong>Laufzeit:</strong> {financingDetails.duration} Monate</p>
            <p><strong>Anzahlung:</strong> {financingDetails.downPayment.toLocaleString()} €</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.pricingContainer}>
      <h3>Finanzierungsoptionen</h3>
      <div className={styles.options}>
        <button
          className={`${styles.optionButton} ${selectedOption === 'cash' ? styles.selected : ''}`}
          onClick={() => setSelectedOption('cash')}
        >
          Barzahlung
        </button>
        <button
          className={`${styles.optionButton} ${selectedOption === 'leasing' ? styles.selected : ''}`}
          onClick={() => setSelectedOption('leasing')}
        >
          Leasing
        </button>
        <button
          className={`${styles.optionButton} ${selectedOption === 'financing' ? styles.selected : ''}`}
          onClick={() => setSelectedOption('financing')}
        >
          Finanzierung
        </button>
      </div>
      {renderPricingDetails()}
    </div>
  );
};

export default Pricing;