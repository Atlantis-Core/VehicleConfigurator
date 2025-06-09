import styles from './Assistance.module.css';
import { useAppDispatch, useAppSelector } from '@state/hooks';
import { toggleAssistance } from '@state/configuration/configurationSlice';
import { selectConfiguration, selectSelectedOptions } from '@state/configuration/selectors';
import { Feature } from '../../../../../types/types';
import { getImageUrl } from '@lib/getImageUrl';

const AssistanceSelection = () => {
  const dispatch = useAppDispatch();
  const { assistances } = useAppSelector(selectConfiguration);
  const { selectedAssistance } = useAppSelector(selectSelectedOptions);

  const handleAssistanceToggle = (assistance: Feature | null) => {
    dispatch(toggleAssistance(assistance));
  };

  const isSelected = (assistanceId: number) => {
    return selectedAssistance.some(item => item.id === assistanceId);
  };

  return (
    <div className={styles.categoryContent}>
      <h3>Driver Assistance Features</h3>
      <div className={styles.assistanceOptions}>
        <div
          className={`${styles.assistanceOption} ${selectedAssistance.length === 0 ? styles.selected : ''}`}
          onClick={() => handleAssistanceToggle(null)}
        >
          <div className={styles.assistanceDetails}>
            <span className={styles.assistanceName}>No additional assistance</span>
          </div>
        </div>

        {assistances.map((assistance) => (
          <div
            key={assistance.id}
            className={`${styles.assistanceOption} ${isSelected(assistance.id) ? styles.selected : ''}`}
            onClick={() => handleAssistanceToggle(assistance)}
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
                  +€{assistance.additionalPrice.toLocaleString()}
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

export default AssistanceSelection;