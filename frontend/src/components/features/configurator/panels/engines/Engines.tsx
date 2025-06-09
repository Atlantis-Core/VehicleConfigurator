import { Engine } from '../../../../../types/types';
import { useAppDispatch, useAppSelector } from '@state/hooks';
import { setSelectedEngine } from '@state/configuration/configurationSlice';
import { selectConfiguration, selectSelectedOptions } from '@state/configuration/selectors';
import styles from './Engines.module.css';

const EngineSelection = () => {
  const dispatch = useAppDispatch();
  const { engines } = useAppSelector(selectConfiguration);
  const { selectedEngine } = useAppSelector(selectSelectedOptions);

  const handleEngineSelect = (engine: Engine) => {
    dispatch(setSelectedEngine(engine));
  };

  return (
    <div className={styles.categoryContent}>
      <h3>Engine</h3>
      <ul className={styles.engineList}>
        {engines.map((engine) => (
          <li
            key={engine.id}
            className={`${styles.engineItem} ${
              selectedEngine?.id === engine.id ? styles.selected : ''
            }`}
            onClick={() => handleEngineSelect(engine)}
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

export default EngineSelection;