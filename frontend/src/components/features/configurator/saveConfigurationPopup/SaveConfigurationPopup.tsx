import { useConfiguration } from "@context/ConfigurationContext";
import { Model } from "../../../../types/types";
import styles from "./SaveConfigurationPopup.module.css";

interface SaveConfigurationPopupProps {
  model: Model;
  onContinue: () => void
  onSaveAndContinue: () => void
}

const SaveConfigurationPopup: React.FC<SaveConfigurationPopupProps> = ({ 
  model, 
  onContinue, 
  onSaveAndContinue,
}) => {

  const {
      selectedColor, selectedRim, selectedEngine, totalPrice,
    } = useConfiguration();

  return (
    <div className={styles.savePopupContent}>
      <p>Would you like to save your configuration before proceeding to summary?</p>

      {model && (
        <div className={styles.configSummary}>
          <h3 className={styles.configModelName}>{model.name}</h3>

          <div className={styles.configSpecs}>
            {selectedColor && (
              <div className={styles.configSpec}>
                <span className={styles.specLabel}>Color:</span>
                <div className={styles.specValue}>
                  <div
                    className={styles.colorSwatch}
                    style={{ backgroundColor: selectedColor.hexCode || '#333' }}
                  />
                  <span>{selectedColor.name}</span>
                </div>
              </div>
            )}

            {selectedEngine && (
              <div className={styles.configSpec}>
                <span className={styles.specLabel}>Engine:</span>
                <span className={styles.specValue}>{selectedEngine.name}</span>
              </div>
            )}

            {selectedRim && (
              <div className={styles.configSpec}>
                <span className={styles.specLabel}>Wheels:</span>
                <span className={styles.specValue}>{selectedRim.size}" {selectedRim.name}</span>
              </div>
            )}
          </div>

          <div className={styles.configTotalPrice}>
            <span>Total Price:</span>
            <span className={styles.priceValue}>${totalPrice.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className={styles.popupActions}>
        <button
          onClick={() => {
            onContinue();
          }}
          className={styles.secondaryButton}
        >
          Continue Without Saving
        </button>
        <button
          onClick={() => {
            onSaveAndContinue();
          }}
          className={styles.primaryButton}
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}

export default SaveConfigurationPopup;