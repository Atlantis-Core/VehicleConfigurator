import React from 'react';
import styles from './PaymentSection.module.css';
import PaymentOptions from './paymentOptions';
import LeasingOptions from './leasingOptions';

interface PaymentSectionProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  leasingOptions: any[];
  selectedOption: number | null;
  onSelectLeasingOption: (months: number) => void;
  getMonthlyPaymentFor: (months: number) => number;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  paymentMethod,
  onPaymentMethodChange,
  leasingOptions,
  selectedOption,
  onSelectLeasingOption,
  getMonthlyPaymentFor
}) => {
  return (
    <div className={styles.paymentSection}>
      <h2>Payment Method</h2>
      
      <PaymentOptions
        selectedMethod={paymentMethod}
        onMethodChange={onPaymentMethodChange}
      />

      {paymentMethod === 'financing' && (
        <LeasingOptions
          leasingOptions={leasingOptions}
          selectedOption={selectedOption}
          onSelectOption={onSelectLeasingOption}
          getMonthlyPaymentFor={getMonthlyPaymentFor}
        />
      )}
    </div>
  );
};

export default PaymentSection;