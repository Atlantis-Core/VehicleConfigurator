import React from 'react';
import styles from './Comfort.module.css';
import { Feature } from '../../../types/types';

interface ComfortProps {
  comforts: Feature[];
  selectedComfort?: Feature | null;
  handleSelectComfort: (comfort: Feature | null) => void;
}

const Comfort: React.FC<ComfortProps> = ({ comforts, selectedComfort, handleSelectComfort }) => {
  return (
    <div className={styles.categoryContent}>
      <h3>Comfort Features</h3>
      <div className={styles.comfortOptions}>
        <div
          className={`${styles.comfortOption} ${
            !selectedComfort ? styles.selected : ''
          }`}
          onClick={() => handleSelectComfort(null)} // Deselect any selected comfort
        >
          <div className={styles.comfortDetails}>
            <span className={styles.comfortName}>No additional comfort</span>
          </div>
        </div>
        {comforts.map((comfort) => (
          <div
            key={comfort.id}
            className={`${styles.comfortOption} ${
              selectedComfort?.id === comfort.id ? styles.selected : ''
            }`}
            onClick={() => handleSelectComfort(comfort)}
          >
            <img
              src={comfort.imagePath}
              alt={comfort.name}
              className={styles.comfortImage}
            />
            <div className={styles.comfortDetails}>
              <span className={styles.comfortName}>{comfort.name}</span>
              {comfort.additionalPrice > 0 ? (
                <span className={styles.comfortPrice}>
                  +{comfort.additionalPrice.toLocaleString()} €
                </span>
              ) : (
                <span className={styles.comfortIncluded}>Included</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comfort;