import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MdKeyboardArrowRight } from "react-icons/md";
import VehicleViewer from '@components/features/model/3DCarModel/VehicleViewer';
import styles from './Configurator.module.css';
import { getCategories } from '@lib/getCategories';
import { getNextSubcategory } from '@lib/getNextSubcategory';
import { toast, ToastContainer } from 'react-toastify';
import { LeasingProvider } from '@context/LeasingContext';
import { ConfiguratorHeader, ConfiguratorContent, ConfiguratorSidebar, ConfiguratorMobileHeader } from '@components/features/configurator';
import { saveConfigurationLocally } from '@hooks/useLocalConfiguration';
import Popup from '@components/ui/popup';
import SaveConfigurationPopup from '@components/features/configurator/saveConfigurationPopup';
import { MobileSidebarHeader } from '@components/features/configurator/sidebar';
import { useAppDispatch, useAppSelector } from '@state/hooks';
import { loadModelData, loadSavedConfiguration, updateCompletedSteps } from '@state/configuration/configurationSlice';
import { selectConfiguration, selectTotalPrice, selectSelectedOptions } from '@state/configuration/selectors';
import { Provider } from 'react-redux';
import { store } from '@state/store';

const ConfiguratorLayout = () => {
  const { modelId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const configurationId = location.state?.configurationId as string | undefined;
  const [isSavePopupOpen, setIsSavePopupOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<'viewer' | 'options'>('viewer');

  const { model, loading, error, completedSteps } = useAppSelector(selectConfiguration);
  const totalPrice = useAppSelector(selectTotalPrice);
  const {
    selectedColor,
    selectedRim,
    selectedEngine,
    selectedTransmission,
    selectedUpholstery,
    selectedAssistance,
    selectedComfort
  } = useAppSelector(selectSelectedOptions);

  useEffect(() => {
    const loadConfig = async () => {
      if (configurationId) {
        toast.info(`Loading saved configuration: ${configurationId}`, { toastId: "loading-saved-config" });

        try {
          await dispatch(loadSavedConfiguration(configurationId)).unwrap();
          toast.dismiss("loading-saved-config");
          toast.success("Successfully loaded saved configuration");
        } catch (error: any) {
          toast.dismiss("loading-saved-config");
          toast.error(`Failed to load saved configuration: ${error}`);

          // Fallback
          if (modelId) {
            dispatch(loadModelData(modelId));
          }
        }
      } else if (modelId) {
        dispatch(loadModelData(modelId));
      } else {
        toast.error("No model or configuration specified to load.");
      }
    };

    loadConfig();
  }, [dispatch, modelId, configurationId, navigate]);

  const [activeCategory, setActiveCategory] = useState<string>('motorization');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('engine');
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

    saveConfigurationLocally({
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
    }

    setIsMobileSidebarOpen(false);
  };

  // Mark selections as completed
  useEffect(() => {
    const updates: Record<string, boolean> = {};
    if (selectedColor) updates['exterior-color'] = true;
    if (selectedRim) updates['rims'] = true;
    if (selectedEngine) updates['engine'] = true;
    if (selectedTransmission) updates['transmission'] = true;
    if (selectedUpholstery) updates['upholstery'] = true;

    if (Object.keys(updates).length > 0) {
      dispatch(updateCompletedSteps(updates));
    }
  }, [selectedColor, selectedRim, selectedEngine, selectedTransmission, selectedUpholstery, dispatch]);

  const goToSection = (category: string, subcategory: string) => {
    setActiveCategory(category);
    setActiveSubcategory(subcategory);
  };

  // Mark subcategory as viewed/completed when selecting it
  useEffect(() => {
    if (['assistance', 'comfort', 'pricing', 'review'].includes(activeSubcategory)) {
      dispatch(updateCompletedSteps({ [activeSubcategory]: true }));
    }
  }, [activeSubcategory, dispatch]);

  const getCurrentStepInfo = () => {
    const currentCategory = categories.find(c => c.id === activeCategory);
    const currentSubcategory = currentCategory?.subcategories.find(s => s.id === activeSubcategory);
    return {
      categoryLabel: currentCategory?.label || '',
      subcategoryLabel: currentSubcategory?.label || ''
    };
  };

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loader}></div>
      <p>Loading your configuration...</p>
    </div>
  );

  if (error) return (
    <div className={styles.loadingContainer}>
      <p>Error loading configuration: {error}</p>
      <button onClick={() => navigate('/configurator')}>Go Back</button>
    </div>
  );

  if (!model) return (
    <div className={styles.loadingContainer}>
      <p>Could not load model data. The model might not exist or there was an issue retrieving it.</p>
      <button onClick={() => navigate('/configurator')}>Go Back to Selection</button>
    </div>
  );

  return (
    <LeasingProvider totalPrice={totalPrice}>
      <div className={styles.configuratorContainer}>
        <ConfiguratorHeader
          onBack={handleBack}
          model={model}
          configurationId={configurationId ?? ""}
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
    <Provider store={store}>
      <ConfiguratorLayout />
    </Provider>
  );
}

export default Configurator;