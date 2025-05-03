import React from 'react';
import styles from './Assistance.module.css';
import { Feature } from '../../../types/types';

interface AssistanceProps {
  assistances: Feature[];
  selectedAssistance?: Feature | null;
  handleSelectAssistance: (assistance: Feature | null) => void;
}

const Assistance: React.FC<AssistanceProps> = ({ assistances, selectedAssistance, handleSelectAssistance }) => {
  return (
    <div className={styles.categoryContent}>
      <h3>Assistance Features</h3>
      <div className={styles.assistanceOptions}>
        <div
          className={`${styles.assistanceOption} ${
            !selectedAssistance ? styles.selected : ''
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
            className={`${styles.assistanceOption} ${
              selectedAssistance?.id === assistance.id ? styles.selected : ''
            }`}
            onClick={() => handleSelectAssistance(assistance)}
          >
            <img
              src={assistance.imagePath}
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