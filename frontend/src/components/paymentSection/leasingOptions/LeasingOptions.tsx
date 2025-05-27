import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import styles from './LeasingOptions.module.css';
import LeasingPlanCard from '../../leasingPlanCard/LeasingPlanCard';

interface LeasingOptionsProps {
  leasingOptions: any[];
  selectedOption: number | null;
  onSelectOption: (months: number) => void;
  getMonthlyPaymentFor: (months: number) => number;
}

const LeasingOptions: React.FC<LeasingOptionsProps> = ({
  leasingOptions,
  selectedOption,
  onSelectOption,
  getMonthlyPaymentFor
}) => {

  return (
    <div className={styles.leasingOptions}>
      <h3 className={styles.sectionTitle}>
        <FaCalendarAlt className={styles.titleIcon} />
        Choose Your Financing Term
      </h3>

      <div className={styles.optionsGrid}>
        {leasingOptions.map((term) => {
          const monthlyPayment = getMonthlyPaymentFor(term.months);

          return (
            <div key={term.months} className={term.popular ? styles.popularWrapper : ''}>
              {term.popular && (
                <div className={styles.popularBadge}>Most Popular</div>
              )}
              <LeasingPlanCard
                option={{
                  months: term.months,
                  label: term.label,
                  rate: term.rate,
                  features: term.features
                }}
                payment={monthlyPayment}
                isSelected={selectedOption === term.months}
                onSelect={onSelectOption}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeasingOptions;