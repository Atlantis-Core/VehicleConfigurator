import React from 'react';
import styles from './ConfigurationReview.module.css';
import { FaCheck, FaEdit } from 'react-icons/fa';
import { useConfiguration } from '@context/ConfigurationContext';

interface ConfigurationReviewProps {
  onComplete: () => void;
  onEditSection: (category: string, subcategory: string) => void;
}

const ConfigurationReview: React.FC<ConfigurationReviewProps> = ({
  onComplete,
  onEditSection
}) => {
  // Access all configuration data directly from context
  const {
    model,
    totalPrice,
    selectedColor,
    selectedRim,
    selectedEngine,
    selectedTransmission,
    selectedUpholstery,
    selectedAssistance,
    selectedComfort
  } = useConfiguration();

  // Make sure model exists before rendering
  if (!model) {
    return <div className={styles.loading}>Loading configuration...</div>;
  }

  return (
    <div className={styles.reviewContainer}>
      <h2 className={styles.reviewTitle}>Review Your Configuration</h2>
      <p className={styles.reviewSubtitle}>Please review your selections before proceeding to checkout.</p>
      
      <div className={styles.configurationOverview}>
        <div className={styles.overviewHeader}>
          <h3>{model.name} {model.type}</h3>
          <div className={styles.totalPrice}>
            Total: <span>{totalPrice.toLocaleString()} €</span>
          </div>
        </div>

        <div className={styles.configSections}>
          <div className={styles.configSection}>
            <h4>
              <span>Motorization</span>
              <button 
                className={styles.editButton} 
                onClick={() => onEditSection('motorization', 'engine')}
              >
                <FaEdit />
                <span>Edit</span>
              </button>
            </h4>
            <div className={styles.configItems}>
              <div className={styles.configItem}>
                <span className={styles.configLabel}>Engine:</span>
                <span className={styles.configValue}>
                  {selectedEngine ? (
                    <>
                      {selectedEngine.name} ({selectedEngine.description})
                      {selectedEngine.additionalPrice > 0 && 
                        <span className={styles.additionalPrice}>+{selectedEngine.additionalPrice.toLocaleString()} €</span>
                      }
                    </>
                  ) : (
                    <span className={styles.notSelected}>Not selected</span>
                  )}
                </span>
              </div>
              
              <div className={styles.configItem}>
                <span className={styles.configLabel}>Transmission:</span>
                <span className={styles.configValue}>
                  {selectedTransmission ? (
                    <>
                      {selectedTransmission.name}
                    </>
                  ) : (
                    <span className={styles.notSelected}>Not selected</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.configSection}>
            <h4>
              <span>Exterior</span>
              <button 
                className={styles.editButton} 
                onClick={() => onEditSection('exterior', 'exterior-color')}
              >
                <FaEdit />
                <span>Edit</span>
              </button>
            </h4>
            <div className={styles.configItems}>
              <div className={styles.configItem}>
                <span className={styles.configLabel}>Color:</span>
                <span className={styles.configValue}>
                  {selectedColor ? (
                    <div className={styles.colorDisplay}>
                      <span 
                        className={styles.colorSwatch} 
                        style={{ backgroundColor: selectedColor.hexCode }}
                      ></span>
                      <span>{selectedColor.name}</span>
                      {selectedColor.additionalPrice > 0 && 
                        <span className={styles.additionalPrice}>+{selectedColor.additionalPrice.toLocaleString()} €</span>
                      }
                    </div>
                  ) : (
                    <span className={styles.notSelected}>Not selected</span>
                  )}
                </span>
              </div>
              
              <div className={styles.configItem}>
                <span className={styles.configLabel}>Rims:</span>
                <span className={styles.configValue}>
                  {selectedRim ? (
                    <>
                      {selectedRim.name}
                      {selectedRim.additionalPrice > 0 && 
                        <span className={styles.additionalPrice}>+{selectedRim.additionalPrice.toLocaleString()} €</span>
                      }
                    </>
                  ) : (
                    <span className={styles.notSelected}>Not selected</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.configSection}>
            <h4>
              <span>Interior</span>
              <button 
                className={styles.editButton} 
                onClick={() => onEditSection('interior', 'upholstery')}
              >
                <FaEdit />
                <span>Edit</span>
              </button>
            </h4>
            <div className={styles.configItems}>
              <div className={styles.configItem}>
                <span className={styles.configLabel}>Upholstery:</span>
                <span className={styles.configValue}>
                  {selectedUpholstery ? (
                    <>
                      {selectedUpholstery.name}
                      {selectedUpholstery.additionalPrice > 0 && 
                        <span className={styles.additionalPrice}>+{selectedUpholstery.additionalPrice.toLocaleString()} €</span>
                      }
                    </>
                  ) : (
                    <span className={styles.notSelected}>Not selected</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.configSection}>
            <h4>
              <span>Features & Packages</span>
              <button 
                className={styles.editButton} 
                onClick={() => onEditSection('features', 'assistance')}
              >
                <FaEdit />
                <span>Edit</span>
              </button>
            </h4>
            <div className={styles.configItems}>
              <div className={styles.configItem}>
                <span className={styles.configLabel}>Assistance Systems:</span>
                <span className={styles.configValue}>
                  {selectedAssistance && selectedAssistance.length > 0 ? (
                    <ul className={styles.featuresList}>
                      {selectedAssistance.map((feature, index) => (
                        <li key={index} className={styles.featureItem}>
                          {feature.name}
                          {feature.additionalPrice > 0 && 
                            <span className={styles.additionalPrice}>+{feature.additionalPrice.toLocaleString()} €</span>
                          }
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className={styles.notSelected}>None selected</span>
                  )}
                </span>
              </div>
              
              <div className={styles.configItem}>
                <span className={styles.configLabel}>Comfort Features:</span>
                <span className={styles.configValue}>
                  {selectedComfort && selectedComfort.length > 0 ? (
                    <ul className={styles.featuresList}>
                      {selectedComfort.map((feature, index) => (
                        <li key={index} className={styles.featureItem}>
                          {feature.name}
                          {feature.additionalPrice > 0 && 
                            <span className={styles.additionalPrice}>+{feature.additionalPrice.toLocaleString()} €</span>
                          }
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
      </div>
      
      <div className={styles.completionActions}>
        <button 
          className={styles.proceedButton} 
          onClick={onComplete}
        >
          <FaCheck className={styles.buttonIcon} />
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default ConfigurationReview;