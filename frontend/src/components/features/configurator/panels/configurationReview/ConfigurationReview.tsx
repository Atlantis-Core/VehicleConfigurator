import styles from './ConfigurationReview.module.css';
import { MdEdit, MdArrowForward } from 'react-icons/md';
import { useAppSelector } from '@state/hooks';
import { selectSelectedOptions, selectTotalPrice } from '@state/configuration/selectors';

interface ConfigurationReviewProps {
  completeConfiguration: () => void;
  goToSection: (category: string, subcategory: string) => void;
}

const ConfigurationReview = ({
  completeConfiguration,
  goToSection
}: ConfigurationReviewProps) => {
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
    <div className={styles.reviewContainer}>
      <div className={styles.overviewHeader}>
        <h3>Configuration Overview</h3>
        <div className={styles.totalPrice}>
          Total: <span>€{totalPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className={styles.configSections}>
        {/* Engine Section */}
        <div className={styles.configSection}>
          <h4>
            Motorization
            <button
              className={styles.editButton}
              onClick={() => goToSection('motorization', 'engine')}
            >
              <MdEdit /> Edit
            </button>
          </h4>
          <div className={styles.configItems}>
            <div className={styles.configItem}>
              <span className={styles.configLabel}>Engine:</span>
              <span className={`${styles.configValue} ${!selectedEngine ? styles.notSelected : ''}`}>
                {selectedEngine ? (
                  <>
                    {selectedEngine.name}
                    {selectedEngine.additionalPrice > 0 && (
                      <span className={styles.additionalPrice}>
                        +€{selectedEngine.additionalPrice.toLocaleString()}
                      </span>
                    )}
                  </>
                ) : (
                  'Not selected'
                )}
              </span>
            </div>
            <div className={styles.configItem}>
              <span className={styles.configLabel}>Transmission:</span>
              <span className={`${styles.configValue} ${!selectedTransmission ? styles.notSelected : ''}`}>
                {selectedTransmission ? (
                  <>
                    {selectedTransmission.name}
                    <span className={styles.additionalPrice}>
                      +€0
                    </span>
                  </>
                ) : (
                  'Not selected'
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Exterior Section */}
        <div className={styles.configSection}>
          <h4>
            Exterior
            <button
              className={styles.editButton}
              onClick={() => goToSection('exterior', 'exterior-color')}
            >
              <MdEdit /> Edit
            </button>
          </h4>
          <div className={styles.configItems}>
            <div className={styles.configItem}>
              <span className={styles.configLabel}>Color:</span>
              <span className={`${styles.configValue} ${!selectedColor ? styles.notSelected : ''}`}>
                {selectedColor ? (
                  <div className={styles.colorDisplay}>
                    <div
                      className={styles.colorSwatch}
                      style={{ backgroundColor: selectedColor.hexCode }}
                    />
                    {selectedColor.name}
                    {selectedColor.additionalPrice > 0 && (
                      <span className={styles.additionalPrice}>
                        +€{selectedColor.additionalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                ) : (
                  'Not selected'
                )}
              </span>
            </div>
            <div className={styles.configItem}>
              <span className={styles.configLabel}>Rims:</span>
              <span className={`${styles.configValue} ${!selectedRim ? styles.notSelected : ''}`}>
                {selectedRim ? (
                  <>
                    {selectedRim.name} ({selectedRim.size}")
                    {selectedRim.additionalPrice > 0 && (
                      <span className={styles.additionalPrice}>
                        +€{selectedRim.additionalPrice.toLocaleString()}
                      </span>
                    )}
                  </>
                ) : (
                  'Not selected'
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Interior Section */}
        <div className={styles.configSection}>
          <h4>
            Interior
            <button
              className={styles.editButton}
              onClick={() => goToSection('interior', 'upholstery')}
            >
              <MdEdit /> Edit
            </button>
          </h4>
          <div className={styles.configItems}>
            <div className={styles.configItem}>
              <span className={styles.configLabel}>Upholstery:</span>
              <span className={`${styles.configValue} ${!selectedUpholstery ? styles.notSelected : ''}`}>
                {selectedUpholstery ? (
                  <>
                    {selectedUpholstery.name} ({selectedUpholstery.material})
                    {selectedUpholstery.additionalPrice > 0 && (
                      <span className={styles.additionalPrice}>
                        +€{selectedUpholstery.additionalPrice.toLocaleString()}
                      </span>
                    )}
                  </>
                ) : (
                  'Not selected'
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className={styles.configSection}>
          <h4>
            Features
            <button
              className={styles.editButton}
              onClick={() => goToSection('features', 'assistance')}
            >
              <MdEdit /> Edit
            </button>
          </h4>
          <div className={styles.configItems}>
            <div className={styles.configItem}>
              <span className={styles.configLabel}>Assistance:</span>
              <span className={styles.configValue}>
                {selectedAssistance.length > 0 ? (
                  <ul className={styles.featuresList}>
                    {selectedAssistance.map(feature => (
                      <li key={feature.id} className={styles.featureItem}>
                        {feature.name}
                        {feature.additionalPrice > 0 && (
                          <span className={styles.additionalPrice}>
                            +€{feature.additionalPrice.toLocaleString()}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className={styles.notSelected}>None selected</span>
                )}
              </span>
            </div>
            <div className={styles.configItem}>
              <span className={styles.configLabel}>Comfort:</span>
              <span className={styles.configValue}>
                {selectedComfort.length > 0 ? (
                  <ul className={styles.featuresList}>
                    {selectedComfort.map(feature => (
                      <li key={feature.id} className={styles.featureItem}>
                        {feature.name}
                        {feature.additionalPrice > 0 && (
                          <span className={styles.additionalPrice}>
                            +€{feature.additionalPrice.toLocaleString()}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className={styles.notSelected}>None selected</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.completionActions}>
        <button
          className={styles.proceedButton}
          onClick={completeConfiguration}
        >
          Proceed to Checkout
          <MdArrowForward className={styles.buttonIcon} />
        </button>
      </div>
    </div>
  );
};

export default ConfigurationReview;