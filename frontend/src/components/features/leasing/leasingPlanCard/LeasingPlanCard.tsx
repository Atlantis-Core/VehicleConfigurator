import React from 'react';
import { FaCheck } from 'react-icons/fa';
import styles from './LeasingPlanCard.module.css';

interface LeasingPlanCardProps {
  option: {
    months: number;
    label: string;
    rate: string;
    features: string[];
  };
  payment: number;
  isSelected: boolean;
  onSelect: (months: number) => void;
}

const LeasingPlanCard: React.FC<LeasingPlanCardProps> = ({
  option,
  payment,
  isSelected,
  onSelect
}) => {
  return (
    <div
      className={`${styles.leasingPlan} ${isSelected ? styles.activePlan : ''}`}
      onClick={() => onSelect(option.months)}
    >
      <div className={styles.planHeader}>
        <h3>{option.label}</h3>
        {isSelected && <FaCheck className={styles.checkIcon} />}
      </div>

      <div className={styles.planPrice}>
        <span className={styles.amount}>
          {payment.toLocaleString()} €
        </span>
        <span className={styles.period}>/month</span>
      </div>

      <div className={styles.planRate}>
        Interest rate: {option.rate}
      </div>

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
};

export default LeasingPlanCard;