import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IoRefreshOutline } from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";
import VehicleViewer from '@components/3DCarModel/VehicleViewer';
import styles from './Configurator.module.css';
import { getCategories } from '@lib/getCategories';
import { getNextSubcategory } from '@lib/getNextSubcategory';
import { toast, ToastContainer } from 'react-toastify';
import { LeasingProvider } from '@context/LeasingContext';
import { ConfigurationProvider as ConfiguratorProvider, useConfiguration } from '@context/ConfigurationContext';
import { ConfiguratorHeader, ConfiguratorContent, ConfiguratorSidebar } from '@components/configurator';
import { loadConfigurationById, saveConfigurationLocally, loadConfigurationsForModel } from '@hooks/useLocalConfiguration';
import Popup from '@components/Popup';
import { Feature } from '../../types/types';
import SaveConfigurationPopup from '@components/configurator/saveConfigurationPopup';

const ConfiguratorLayout = () => {
  const { modelId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    model, selectedColor, selectedRim, selectedEngine,
    selectedTransmission, selectedUpholstery,
    selectedAssistance, selectedComfort, totalPrice,
    loadModelData,
    setSelectedColor, setSelectedRim, setSelectedEngine,
    setSelectedTransmission, setSelectedUpholstery,
    toggleAssistance, toggleComfort
  } = useConfiguration();

  // Track if we've already loaded the saved config
  const [loadedSavedConfig, setLoadedSavedConfig] = useState<string | null>(null);

  // Check if we have a specific configuration ID from navigation state
  const configurationId = location.state?.configurationId;

  const [isSavePopupOpen, setIsSavePopupOpen] = useState(false);

  // Flag to prevent auto-loading after saving
  const [preventAutoLoad, setPreventAutoLoad] = useState(false);

  useEffect(() => {
    const loadAndApplySavedConfig = async () => {
      if (!modelId) return;

      await loadModelData(modelId);

      // If we just saved, don't trigger auto-loading
      if (preventAutoLoad) {
        return;
      }

      if (configurationId && loadedSavedConfig !== configurationId) {
        // Load the specific saved configuration
        const savedConfig = loadConfigurationById(configurationId);

        if (savedConfig) {
          // Apply the saved configuration
          if (savedConfig.selectedColor) setSelectedColor(savedConfig.selectedColor);
          if (savedConfig.selectedRim) setSelectedRim(savedConfig.selectedRim);
          if (savedConfig.selectedEngine) setSelectedEngine(savedConfig.selectedEngine);
          if (savedConfig.selectedTransmission) setSelectedTransmission(savedConfig.selectedTransmission);
          if (savedConfig.selectedUpholstery) setSelectedUpholstery(savedConfig.selectedUpholstery);

          // Handle array items
          if (savedConfig.selectedAssistance && savedConfig.selectedAssistance.length > 0) {
            // Clear existing selections first
            toggleAssistance(null);
            savedConfig.selectedAssistance.forEach((item: Feature) => toggleAssistance(item));
          }

          if (savedConfig.selectedComfort && savedConfig.selectedComfort.length > 0) {
            // Clear existing selections first
            toggleComfort(null);
            savedConfig.selectedComfort.forEach((item: Feature) => toggleComfort(item));
          }

          // Show toast only once
          toast.info("Loaded your saved configuration", {
            toastId: 'config-loaded-specific'
          });

          // Mark this configuration as loaded
          setLoadedSavedConfig(configurationId);
        } else {
          toast.error("Could not find the saved configuration", {
            toastId: 'config-not-found'
          });
        }
      } else if (model && !configurationId && loadedSavedConfig === null) {
        // Default behavior - try to find any saved config for this model
        const savedConfigs = loadConfigurationsForModel(parseInt(modelId));

        if (savedConfigs.length > 0) {
          // Take the most recent configuration
          const mostRecent = savedConfigs.sort((a, b) =>
            new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
          )[0];

          // Apply the saved configuration
          if (mostRecent.selectedColor) setSelectedColor(mostRecent.selectedColor);
          if (mostRecent.selectedRim) setSelectedRim(mostRecent.selectedRim);
          if (mostRecent.selectedEngine) setSelectedEngine(mostRecent.selectedEngine);
          if (mostRecent.selectedTransmission) setSelectedTransmission(mostRecent.selectedTransmission);
          if (mostRecent.selectedUpholstery) setSelectedUpholstery(mostRecent.selectedUpholstery);

          // Handle array items
          if (mostRecent.selectedAssistance && mostRecent.selectedAssistance.length > 0) {
            toggleAssistance(null);
            mostRecent.selectedAssistance.forEach((item: Feature) => toggleAssistance(item));
          }

          if (mostRecent.selectedComfort && mostRecent.selectedComfort.length > 0) {
            toggleComfort(null);
            mostRecent.selectedComfort.forEach((item: Feature) => toggleComfort(item));
          }

          // Show toast with unique ID
          toast.info("Loaded your most recent configuration", {
            toastId: 'config-loaded-recent'
          });

          // Mark as loaded
          setLoadedSavedConfig('default');
        }
      }
    };

    loadAndApplySavedConfig();

  }, [modelId, model, loadModelData, configurationId, loadedSavedConfig, preventAutoLoad]);

  // UI state
  const [activeCategory, setActiveCategory] = useState<string>('motorization');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('engine');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const categories = getCategories();

  // Calculate overall progress
  const calculateProgress = (): number => {
    const totalSteps = categories.reduce((acc, cat) => acc + cat.subcategories.length, 0);
    const completedCount = Object.values(completedSteps).filter(Boolean).length;
    return Math.round((completedCount / totalSteps) * 100);
  };

  const handleBack = () => {
    navigate('/configurator');
  };

  const getNextCategory = () => {
    return getNextSubcategory(categories, activeCategory, activeSubcategory);
  };

  const handleCompleteConfiguration = () => {
    if (calculateProgress() === 100) {

      // first ask if the configuration should be saved
      setIsSavePopupOpen(true);
    } else {
      toast.error("Please complete all configuration steps before proceeding to checkout");
    }
  }

  const completeConfigurationWithSave = () => {
    if (!model) {
      toast.error('Could not complete configuration!');
      return;
    }

    // Set the flag to prevent auto-loading
    setPreventAutoLoad(true);

    const savedId = saveConfigurationLocally({
      model,
      selectedColor,
      selectedRim,
      selectedEngine,
      selectedTransmission,
      selectedUpholstery,
      selectedAssistance,
      selectedComfort,
      totalPrice
    });

    // Update the loaded config ID after saving
    setLoadedSavedConfig(savedId);

    // Show save success toast with unique ID
    toast.success('Configuration saved successfully!', {
      toastId: 'config-saved-success'
    });

    completeConfiguration();
  }

  const completeConfiguration = () => {
    navigate('/summary', {
      state: {
        configuration: {
          model,
          selectedColor,
          selectedRim,
          selectedEngine,
          selectedTransmission,
          selectedUpholstery,
          selectedAssistance,
          selectedComfort,
          totalPrice
        }
      }
    });
  }

  const handleNextClick = () => {
    const next = getNextCategory();
    if (next) {
      setActiveCategory(next.categoryId);
      setActiveSubcategory(next.subcategoryId);
    }
  };

  // When selecting a category, select its first subcategory automatically
  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    const category = categories.find(c => c.id === categoryId);
    if (category && category.subcategories.length > 0) {
      const subcategoryId = category.subcategories[0].id;
      setActiveSubcategory(subcategoryId);

      // Mark subcategory as completed when viewed
      if (['assistance', 'comfort', 'pricing', 'review'].includes(subcategoryId)) {
        setCompletedSteps(prev => ({ ...prev, [subcategoryId]: true }));
      }
    }
  };

  // Mark selections as completed
  useEffect(() => {
    if (selectedColor) setCompletedSteps(prev => ({ ...prev, 'exterior-color': true }));
    if (selectedRim) setCompletedSteps(prev => ({ ...prev, 'rims': true }));
    if (selectedEngine) setCompletedSteps(prev => ({ ...prev, 'engine': true }));
    if (selectedTransmission) setCompletedSteps(prev => ({ ...prev, 'transmission': true }));
    if (selectedUpholstery) setCompletedSteps(prev => ({ ...prev, 'upholstery': true }));
  }, [selectedColor, selectedRim, selectedEngine, selectedTransmission, selectedUpholstery]);

  const goToSection = (category: string, subcategory: string) => {
    setActiveCategory(category);
    setActiveSubcategory(subcategory);
  };

  // Mark subcategory as viewed/completed when selecting it
  useEffect(() => {
    if (['assistance', 'comfort', 'pricing', 'review'].includes(activeSubcategory)) {
      setCompletedSteps(prev => ({ ...prev, [activeSubcategory]: true }));
    }
  }, [activeSubcategory]);

  if (!model) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loader}></div>
      <p>Loading your configuration...</p>
    </div>
  );

  return (
    <LeasingProvider totalPrice={totalPrice}>
      <div className={styles.configuratorContainer}>
        <ConfiguratorHeader
          onBack={handleBack}
          model={model}
          totalPrice={totalPrice}
          loadedSavedConfig={loadedSavedConfig}
        />

        {/* Main content with sidebar and viewer */}
        <div className={styles.mainContent}>
          <ConfiguratorSidebar
            categories={categories}
            activeCategory={activeCategory}
            activeSubcategory={activeSubcategory}
            completedSteps={completedSteps}
            calculateProgress={calculateProgress}
            onCategoryClick={handleCategoryClick}
            onSubcategoryClick={setActiveSubcategory}
          />

          {/* Center car viewer area */}
          <div className={styles.viewerWrapper}>
            <div className={styles.viewer}>
              <VehicleViewer modelPath={model.model3dPath} color={selectedColor} autoRotateSpeed={0.3} />
              <div className={styles.rotateIndicator}>
                <IoRefreshOutline />
                360°
              </div>
            </div>

            {/* Bottom options panel */}
            <div className={styles.optionsPanel}>
              <ConfiguratorContent
                activeSubcategory={activeSubcategory}
                completeConfiguration={handleCompleteConfiguration}
                goToSection={goToSection}
              />

              {/* Navigation buttons */}
              <div className={styles.configNavigation}>
                {getNextCategory() && (
                  <button
                    className={styles.nextButton}
                    onClick={handleNextClick}
                  >
                    Next: {getNextCategory()?.categoryId === activeCategory
                      ? categories.find(c => c.id === activeCategory)?.subcategories.find(s => s.id === getNextCategory()?.subcategoryId)?.label
                      : categories.find(c => c.id === getNextCategory()?.categoryId)?.label
                    }
                    <MdKeyboardArrowRight size={24} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          stacked={true}
          newestOnTop={true}
          style={{ marginRight: "1.5rem", marginBottom: "0.75rem" }}
        />

        <Popup isOpen={isSavePopupOpen} onClose={() => setIsSavePopupOpen(false)} title="Save Configuration">
          <SaveConfigurationPopup
            model={model}
            onContinue={completeConfiguration}
            onSaveAndContinue={completeConfigurationWithSave}
          />
        </Popup>
      </div>
    </LeasingProvider>
  );
}

const Configurator = () => {
  return (
    <ConfiguratorProvider>
      <ConfiguratorLayout />
    </ConfiguratorProvider>
  );
}

export default Configurator;