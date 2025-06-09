import React from 'react';
import { Rim } from '../../../../../types/types';
import styles from './Rims.module.css'
import { getImageUrl } from '@lib/getImageUrl';
import { useAppDispatch, useAppSelector } from '@state/hooks';
import { setSelectedRim } from '@state/configuration/configurationSlice';
import { selectConfiguration, selectSelectedOptions } from '@state/configuration/selectors';

const RimsSelection = () => {
  const dispatch = useAppDispatch();
  const { rims: availableRims } = useAppSelector(selectConfiguration);
  const { selectedRim: selectedOption } = useAppSelector(selectSelectedOptions);

  const onRimSelect = (rim: Rim) => {
    dispatch(setSelectedRim(rim));
  };

  return (
    <div className={styles.categoryContent}>
      <h3>Wheels & Rims</h3>
      <div className={styles.rimOptions}>
        {availableRims.map((rim) => (
          <div
            key={rim.id}
            className={`${styles.rimOption} ${selectedOption?.id === rim.id ? styles.selected : ''}`}
            onClick={() => onRimSelect(rim)}
          >
            <div className={styles.rimImage}>
              <img src={getImageUrl(rim.imagePath)} alt={rim.name} />
            </div>
            <div className={styles.rimDetails}>
              <div className={styles.rimName}>{rim.name}</div>
              <div className={styles.rimSize}>{rim.size}'</div>
              {rim.additionalPrice && rim.additionalPrice > 0 ? (
                <div className={styles.rimPrice}>
                  +€{rim.additionalPrice.toLocaleString()}
                </div>
              ) : (
                <div className={styles.rimIncluded}>Included</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RimsSelection;