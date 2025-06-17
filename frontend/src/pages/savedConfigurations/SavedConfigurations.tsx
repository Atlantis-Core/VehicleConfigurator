import { useState, useEffect } from 'react';
import styles from './SavedConfigurations.module.css';
import {
  getAllSavedConfigurations,
  deleteConfigurationLocally,
  SavedConfigurations as SavedConfigurationsType,
  SavedConfiguration,
} from '@state/localStorage/useLocalConfiguration';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import ConfigCard from '@components/features/configCard';

const SavedConfigurations = () => {
  const [localConfigs, setLocalConfigs] = useState<SavedConfigurationsType | null>(null);
  const navigate = useNavigate();

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

  const goBackToConfigurator = () => {
    navigate('/configurator');
  };

  const deleteLocalConfig = (config: SavedConfiguration) => {
    try {
      deleteConfigurationLocally(config.id);
      setLocalConfigs(getAllSavedConfigurations());
    } catch (error) {
      console.error('Error deleting configuration:', error);
    }
  };

  const continueWithConfig = (config: SavedConfiguration) => {
    navigate(`/configurator/${config.model.id}`, {
      state: { configurationId: config.id }
    });
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
                <ConfigCard
                  config={config}
                  deleteAction={deleteLocalConfig}
                  continueAction={continueWithConfig}
                />
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedConfigurations;