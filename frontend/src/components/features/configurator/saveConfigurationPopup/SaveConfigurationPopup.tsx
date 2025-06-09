import { useAppSelector } from '@state/hooks';
import { selectSelectedOptions, selectTotalPrice } from '@state/configuration/selectors';
import { Model } from '../../../../types/types';
import styles from './SaveConfigurationPopup.module.css';

interface SaveConfigurationPopupProps {
  model: Model;
  onContinue: () => void;
  onSaveAndContinue: () => void;
}

const SaveConfigurationPopup = ({
  model,
  onContinue,
  onSaveAndContinue
}: SaveConfigurationPopupProps) => {
  const {
    selectedColor,
    selectedRim,
    selectedEngine,
    selectedTransmission,
    selectedUpholstery,
    selectedAssistance,
    selectedComfort
  } = useAppSelector(selectSelectedOptions);
  const totalPrice = useAppSelector(selectTotalPrice);

  return (
    <div className={styles.savePopupContent}>
      <p>
        Would you like to save this configuration before proceeding to checkout?
        You can load it later to continue where you left off.
      </p>

      <div className={styles.configSummary}>
        <h4 className={styles.configModelName}>{model.name}</h4>

        <div className={styles.configSpecs}>
          {selectedEngine && (
            <div className={styles.configSpec}>
              <span className={styles.specLabel}>Engine:</span>
              <span className={styles.specValue}>{selectedEngine.name}</span>
            </div>
          )}

          {selectedTransmission && (
            <div className={styles.configSpec}>
              <span className={styles.specLabel}>Transmission:</span>
              <span className={styles.specValue}>{selectedTransmission.name}</span>
            </div>
          )}

          {selectedColor && (
            <div className={styles.configSpec}>
              <span className={styles.specLabel}>Color:</span>
              <span className={styles.specValue}>
                <div
                  className={styles.colorSwatch}
                  style={{ backgroundColor: selectedColor.hexCode }}
                />
                {selectedColor.name}
              </span>
            </div>
          )}

          {selectedRim && (
            <div className={styles.configSpec}>
              <span className={styles.specLabel}>Rims:</span>
              <span className={styles.specValue}>{selectedRim.name}</span>
            </div>
          )}

          {selectedUpholstery && (
            <div className={styles.configSpec}>
              <span className={styles.specLabel}>Interior:</span>
              <span className={styles.specValue}>{selectedUpholstery.name}</span>
            </div>
          )}

          {selectedAssistance.length > 0 && (
            <div className={styles.configSpec}>
              <span className={styles.specLabel}>Assistance:</span>
              <span className={styles.specValue}>
                {selectedAssistance.length} feature{selectedAssistance.length > 1 ? 's' : ''}
              </span>
            </div>
          )}

          {selectedComfort.length > 0 && (
            <div className={styles.configSpec}>
              <span className={styles.specLabel}>Comfort:</span>
              <span className={styles.specValue}>
                {selectedComfort.length} feature{selectedComfort.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        <div className={styles.configTotalPrice}>
          <span>Total Price:</span>
          <span className={styles.priceValue}>€{totalPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className={styles.popupActions}>
        <button
          className={styles.secondaryButton}
          onClick={onContinue}
        >
          Continue Without Saving
        </button>
        <button
          className={styles.primaryButton}
          onClick={onSaveAndContinue}
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};

export default SaveConfigurationPopup;