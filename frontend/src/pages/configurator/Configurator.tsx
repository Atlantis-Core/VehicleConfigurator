import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { getColors, getEngines, getModels, getRims, getTransmissions, getFeatures, getInteriors } from '@api/api';
import VehicleViewer from '@components/3DCarModel/VehicleViewer';
import styles from './Configurator.module.css';
import { IoArrowBack, IoRefreshOutline, IoCheckmarkCircle } from "react-icons/io5";
import { BsBookmark, BsInfoCircleFill } from "react-icons/bs";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaRegCircle, FaCircle, FaCar, FaPaintBrush, FaCogs, FaStar, FaChair } from "react-icons/fa";
import { Color, Engine, Model, Rim, Transmission, Feature, Interior } from '../../types/types';
import { getCategories } from '@lib/getCategories';
import { getNextSubcategory } from '@lib/getNextSubcategory';
import Logo from "@assets/logo.svg";
import ExteriorColor from '@components/categoryContent/exteriorColor';
import Rims from '@components/categoryContent/rims';
import { default as EngineCategory } from '@components/categoryContent/engines';
import Transmissions from '@components/categoryContent/transmissions';
import Upholstery from '@components/categoryContent/upholstery';
import Assistance from '@components/categoryContent/assistance';
import Comfort from '@components/categoryContent/comfort';
import Pricing from '@components/categoryContent/pricing';
import LeasingModal from '@components/leasingModal';
import ConfigurationReview from '@components/categoryContent/configurationReview';

function Configurator() {
  const { modelId } = useParams();
  const navigate = useNavigate();

  // State variables
  const [model, setModel] = useState<Model>();
  const [rims, setRims] = useState<Rim[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [engines, setEngines] = useState<Engine[]>([]);
  const [transmissions, setTransmissions] = useState<Transmission[]>([]);
  const [upholsteries, setUpholsteries] = useState<Interior[]>([]);
  const [assistances, setAssistances] = useState<Feature[]>([]);
  const [comforts, setComforts] = useState<Feature[]>([]);

  // Selected options
  const [selectedColor, setSelectedColor] = useState<Color>();
  const [selectedRim, setSelectedRim] = useState<Rim>();
  const [selectedEngine, setSelectedEngine] = useState<Engine>();
  const [selectedTransmission, setSelectedTransmission] = useState<Transmission>();
  const [selectedUpholstery, setSelectedUpholstery] = useState<Interior>();
  const [selectedAssistance, setSelectedAssistance] = useState<Feature | null>();
  const [selectedComfort, setSelectedComfort] = useState<Feature | null>();

  const [activeCategory, setActiveCategory] = useState<string>('motorization');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('engine');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const categories = getCategories();

  const [isLeasingModalOpen, setIsLeasingModalOpen] = useState(false);

  const openLeasingModal = () => setIsLeasingModalOpen(true);
  const closeLeasingModal = () => setIsLeasingModalOpen(false);

  // Get category icon based on id
  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'motorization': return <FaCar />;
      case 'exterior': return <FaPaintBrush />;
      case 'interior': return <FaChair />;
      case 'features': return <FaCogs />;
      case 'summary': return <FaStar />;
      default: return <FaCar />;
    }
  };

  // Calculate overall progress
  const calculateProgress = () => {
    const totalSteps = categories.reduce((acc, cat) => acc + cat.subcategories.length, 0);
    const completedCount = Object.values(completedSteps).filter(Boolean).length;
    return Math.round((completedCount / totalSteps) * 100);
  };

  const totalPrice = useMemo(() => {
    return (
      (model?.basePrice || 0) +
      (selectedColor?.additionalPrice || 0) +
      (selectedRim?.additionalPrice || 0) +
      (selectedEngine?.additionalPrice || 0) +
      (selectedUpholstery?.additionalPrice || 0) +
      (selectedAssistance?.additionalPrice || 0) +
      (selectedComfort?.additionalPrice || 0)
    );
  }, [
    model,
    selectedColor,
    selectedRim,
    selectedEngine,
    selectedUpholstery,
    selectedAssistance,
    selectedComfort
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch data in parallel with proper typing
        const [models, rims, colors, engines, transmissions, interiors, features] = await Promise.all([
          getModels(),
          getRims(),
          getColors(),
          getEngines(),
          getTransmissions(),
          getInteriors(),
          getFeatures()
        ]);

        // Set model state if found
        const foundModel = models.find((m) => m.id === parseInt(modelId || ''));
        if (foundModel) setModel(foundModel);

        // Set collections
        setRims(rims);
        setColors(colors);
        setEngines(engines);
        setTransmissions(transmissions);
        setUpholsteries(interiors);

        // Filter features into assistances and comforts
        setAssistances(features.filter((feature) => feature.category === 'assistance'));
        setComforts(features.filter((feature) => feature.category === 'comfort'));
      } catch (err) {
        console.error('Error loading config data:', err);
      }
    }

    loadData();
  }, [modelId]);

  const handleBack = () => {
    navigate('/configurator');
  };

  const getNextCategory = () => {
    return getNextSubcategory(categories, activeCategory, activeSubcategory);
  };

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
      setActiveSubcategory(category.subcategories[0].id);
    }
  };

  // Handle selection and mark step as completed
  const handleColorSelect = (color: Color) => {
    setSelectedColor(color);
    setCompletedSteps(prev => ({ ...prev, 'exterior-color': true }));
  };

  const handleRimSelect = (rim: Rim) => {
    setSelectedRim(rim);
    setCompletedSteps(prev => ({ ...prev, 'rims': true }));
  };

  const handleSelectEngine = (engine: Engine) => {
    setSelectedEngine(engine);
    setCompletedSteps(prev => ({ ...prev, 'engine': true }));
  }

  const handleSelectTransmission = (transmission: Transmission) => {
    setSelectedTransmission(transmission);
    setCompletedSteps(prev => ({ ...prev, 'transmission': true }));
  } 

  const handleSelectUpholstery = (upholstery: Interior) => {
    setSelectedUpholstery(upholstery);
    setCompletedSteps(prev => ({ ...prev, 'upholstery': true }));
  };

  const handleSelectAssistance = (assistance: Feature | null) => {
    setSelectedAssistance(assistance);
    setCompletedSteps(prev => ({ ...prev, 'assistance': true }));
  };

  const handleSelectComfort = (comfort: Feature | null) => {
    setSelectedComfort(comfort);
    setCompletedSteps(prev => ({ ...prev, 'comfort': true }));
  };

  const goToSection = (category: string, subcategory: string) => {
    setActiveCategory(category);
    setActiveSubcategory(subcategory);
  };

  if (!model) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loader}></div>
      <p>Loading your configuration...</p>
    </div>
  );

  const renderActiveContent = () => {
    // Render based on the active subcategory
    switch (activeSubcategory) {
      case 'engine':
        return (
          <EngineCategory
            engines={engines}
            selectedEngine={selectedEngine}
            handleSelectEngine={handleSelectEngine}
          />
        );
      case 'transmission':
        return (
          <Transmissions
            transmissions={transmissions}
            selectedTransmission={selectedTransmission}
            handleSelectTransmission={handleSelectTransmission}
          />
        );
      case 'exterior-color':
        return (
          <ExteriorColor
            colors={colors}
            selectedColor={selectedColor}
            onSelectColor={handleColorSelect}
          />
        );
      case 'rims':
        return (
          <Rims
            rims={rims}
            selectedRim={selectedRim}
            handleRimSelect={handleRimSelect}
          />
        );
      case 'upholstery':
        return (
          <Upholstery
            upholsteries={upholsteries}
            selectedUpholstery={selectedUpholstery}
            handleSelectUpholstery={handleSelectUpholstery}
          />
        );
      case 'assistance':
        return (
          <Assistance
            assistances={assistances}
            selectedAssistance={selectedAssistance}
            handleSelectAssistance={handleSelectAssistance}
          />
        );
      case 'comfort':
        return (
          <Comfort
            comforts={comforts}
            selectedComfort={selectedComfort}
            handleSelectComfort={handleSelectComfort}
          />
        );
      case 'pricing':
        return (
          <div>
            <Pricing totalPrice={totalPrice} />
          </div>
        );
      case 'review':
        return (
          <ConfigurationReview
            model={model}
            totalPrice={totalPrice}
            selectedColor={selectedColor}
            selectedRim={selectedRim}
            selectedEngine={selectedEngine}
            selectedTransmission={selectedTransmission}
            selectedUpholstery={selectedUpholstery}
            selectedAssistance={selectedAssistance}
            selectedComfort={selectedComfort}
            onEditSection={(category: string, subcategory: string) => {
              goToSection(category, subcategory);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.configuratorContainer}>
      {/* Top header with back button, model info and save button */}
      <div className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <button onClick={handleBack} className={styles.backButton}>
            <IoArrowBack />
            <span>Back</span>
          </button>
        </div>

        <div className={styles.headerCenter}>
          <h1 className={styles.modelName}>{model.name}</h1>
          <div className={styles.modelSubtitle}>{model.type}</div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.priceWrapper}>
            <div className={styles.priceDetail}>
              <div className={styles.priceLabel}>Total Price</div>
              <div className={styles.priceValue}>{totalPrice.toLocaleString()} €</div>
            </div>

            <div className={styles.priceDivider}></div>

            <div className={styles.priceDetail}>
              <div className={styles.priceLabel}>
                Monthly Leasing
                <button
                  className={styles.infoButton}
                  onClick={openLeasingModal}
                  aria-label="View leasing options"
                >
                  <span className={styles.infoIconWrapper}>
                    <BsInfoCircleFill />
                  </span>
                </button>
              </div>
              <div className={styles.priceValue}>
                300,36 €
                <span className={styles.leaseTerms}>/mo.</span>
              </div>
            </div>
          </div>

          <LeasingModal
            isOpen={isLeasingModalOpen}
            onClose={closeLeasingModal}
            basePrice={totalPrice}
          />

          <button className={styles.saveButton}>
            <BsBookmark />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Main content with sidebar and viewer */}
      <div className={styles.mainContent}>
        {/* Left sidebar navigation */}
        <div className={styles.sidebar}>
          <nav className={styles.categoryNav}>
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={styles.categoryGroup}
              >
                <div
                  className={`${styles.categoryItem} ${activeCategory === category.id ? styles.active : ''}`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className={styles.categoryIcon}>
                    {getCategoryIcon(category.id)}
                  </div>
                  <span className={styles.categoryLabel}>{category.label}</span>
                  <div className={styles.categoryStatus}>
                    {category.subcategories.some(sub => completedSteps[sub.id]) && (
                      <IoCheckmarkCircle className={styles.completedIcon} />
                    )}
                  </div>
                </div>

                {activeCategory === category.id && (
                  <div className={styles.subcategoryList}>
                    {category.subcategories.map((subcategory, idx) => (
                      <div
                        key={subcategory.id}
                        className={`${styles.subcategoryItem} ${activeSubcategory === subcategory.id ? styles.active : ''}`}
                        onClick={() => setActiveSubcategory(subcategory.id)}
                        style={{ "--animation-order": idx } as React.CSSProperties}
                      >
                        <div className={styles.subcategoryStatus}>
                          {completedSteps[subcategory.id] ? (
                            <FaCircle className={styles.stepComplete} />
                          ) : (
                            <FaRegCircle className={styles.stepIncomplete} />
                          )}
                        </div>
                        <span>{subcategory.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Progress indicator */}
          <div className={styles.configProgress}>
            <div className={styles.progressHeader}>
              <span className={styles.progressTitle}>Configuration Progress</span>
              <span className={styles.progressValue}>{calculateProgress()}%</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>

          {/* Sidebar footer */}
          <div className={styles.sidebarFooter}>
            <div className={styles.brandLogo}>
              <img src={Logo} alt="Logo" />
            </div>
            <div className={styles.brandTagline}>Premium Vehicle Configuration</div>
          </div>
        </div>

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
            {renderActiveContent()}

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
                  <MdKeyboardArrowRight
                    size={24}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configurator;