import { useEffect, useState } from "react";
import styles from "./ModelPicker.module.css";
import { Model } from "../../types/types";
import { getModels } from "@api/api";
import LogoIcon from "@assets/logo.svg";
import { useNavigate } from "react-router-dom";
import ModelCard from "@components/modelCard";
import { motion } from "framer-motion";
import { getModelTypes } from "@lib/getModelTypes";

const ModelPicker = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [modelTypes, setModelTypes] = useState<String[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<String>('All');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const models = await getModels();
        setModels(models);

        const newModelTypes = await getModelTypes();
        setModelTypes(['All', ...newModelTypes]);
      } catch (error) {
        console.error("Failed to fetch models:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
          src={LogoIcon} 
          alt="Logo Icon"
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
        {modelTypes.map(type => (
          <button
            key={type.toString()}
            className={`${styles.filterButton} ${activeFilter === type ? styles.active : ''}`}
            onClick={() => setActiveFilter(type)}
          >
            {type}
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
          {models
            .filter((model) => activeFilter === 'All' || model.type === activeFilter)
            .map((model) => (
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
            ))
          }
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