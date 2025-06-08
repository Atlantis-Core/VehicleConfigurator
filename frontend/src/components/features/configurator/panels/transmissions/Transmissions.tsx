import { Transmission } from "../../../../../types/types";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { setSelectedTransmission } from "@store/configurationSlice";
import { selectConfiguration, selectSelectedOptions } from "@store/selectors";
import styles from "./Transmissions.module.css";

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
            className={`${styles.transmissionItem} ${
              selectedTransmission?.id === transmission.id ? styles.selected : ""
            }`}
            onClick={() => handleTransmissionSelect(transmission)}
            style={{ "--animation-order": index } as React.CSSProperties}
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