import { useState, useEffect } from 'react';
import styles from './SavedConfigurations.module.css';
import {
  getAllSavedConfigurations,
  deleteConfigurationLocally,
  SavedConfigurations as SavedConfigurationsType,
  SavedConfiguration
} from '@hooks/useLocalConfiguration';
import { useNavigate } from 'react-router-dom';
import { Configuration } from '../../types/types';
import { getImageUrl } from '@lib/getImageUrl';
import { IoArrowBack } from 'react-icons/io5';
import { formatDistanceToNow } from 'date-fns';

// Extend the standard Configuration type for ordered configurations
interface OrderedConfiguration extends Configuration {
  orderId: string;
  orderDate: string;
  status: 'pending' | 'completed' | 'cancelled';
  model: {
    id: string | number;
    name: string;
    imagePath?: string;
  };
}

const SavedConfigurations = () => {
  const [activeTab, setActiveTab] = useState<'local' | 'ordered'>('local');
  const [localConfigs, setLocalConfigs] = useState<SavedConfigurationsType | null>(null);
  const [orderedConfigs, setOrderedConfigs] = useState<OrderedConfiguration[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  // Fetch ordered configurations from the database
  const fetchOrderedConfigurations = async () => {
    if (activeTab === 'ordered') {
      setIsLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrderedConfigs(data);
        } else {
          throw new Error('Failed to fetch ordered configurations');
        }
      } catch (error) {
        console.error('Error fetching ordered configurations:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchOrderedConfigurations();
  }, [activeTab]);

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
  const renderConfigCard = (config: SavedConfiguration | OrderedConfiguration, isOrdered = false) => {
    const orderedConfig = isOrdered ? config as OrderedConfiguration : null;
    const savedConfig = !isOrdered ? config as SavedConfiguration : null;

    // Extract features based on whether it's a standard configuration or ordered configuration
    const features = isOrdered
      ? (orderedConfig?.features?.map(f => f.featureId.toString()) || [])
      : [
        ...(savedConfig?.selectedAssistance?.map(f => f.name) || []),
        ...(savedConfig?.selectedComfort?.map(f => f.name) || [])
      ];

    return (
      <div key={isOrdered ? (orderedConfig?.id || '') : config.id} className={styles.configCard}>
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
            {isOrdered
              ? `Order Date: ${orderedConfig?.orderDate}`
              : formatSavedDate((config as SavedConfiguration).savedAt)
            }
          </div>

          {/* Configuration specs section */}
          <div className={styles.configSpecs}>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Color:</span>
              <span className={styles.specValue}>
                {savedConfig?.selectedColor ? (
                  <div className={styles.colorDisplay}>
                    <div
                      className={styles.colorSwatch}
                      style={{ backgroundColor: savedConfig.selectedColor.hexCode || '#333' }}
                    ></div>
                    {savedConfig.selectedColor.name}
                  </div>
                ) : 'Not selected'}
              </span>
            </div>

            <div className={styles.specRow}>
              <span className={styles.specLabel}>Rim:</span>
              <span className={styles.specValue}>
                {savedConfig?.selectedRim ? `${savedConfig.selectedRim.name} (${savedConfig.selectedRim.size}")` : 'Not selected'}
              </span>
            </div>

            <div className={styles.specRow}>
              <span className={styles.specLabel}>Engine:</span>
              <span className={styles.specValue}>
                {savedConfig?.selectedEngine ? savedConfig.selectedEngine.name : 'Not selected'}
              </span>
            </div>

            <div className={styles.specRow}>
              <span className={styles.specLabel}>Interior:</span>
              <span className={styles.specValue}>
                {savedConfig?.selectedUpholstery ? savedConfig.selectedUpholstery.name : 'Not selected'}
              </span>
            </div>
          </div>

          <div className={styles.configPrice}>
            ${isOrdered ?
              orderedConfig?.totalPrice?.toLocaleString() :
              (savedConfig?.totalPrice?.toLocaleString()) || '0'
            }
          </div>

          {isOrdered && orderedConfig?.status && (
            <div className={`${styles.orderStatus} ${styles[orderedConfig.status]}`}>
              {orderedConfig.status.charAt(0).toUpperCase() + orderedConfig.status.slice(1)}
            </div>
          )}

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
          {!isOrdered && (
            <>
              <button
                onClick={() => continueWithConfig(config as SavedConfiguration)}
                className={styles.continueButton}
              >
                Continue
              </button>
              <button
                onClick={() => deleteLocalConfig((config as SavedConfiguration).id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </>
          )}
          {isOrdered && (
            <button className={styles.viewDetailsButton}>
              View Details
            </button>
          )}
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
          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${activeTab === 'local' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('local')}
            >
              Saved Drafts
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'ordered' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('ordered')}
            >
              My Orders
            </button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {activeTab === 'local' && (
          <div className={styles.configList}>
            {!localConfigs || Object.keys(localConfigs).length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📁</div>
                <h3>No saved configurations</h3>
                <p>Configurations you save will appear here</p>
                <button
                  onClick={() => navigate('/models')}
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
        )}

        {activeTab === 'ordered' && (
          <div className={styles.configList}>
            {isLoading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading your orders...</p>
              </div>
            ) : orderedConfigs.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🛒</div>
                <h3>No orders found</h3>
                <p>Your completed orders will appear here</p>
                <button
                  onClick={() => navigate('/models')}
                  className={styles.startButton}
                >
                  Configure Your Vehicle
                </button>
              </div>
            ) : (
              orderedConfigs.map(config => renderConfigCard(config, true))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedConfigurations;