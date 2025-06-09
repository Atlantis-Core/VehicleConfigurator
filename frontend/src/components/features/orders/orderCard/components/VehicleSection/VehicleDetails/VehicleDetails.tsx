import { ConfigurationSummary } from '../../../../../../../types/types';
import FeaturesAccordion from '../FeaturesAccordion/FeaturesAccordion';
import styles from './VehicleDetails.module.css';
import {
  FaTachometerAlt,
  FaPaintBrush
} from 'react-icons/fa';

interface VehicleDetailsProps {
  configuration: ConfigurationSummary;
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({ configuration }) => {
  return (
    <div className={styles.vehicleDetails}>
      <h4 className={styles.vehicleTitle}>{configuration.model?.name || 'Unknown Model'}</h4>
      <p className={styles.modelType}>{configuration.model?.type || ''}</p>

      <div className={styles.specsTabs}>
        <div className={styles.specsTab}>
          <div className={styles.specHeader}>
            <div className={styles.specIconWrapper}>
              <FaTachometerAlt className={styles.specIcon} />
            </div>
            <h5>Performance</h5>
          </div>
          <div className={styles.tabContent}>
            {configuration.selectedEngine && (
              <div className={styles.specItem}>
                <span className={styles.specName}>Engine</span>
                <span className={styles.specValue}>{configuration.selectedEngine.name}</span>
              </div>
            )}
            {configuration.selectedTransmission && (
              <div className={styles.specItem}>
                <span className={styles.specName}>Transmission</span>
                <span className={styles.specValue}>{configuration.selectedTransmission.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.specsTab}>
          <div className={styles.specHeader}>
            <div className={styles.specIconWrapper}>
              <FaPaintBrush className={styles.specIcon} />
            </div>
            <h5>Appearance</h5>
          </div>
          <div className={styles.tabContent}>
            {configuration.selectedColor && (
              <div className={styles.specItem}>
                <span className={styles.specName}>Color</span>
                <div className={styles.specValueWithSwatch}>
                  <span
                    className={styles.colorSwatch}
                    style={{ backgroundColor: configuration.selectedColor.hexCode || '#ccc' }}
                  ></span>
                  <span>{configuration.selectedColor.name}</span>
                </div>
              </div>
            )}
            {configuration.selectedRim && (
              <div className={styles.specItem}>
                <span className={styles.specName}>Wheels</span>
                <span className={styles.specValue}>{configuration.selectedRim.name} ({configuration.selectedRim.size}')</span>
              </div>
            )}
            {configuration.selectedUpholstery && (
              <div className={styles.specItem}>
                <span className={styles.specName}>Interior</span>
                <span className={styles.specValue}>{configuration.selectedUpholstery.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {(configuration.selectedAssistance?.length > 0 ||
        configuration.selectedComfort?.length > 0) && (
          <FeaturesAccordion
            configuration={configuration}
          />
        )}
    </div>
  );
};

export default VehicleDetails;