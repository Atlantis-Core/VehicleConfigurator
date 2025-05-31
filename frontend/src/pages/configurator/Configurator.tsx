import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MdKeyboardArrowRight } from "react-icons/md";
import VehicleViewer from '@components/features/model/3DCarModel/VehicleViewer';
import styles from './Configurator.module.css';
import { getCategories } from '@lib/getCategories';
import { getNextSubcategory } from '@lib/getNextSubcategory';
import { toast, ToastContainer } from 'react-toastify';
import { LeasingProvider } from '@context/LeasingContext';
import { ConfigurationProvider as ConfiguratorProvider, useConfiguration } from '@context/ConfigurationContext';
import { ConfiguratorHeader, ConfiguratorContent, ConfiguratorSidebar, ConfiguratorMobileHeader } from '@components/features/configurator';
import { saveConfigurationLocally } from '@hooks/useLocalConfiguration';
import Popup from '@components/ui/popup';
import SaveConfigurationPopup from '@components/features/configurator/saveConfigurationPopup';
import { MobileSidebarHeader } from '@components/features/configurator/sidebar';
import { useConfigurationLoader } from '@hooks/useConfigurationLoader';

const ConfiguratorLayout = () => {
  const { modelId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [loadedSavedConfig, setLoadedSavedConfig] = useState<string | null>(null);
  const configurationId = location.state?.configurationId;
  const [isSavePopupOpen, setIsSavePopupOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<'viewer' | 'options'>('viewer');

  const {
    model, selectedColor, selectedRim, selectedEngine,
    selectedTransmission, selectedUpholstery, selectedAssistance,
    selectedComfort, totalPrice
  } = useConfiguration();


  const { preventNextAutoLoad } = useConfigurationLoader(
    modelId,
    configurationId,
    loadedSavedConfig,
    setLoadedSavedConfig
  );

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

    preventNextAutoLoad();

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

    setLoadedSavedConfig(savedId);
    toast.success('Configuration saved successfully!', { toastId: 'config-saved-success' });
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
          brand: model?.brand,
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

    // Close mobile sidebar after selection
    setIsMobileSidebarOpen(false);
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

  // Get current step info for mobile header
  const getCurrentStepInfo = () => {
    const currentCategory = categories.find(c => c.id === activeCategory);
    const currentSubcategory = currentCategory?.subcategories.find(s => s.id === activeSubcategory);
    return {
      categoryLabel: currentCategory?.label || '',
      subcategoryLabel: currentSubcategory?.label || ''
    };
  };

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

        <ConfiguratorMobileHeader
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          getCurrentStepInfo={getCurrentStepInfo}
          calculateProgress={calculateProgress}
          activeView={activeView}
          setActiveView={setActiveView}
        />

        <div className={styles.mainContent}>
          <div className={styles.desktopSidebar}>
            <ConfiguratorSidebar
              categories={categories}
              activeCategory={activeCategory}
              activeSubcategory={activeSubcategory}
              completedSteps={completedSteps}
              calculateProgress={calculateProgress}
              onCategoryClick={handleCategoryClick}
              onSubcategoryClick={setActiveSubcategory}
            />
          </div>

          {isMobileSidebarOpen && (
            <div className={styles.mobileOverlay}>
              <div className={styles.mobileSidebar}>

                <MobileSidebarHeader
                  closeSidebar={() => setIsMobileSidebarOpen(false)}
                />

                <ConfiguratorSidebar
                  categories={categories}
                  activeCategory={activeCategory}
                  activeSubcategory={activeSubcategory}
                  completedSteps={completedSteps}
                  calculateProgress={calculateProgress}
                  onCategoryClick={handleCategoryClick}
                  onSubcategoryClick={(subcategoryId) => {
                    setActiveSubcategory(subcategoryId);
                    setIsMobileSidebarOpen(false);
                  }}
                />
              </div>
            </div>
          )}

          <div className={styles.viewerWrapper}>
            <div className={`${styles.viewer} ${activeView === 'options' ? styles.hiddenOnMobile : ''}`}>
              <VehicleViewer
                modelPath={model.model3dPath}
                color={selectedColor}
                autoRotateSpeed={0.3}
              />
            </div>

            <div className={`${styles.optionsPanel} ${activeView === 'viewer' ? styles.hiddenOnMobile : ''}`}>
              <ConfiguratorContent
                activeSubcategory={activeSubcategory}
                completeConfiguration={handleCompleteConfiguration}
                goToSection={goToSection}
              />

              <div className={styles.mobileNavigationFooter}>
                {getNextCategory() && (
                  <button
                    className={styles.mobileNextButton}
                    onClick={handleNextClick}
                  >
                    <div className={styles.nextButtonContent}>
                      <span>Next Step</span>
                      <div className={styles.nextStepInfo}>
                        {getNextCategory()?.categoryId === activeCategory
                          ? categories.find(c => c.id === activeCategory)?.subcategories.find(s => s.id === getNextCategory()?.subcategoryId)?.label
                          : categories.find(c => c.id === getNextCategory()?.categoryId)?.label
                        }
                      </div>
                    </div>
                    <MdKeyboardArrowRight size={24} />
                  </button>
                )}
              </div>

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
          className={styles.toastContainer}
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