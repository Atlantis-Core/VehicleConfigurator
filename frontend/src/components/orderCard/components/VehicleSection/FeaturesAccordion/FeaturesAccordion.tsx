import React from 'react';
import styles from './FeaturesAccordion.module.css';
import { ConfigurationSummary } from '../../../../../types/types';
import { 
  FaCogs, 
  FaChevronDown, 
  FaShieldAlt, 
  FaCouch 
} from 'react-icons/fa';

interface FeaturesAccordionProps {
  configuration: ConfigurationSummary;
}

const FeaturesAccordion: React.FC<FeaturesAccordionProps> = ({ configuration }) => {
  return (
    <div className={styles.featuresAccordion}>
      <details>
        <summary className={styles.featuresToggle}>
          <FaCogs className={styles.featureIcon} />
          <span>Selected Features</span>
          <FaChevronDown className={styles.toggleIcon} />
        </summary>
        <div className={styles.featureColumns}>
          {configuration.selectedAssistance?.length > 0 && (
            <div className={styles.featureColumn}>
              <h6><FaShieldAlt /> Assistance Features</h6>
              <ul className={styles.featureList}>
                {configuration.selectedAssistance.map(feature => (
                  <li key={feature.id}>
                    <span className={styles.featureBullet} />
                    {feature.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {configuration.selectedComfort?.length > 0 && (
            <div className={styles.featureColumn}>
              <h6><FaCouch /> Comfort Features</h6>
              <ul className={styles.featureList}>
                {configuration.selectedComfort.map(feature => (
                  <li key={feature.id}>
                    <span className={styles.featureBullet} />
                    {feature.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </details>
    </div>
  );
};

export default FeaturesAccordion;