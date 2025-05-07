import { useParams, useNavigate } from 'react-router-dom';
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

const ConfiguratorLayout = () => {
  const { modelId } = useParams();
  const navigate = useNavigate();
  const {
    model, selectedColor, selectedRim, selectedEngine,
    selectedTransmission, selectedUpholstery, 
    selectedAssistance, selectedComfort, totalPrice,
    loadModelData
  } = useConfiguration();

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

  useEffect(() => {
    if (modelId) {
      loadModelData(modelId);
    }
  }, [modelId, loadModelData]);

  const handleBack = () => {
    navigate('/configurator');
  };

  const getNextCategory = () => {
    return getNextSubcategory(categories, activeCategory, activeSubcategory);
  };

  const completeConfiguration = () => {
    if (calculateProgress() === 100) {
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
    } else {
      toast.error("Please complete all configuration steps before proceeding to checkout");
    }
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
                completeConfiguration={completeConfiguration}
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
      </div>
    </LeasingProvider>
  );
}

function Configurator() {
  return (
    <ConfiguratorProvider>
      <ConfiguratorLayout />
    </ConfiguratorProvider>
  );
}

export default Configurator;