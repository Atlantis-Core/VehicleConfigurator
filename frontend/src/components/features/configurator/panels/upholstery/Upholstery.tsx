import styles from './Upholstery.module.css';
import { useAppDispatch, useAppSelector } from '@state/hooks';
import { setSelectedUpholstery } from '@state/configuration/configurationSlice';
import { selectConfiguration, selectSelectedOptions } from '@state/configuration/selectors';
import { Interior } from '../../../../../types/types';
import { getImageUrl } from '@lib/getImageUrl';

const UpholsterySelection = () => {
  const dispatch = useAppDispatch();
  const { upholsteries } = useAppSelector(selectConfiguration);
  const { selectedUpholstery } = useAppSelector(selectSelectedOptions);

  const handleUpholsterySelect = (upholstery: Interior) => {
    dispatch(setSelectedUpholstery(upholstery));
  };

  return (
    <div className={styles.categoryContent}>
      <h3>Select Interior</h3>
      <div className={styles.upholsteryOptions}>
        {upholsteries.map((upholstery, index) => (
          <div
            key={upholstery.id}
            className={`${styles.upholsteryOption} ${selectedUpholstery?.id === upholstery.id ? styles.selected : ''
              }`}
            onClick={() => handleUpholsterySelect(upholstery)}
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

export default UpholsterySelection;