import { Transmission } from "../../../types/types";
import styles from "./Transmissions.module.css";

interface TransmissionsProp {
  transmissions: Transmission[];
  selectedTransmission?: Transmission;
  handleSelectTransmission: (transmission: Transmission) => void;
}

const Transmissions: React.FC<TransmissionsProp> = ({ transmissions, selectedTransmission, handleSelectTransmission }) => {
  return (
    <div className={styles.categoryContent}>
      <h3>Transmission</h3>
      <ul className={styles.transmissionList}>
        {transmissions.map((transmission) => (
          <li
            key={transmission.id}
            className={`${styles.transmissionItem} ${
              selectedTransmission?.id === transmission.id ? styles.selected : ""
            }`}
            onClick={() => handleSelectTransmission(transmission)}
          >
            <div className={styles.transmissionName}>{transmission.name}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transmissions;