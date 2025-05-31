import styles from "./ConfigurationSummaryCard.module.css";
import { ConfigurationSummary } from "../../../../types/types";
import { formatEuro } from "@utils/formatEuro";

interface ConfigurationSummaryCardProps {
  configuration: ConfigurationSummary;
}

const ConfigurationSummaryCard: React.FC<ConfigurationSummaryCardProps> = ({ configuration }) => {

  return (
    <div className={styles.summaryCard}>
      <h2>Your Configuration</h2>
      <div className={styles.modelInfo}>
        <h3>{configuration.model.name}</h3>
        <p className={styles.modelType}>{configuration.model.type}</p>
      </div>

      <div className={styles.configItems}>
        {configuration.selectedEngine && (
          <div className={styles.configItem}>
            <span className={styles.itemLabel}>Engine</span>
            <span className={styles.itemValue}>{configuration.selectedEngine.name}</span>
          </div>
        )}

        {configuration.selectedTransmission && (
          <div className={styles.configItem}>
            <span className={styles.itemLabel}>Transmission</span>
            <span className={styles.itemValue}>{configuration.selectedTransmission.name}</span>
          </div>
        )}

        {configuration.selectedColor && (
          <div className={styles.configItem}>
            <span className={styles.itemLabel}>Exterior Color</span>
            <div className={styles.colorValue}>
              <span
                className={styles.colorSwatch}
                style={{ backgroundColor: configuration.selectedColor.hexCode }}
              ></span>
              <span>{configuration.selectedColor.name}</span>
            </div>
            <span className={styles.itemPrice}>+ {formatEuro(configuration.selectedColor.additionalPrice)}</span>
          </div>
        )}

        {configuration.selectedRim && (
          <div className={styles.configItem}>
            <span className={styles.itemLabel}>Rims</span>
            <span className={styles.itemValue}>{configuration.selectedRim.name}</span>
            <span className={styles.itemPrice}>+ {formatEuro(configuration.selectedRim.additionalPrice)}</span>
          </div>
        )}

        {configuration.selectedUpholstery && (
          <div className={styles.configItem}>
            <span className={styles.itemLabel}>Upholstery</span>
            <span className={styles.itemValue}>{configuration.selectedUpholstery.name}</span>
            <span className={styles.itemPrice}>+ {formatEuro(configuration.selectedUpholstery.additionalPrice)}</span>
          </div>
        )}

        {configuration.selectedAssistance && configuration.selectedAssistance.length > 0 && (
          <div className={styles.configItem}>
            <span className={styles.itemLabel}>Assistance Systems</span>
            <span className={styles.itemValue}>
              <ul className={styles.featureList}>
                {configuration.selectedAssistance.map((item, index) => (
                  <li key={index}>{item.name}</li>
                ))}
              </ul>
            </span>
            <span className={styles.itemPrice}>
              + {formatEuro(configuration.selectedAssistance.reduce((sum, item) => sum + item.additionalPrice, 0))}
            </span>
          </div>
        )}

        {configuration.selectedComfort && configuration.selectedComfort.length > 0 && (
          <div className={styles.configItem}>
            <span className={styles.itemLabel}>Comfort Features</span>
            <span className={styles.itemValue}>
              <ul className={styles.featureList}>
                {configuration.selectedComfort.map((item, index) => (
                  <li key={index}>{item.name}</li>
                ))}
              </ul>
            </span>
            <span className={styles.itemPrice}>
              + {formatEuro(configuration.selectedComfort.reduce((sum, item) => sum + item.additionalPrice, 0))}
            </span>
          </div>
        )}
      </div>

      <div className={styles.totalPrice}>
        <span className={styles.totalLabel}>Total Price</span>
        <span className={styles.totalValue}>{formatEuro(configuration.totalPrice)}</span>
      </div>
    </div>
  );
}

export default ConfigurationSummaryCard;