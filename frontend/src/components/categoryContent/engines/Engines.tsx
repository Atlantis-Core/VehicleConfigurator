import { Engine } from "../../../types/types";
import styles from "./Engines.module.css";

interface EnginesProp {
  engines: Engine[];
  selectedEngine?: Engine;
  handleSelectEngine: (engine: Engine) => void;
}

const Engines: React.FC<EnginesProp> = ({ engines, selectedEngine, handleSelectEngine }) => {
  return (
    <div className={styles.categoryContent}>
      <h3>Engine</h3>
      <ul className={styles.engineList}>
        {engines.map((engine) => (
          <li
            key={engine.id}
            className={`${styles.engineItem} ${
              selectedEngine?.id === engine.id ? styles.selected : ""
            }`}
            onClick={() => handleSelectEngine(engine)}
          >
            <div className={styles.engineName}>{engine.name}</div>
            <div className={styles.engineDescription}>{engine.description}</div>
            <div className={styles.engineDetails}>
              <span>+{engine.additionalPrice.toLocaleString()} €</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Engines;