import styles from './Comfort.module.css';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { toggleComfort } from '@store/configurationSlice';
import { selectConfiguration, selectSelectedOptions } from '@store/selectors';
import { Feature } from '../../../../../types/types';
import { getImageUrl } from '@lib/getImageUrl';

const ComfortSelection = () => {
  const dispatch = useAppDispatch();
  const { comforts } = useAppSelector(selectConfiguration);
  const { selectedComfort } = useAppSelector(selectSelectedOptions);

  const handleComfortToggle = (comfort: Feature | null) => {
    dispatch(toggleComfort(comfort));
  };

  const isSelected = (comfortId: number) => {
    return selectedComfort.some(item => item.id === comfortId);
  };

  return (
    <div className={styles.categoryContent}>
      <h3>Comfort Features</h3>
      <div className={styles.comfortOptions}>
        <div
          className={`${styles.comfortOption} ${selectedComfort.length === 0 ? styles.selected : ''
            }`}
          onClick={() => handleComfortToggle(null)}
        >
          <div className={styles.comfortDetails}>
            <span className={styles.comfortName}>No additional comfort</span>
          </div>
        </div>
        {comforts.map((comfort: Feature) => (
          <div
            key={comfort.id}
            className={`${styles.comfortOption} ${isSelected(comfort.id) ? styles.selected : ''
              }`}
            onClick={() => handleComfortToggle(comfort)}
          >
            <img
              src={getImageUrl(comfort.imagePath)}
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

export default ComfortSelection;