import { useState, useEffect } from 'react';
import styles from './SavedConfigurations.module.css';
import { getAllSavedConfigurations, SavedConfigurations as SavedConfigurationsType } from '@hooks/useLocalConfiguration';
import { useNavigate } from 'react-router-dom';
import { Configuration, ConfigurationSummary } from '../../types/types';
import { getImageUrl } from '@lib/getImageUrl';
import { IoArrowBack } from 'react-icons/io5';

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
    // TODO: delete local config
  };

  // Continue with configuration
  const continueWithConfig = (config: ConfigurationSummary) => {
    // Navigate to the configurator with the selected config
    navigate(`/configurator/${config.model.id}`);
  };

  // Go back to configurator
  const goBackToConfigurator = () => {
    navigate('/configurator');
  };

  // Render a configuration card
  const renderConfigCard = (config: ConfigurationSummary | OrderedConfiguration | any, isOrdered = false) => {
    const orderedConfig = isOrdered ? config as OrderedConfiguration : null;
    
    // Extract features based on whether it's a standard configuration or ordered configuration
    const features = isOrdered 
      ? (orderedConfig?.features?.map(f => f.featureId.toString()) || [])
      : [
          ...(config as ConfigurationSummary).selectedAssistance?.map(f => f.name) || [],
          ...(config as ConfigurationSummary).selectedComfort?.map(f => f.name) || []
        ];
    
    return (
      <div key={isOrdered ? (orderedConfig?.id || '') : config.model.id.toString()} className={styles.configCard}>
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
            {isOrdered ? `Order Date: ${orderedConfig?.orderDate}` : 'Saved Draft'}
          </div>
          <div className={styles.configPrice}>
            ${isOrdered ? 
              orderedConfig?.totalPrice?.toLocaleString() : 
              (config as ConfigurationSummary).totalPrice?.toLocaleString()
            }
          </div>
          
          {isOrdered && orderedConfig?.status && (
            <div className={`${styles.orderStatus} ${styles[orderedConfig.status]}`}>
              {orderedConfig.status.charAt(0).toUpperCase() + orderedConfig.status.slice(1)}
            </div>
          )}

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
        
        <div className={styles.configActions}>
          {!isOrdered && (
            <>
              <button 
                onClick={() => continueWithConfig(config as ConfigurationSummary)} 
                className={styles.continueButton}
              >
                Continue
              </button>
              <button 
                onClick={() => deleteLocalConfig(config.model.id.toString())} 
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
              Object.values(localConfigs).map(config => renderConfigCard(config as any))
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