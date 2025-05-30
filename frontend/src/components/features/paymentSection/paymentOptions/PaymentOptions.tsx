import React from 'react';
import {
  FaHandHoldingUsd,
  FaUniversity,
  FaCreditCard,
  FaFileContract
} from 'react-icons/fa';
import styles from './PaymentOptions.module.css';

interface PaymentOptionsProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  selectedMethod,
  onMethodChange
}) => {
  const paymentMethods = [
    {
      id: 'financing',
      label: 'Financing',
      icon: <FaFileContract />,
      description: 'Monthly payments with flexible terms'
    },
    {
      id: 'bank',
      label: 'Bank Transfer',
      icon: <FaUniversity />,
      description: 'Direct bank transfer payment'
    },
    {
      id: 'cash',
      label: 'Cash',
      icon: <FaHandHoldingUsd />,
      description: 'Pay in full at pickup'
    },
    {
      id: 'card',
      label: 'Credit Card',
      icon: <FaCreditCard />,
      description: 'Pay with your credit card'
    }
  ];

  return (
    <div className={styles.paymentOptions}>
      {paymentMethods.map((method) => (
        <div
          key={method.id}
          className={`${styles.paymentOption} ${selectedMethod === method.id ? styles.selected : ''
            }`}
          onClick={() => onMethodChange(method.id)}
        >
          <div className={styles.paymentIcon}>
            {method.icon}
          </div>
          <div className={styles.paymentContent}>
            <span className={styles.paymentLabel}>{method.label}</span>
            <span className={styles.paymentDescription}>{method.description}</span>
          </div>
          <div className={styles.checkmark}>
            {selectedMethod === method.id && '✓'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentOptions;