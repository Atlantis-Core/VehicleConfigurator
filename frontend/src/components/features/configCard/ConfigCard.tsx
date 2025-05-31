import { getImageUrl } from "@lib/getImageUrl";
import styles from "./ConfigCard.module.css";
import { SavedConfiguration } from "@hooks/useLocalConfiguration";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface ConfigCardProps {
  config: SavedConfiguration;
  deleteAction: (config: SavedConfiguration) => void;
  continueAction: (config: SavedConfiguration) => void;
}

const ConfigCard: React.FC<ConfigCardProps> = ({ config, deleteAction, continueAction }) => {

  const navigate = useNavigate();

  const features = [
    ...(config.selectedAssistance?.map(f => f.name) || []),
    ...(config.selectedComfort?.map(f => f.name) || [])
  ];

  const formatSavedDate = (dateStr: string) => {
    try {
      return `Saved ${formatDistanceToNow(new Date(dateStr), { addSuffix: true })}`;
    } catch (e) {
      return 'Saved Draft';
    }
  };

  return (
    <div key={config.id} className={styles.configCard}>
      <div className={styles.configImageContainer}>
        {config.model.imagePath ? (
          <img src={getImageUrl(config.model.imagePath)} alt={config.model.name} className={styles.configImage} />
        ) : (
          <div className={styles.configImagePlaceholder}>
            <span>{config.model.name.charAt(0)}</span>
          </div>
        )}
      </div>

      <div className={styles.configDetails}>
        <h3>{config.model.name}</h3>
        <div className={styles.configDate}>
          {formatSavedDate(config.savedAt)}
        </div>

        <div className={styles.configSpecs}>
          <div className={styles.specRow}>
            <span className={styles.specLabel}>Color:</span>
            <span className={styles.specValue}>
              {config.selectedColor ? (
                <div className={styles.colorDisplay}>
                  <div
                    className={styles.colorSwatch}
                    style={{ backgroundColor: config.selectedColor.hexCode || '#333' }}
                  ></div>
                  {config.selectedColor.name}
                </div>
              ) : 'Not selected'}
            </span>
          </div>

          <div className={styles.specRow}>
            <span className={styles.specLabel}>Rim:</span>
            <span className={styles.specValue}>
              {config.selectedRim ? `${config.selectedRim.name} (${config.selectedRim.size}")` : 'Not selected'}
            </span>
          </div>

          <div className={styles.specRow}>
            <span className={styles.specLabel}>Engine:</span>
            <span className={styles.specValue}>
              {config.selectedEngine ? config.selectedEngine.name : 'Not selected'}
            </span>
          </div>

          <div className={styles.specRow}>
            <span className={styles.specLabel}>Interior:</span>
            <span className={styles.specValue}>
              {config.selectedUpholstery ? config.selectedUpholstery.name : 'Not selected'}
            </span>
          </div>
        </div>

        <div className={styles.configPrice}>
          ${(config.totalPrice?.toLocaleString()) || '0'}
        </div>

        {features.length > 0 && (
          <div className={styles.featuresSection}>
            <div className={styles.featuresSectionTitle}>Features:</div>
            <div className={styles.configFeatures}>
              {features.slice(0, 3).map((feature, index) => (
                <span key={index} className={styles.feature}>
                  {feature}
                </span>
              ))}
              {features.length > 3 && (
                <span className={styles.moreFeatures}>+{features.length - 3} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={styles.configActions}>
        <button
          onClick={() => continueAction(config)}
          className={styles.continueButton}
        >
          Continue
        </button>
        <button
          onClick={() => deleteAction(config)}
          className={styles.deleteButton}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ConfigCard;