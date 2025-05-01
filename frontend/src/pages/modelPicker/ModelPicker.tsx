import { useEffect, useState } from "react";
import styles from "./ModelPicker.module.css";
import { Model } from "../../types/types";
import { getModels } from "@api/api";
import MercedesIcon from "../../assets/icons/mercedes_star.svg";
import { useNavigate } from "react-router-dom";
import ModelCard from "@components/modelCard";
import { motion } from "framer-motion";

const ModelPicker = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchModels = async () => {
      setIsLoading(true);
      try {
        const data = await getModels();
        setModels(data);
      } catch (error) {
        console.error("Failed to fetch models:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, []);

  const handleSelectModel = (model: Model) => {
    setSelectedModel(model);
    // Smooth scroll to the continue button
    setTimeout(() => {
      document.getElementById('selection-summary')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  const resetSelection = () => {
    setSelectedModel(null);
    setTimeout(() => {
      document.getElementById('heading-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img 
          src={MercedesIcon} 
          alt="Mercedes star"
          onClick={() => navigate("/")}
          className={styles.logoImage}
        />
      </header>

      <motion.div 
        className={styles.upperSection}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        id="heading-section"
      >
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLine}></span>
          <h1 className={styles.upperSectionTitle}>Available Models</h1>
          <span className={styles.sectionLine}></span>
        </div>
        <p className={styles.upperSectionSubTitle}>
          Explore our selection of premium vehicles and find the perfect model that matches your style and needs. 
          Each vehicle can be customized to your exact specifications.
        </p>
      </motion.div>

      <div className={styles.filterControls}>
        {['All', 'Sedan', 'SUV', 'Electric', 'AMG'].map(filter => (
          <button 
            key={filter}
            className={`${styles.filterButton} ${activeFilter === filter ? styles.active : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Discovering premium vehicles for you...</p>
        </div>
      ) : (
        <motion.div 
          className={styles.modelCards}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {models.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.cardWrapper}
            >
              <ModelCard 
                model={model}
                onSelect={handleSelectModel}
                isSelected={selectedModel?.id === model.id}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {selectedModel && (
        <motion.div 
          className={styles.selectionSummary}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          id="selection-summary"
        >
          <div className={styles.summaryContent}>
            <h3>Your Selection</h3>
            <p className={styles.selectedModelName}>{selectedModel.name}</p>
            <button 
              className={styles.continueButton}
              onClick={() => navigate(`/configurator/${selectedModel.id}`)}
            >
              Continue Configuration
              <span className={styles.buttonArrow}>→</span>
            </button>
          </div>
          <button 
            className={styles.clearButton} 
            onClick={resetSelection}
          >
            Change Model
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ModelPicker;