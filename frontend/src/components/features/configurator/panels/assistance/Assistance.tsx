import React from 'react';
import styles from './Assistance.module.css';
import { Feature } from '../../../types/types';
import { getImageUrl } from '@lib/getImageUrl';

interface AssistanceProps {
  assistances: Feature[];
  selectedAssistance: Feature[];
  handleSelectAssistance: (assistance: Feature | null) => void;
}

const Assistance: React.FC<AssistanceProps> = ({ assistances, selectedAssistance, handleSelectAssistance }) => {
  return (
    <div className={styles.categoryContent}>
      <h3>Assistance Features</h3>
      <div className={styles.assistanceOptions}>
        <div
          className={`${styles.assistanceOption} ${selectedAssistance.length === 0 ? styles.selected : ''
            }`}
          onClick={() => handleSelectAssistance(null)} // Deselect any selected assistance
        >
          <div className={styles.assistanceDetails}>
            <span className={styles.assistanceName}>No additional assistance</span>
          </div>
        </div>
        {assistances.map((assistance) => (
          <div
            key={assistance.id}
            className={`${styles.assistanceOption} ${selectedAssistance?.some(item => item.id === assistance.id) ? styles.selected : ''
              }`}
            onClick={() => handleSelectAssistance(assistance)}
          >
            <img
              src={getImageUrl(assistance.imagePath)}
              alt={assistance.name}
              className={styles.assistanceImage}
            />
            <div className={styles.assistanceDetails}>
              <span className={styles.assistanceName}>{assistance.name}</span>
              {assistance.additionalPrice > 0 ? (
                <span className={styles.assistancePrice}>
                  +{assistance.additionalPrice.toLocaleString()} €
                </span>
              ) : (
                <span className={styles.assistanceIncluded}>Included</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assistance;