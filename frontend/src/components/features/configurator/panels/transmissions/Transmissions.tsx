import { Transmission } from '../../../../../types/types';
import { useAppDispatch, useAppSelector } from '@state/hooks';
import { setSelectedTransmission } from '@state/configuration/configurationSlice';
import { selectConfiguration, selectSelectedOptions } from '@state/configuration/selectors';
import styles from './Transmissions.module.css';

const TransmissionsSelection = () => {
  const dispatch = useAppDispatch();
  const { transmissions } = useAppSelector(selectConfiguration);
  const { selectedTransmission } = useAppSelector(selectSelectedOptions);

  const handleTransmissionSelect = (transmission: Transmission) => {
    dispatch(setSelectedTransmission(transmission));
  };

  return (
    <div className={styles.categoryContent}>
      <h3>Select Transmission</h3>
      <div className={styles.transmissionOptions}>
        {transmissions.map((transmission, index) => (
          <div
            key={transmission.id}
            className={`${styles.transmissionItem} ${selectedTransmission?.id === transmission.id ? styles.selected : ''
              }`}
            onClick={() => handleTransmissionSelect(transmission)}
          >
            <div className={styles.transmissionName}>{transmission.name}</div>
            <div className={styles.transmissionIncluded}>Included</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransmissionsSelection;