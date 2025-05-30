import React from 'react';
import styles from './Upholstery.module.css';
import { Interior } from '../../../types/types';
import { getImageUrl } from '@lib/getImageUrl';

interface UpholsteryProps {
  upholsteries: Interior[];
  selectedUpholstery?: Interior;
  handleSelectUpholstery: (upholstery: Interior) => void;
}

const Upholstery: React.FC<UpholsteryProps> = ({ upholsteries, selectedUpholstery, handleSelectUpholstery }) => {
  return (
    <div className={styles.categoryContent}>
      <h3>Upholstery</h3>
      <div className={styles.upholsteryOptions}>
        {upholsteries.map((upholstery) => (
          <div
            key={upholstery.id}
            className={`${styles.upholsteryOption} ${
              selectedUpholstery?.id === upholstery.id ? styles.selected : ''
            }`}
            onClick={() => handleSelectUpholstery(upholstery)}
          >
            <img
              src={getImageUrl(upholstery.imagePath)}
              alt={upholstery.name}
              className={styles.upholsteryImage}
            />
            <div className={styles.upholsteryDetails}>
              <span className={styles.upholsteryName}>{upholstery.name}</span>
              <span className={styles.upholsteryMaterial}>{upholstery.material}</span>
              {upholstery.additionalPrice > 0 ? (
                <span className={styles.upholsteryPrice}>
                  +{upholstery.additionalPrice.toLocaleString()} €
                </span>
              ) : (
                <span className={styles.upholsteryIncluded}>Included</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Upholstery;