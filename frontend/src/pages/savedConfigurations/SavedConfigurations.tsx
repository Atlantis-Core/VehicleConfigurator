import { useState, useEffect } from 'react';
import styles from './SavedConfigurations.module.css';
import {
  getAllSavedConfigurations,
  deleteConfigurationLocally,
  SavedConfigurations as SavedConfigurationsType,
  SavedConfiguration
} from '@hooks/useLocalConfiguration';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '@lib/getImageUrl';
import { IoArrowBack } from 'react-icons/io5';
import { formatDistanceToNow } from 'date-fns';

const SavedConfigurations = () => {
  const [localConfigs, setLocalConfigs] = useState<SavedConfigurationsType | null>(null);
  const navigate = useNavigate();

  // Load local configurations from localStorage
  useEffect(() => {
    const loadLocalConfigurations = () => {
      try {
        const savedConfigs = getAllSavedConfigurations();
        setLocalConfigs(savedConfigs);
      } catch (error) {
        console.error('Error loading configurations from localStorage:', error);
      }
    };

    loadLocalConfigurations();
  }, []);

  // Delete local configuration
  const deleteLocalConfig = (id: string) => {
    try {
      deleteConfigurationLocally(id);
      // Update the local state after deletion
      setLocalConfigs(getAllSavedConfigurations());
    } catch (error) {
      console.error('Error deleting configuration:', error);
    }
  };

  // Continue with configuration
  const continueWithConfig = (config: SavedConfiguration) => {
    // Navigate to the configurator with the selected config
    navigate(`/configurator/${config.model.id}`, {
      state: { configurationId: config.id }
    });
  };

  // Go back to configurator
  const goBackToConfigurator = () => {
    navigate('/configurator');
  };

  // Format the saved date
  const formatSavedDate = (dateStr: string) => {
    try {
      return `Saved ${formatDistanceToNow(new Date(dateStr), { addSuffix: true })}`;
    } catch (e) {
      return 'Saved Draft';
    }
  };

  // Render a configuration card
  const renderConfigCard = (config: SavedConfiguration) => {
    // Extract features
    const features = [
      ...(config.selectedAssistance?.map(f => f.name) || []),
      ...(config.selectedComfort?.map(f => f.name) || [])
    ];

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
            onClick={() => continueWithConfig(config)}
            className={styles.continueButton}
          >
            Continue
          </button>
          <button
            onClick={() => deleteLocalConfig(config.id)}
            className={styles.deleteButton}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <button onClick={goBackToConfigurator} className={styles.backButton}>
              <IoArrowBack />
              <span>Back</span>
            </button>
            <h1 className={styles.pageTitle}>Saved Configurations</h1>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.configList}>
          {!localConfigs || Object.keys(localConfigs).length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📁</div>
              <h3>No saved configurations</h3>
              <p>Configurations you save will appear here</p>
              <button
                onClick={() => navigate('/configurator')}
                className={styles.startButton}
              >
                Start Configuring
              </button>
            </div>
          ) : (
            // Sort configurations by saved date (newest first) and render them
            Object.values(localConfigs)
              .sort((a, b) =>
                new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
              )
              .map(config =>
                renderConfigCard(config)
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedConfigurations;