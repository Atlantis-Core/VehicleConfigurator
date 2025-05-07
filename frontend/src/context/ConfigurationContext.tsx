import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { getColors, getEngines, getModels, getRims, getTransmissions, getFeatures, getInteriors } from '@api/getter';
import { Color, Engine, Model, Rim, Transmission, Feature, Interior } from '../types/types';

interface ConfigurationContextType {
  // Model data
  model: Model | undefined;
  rims: Rim[];
  colors: Color[];
  engines: Engine[];
  transmissions: Transmission[];
  upholsteries: Interior[];
  assistances: Feature[];
  comforts: Feature[];
  
  // Selected options
  selectedColor: Color | undefined;
  selectedRim: Rim | undefined;
  selectedEngine: Engine | undefined;
  selectedTransmission: Transmission | undefined;
  selectedUpholstery: Interior | undefined;
  selectedAssistance: Feature[];
  selectedComfort: Feature[];
  
  // Actions
  setSelectedColor: (color: Color) => void;
  setSelectedRim: (rim: Rim) => void;
  setSelectedEngine: (engine: Engine) => void;
  setSelectedTransmission: (transmission: Transmission) => void;
  setSelectedUpholstery: (upholstery: Interior) => void;
  toggleAssistance: (assistance: Feature | null) => void;
  toggleComfort: (comfort: Feature | null) => void;
  
  // Computed values
  totalPrice: number;
  
  // Fetch data
  loadModelData: (modelId: string) => Promise<void>;
}

const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);

export const useConfiguration = () => {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error('useConfiguration must be used within a ConfigurationProvider');
  }
  return context;
};

export const ConfigurationProvider = ({ children }: { children: ReactNode }) => {
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
  const [selectedAssistance, setSelectedAssistance] = useState<Feature[]>([]);
  const [selectedComfort, setSelectedComfort] = useState<Feature[]>([]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    return (
      (model?.basePrice || 0) +
      (selectedColor?.additionalPrice || 0) +
      (selectedRim?.additionalPrice || 0) +
      (selectedEngine?.additionalPrice || 0) +
      (selectedUpholstery?.additionalPrice || 0) +
      selectedAssistance.reduce((sum, item) => sum + (item?.additionalPrice || 0), 0) +
      selectedComfort.reduce((sum, item) => sum + (item?.additionalPrice || 0), 0)
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

  const toggleAssistance = (assistance: Feature | null) => {
    if (assistance === null) {
      setSelectedAssistance([]);
    } else {
      if (selectedAssistance.some(item => item.id === assistance.id)) {
        setSelectedAssistance(selectedAssistance.filter(item => item.id !== assistance.id));
      } else {
        setSelectedAssistance([...selectedAssistance, assistance]);
      }
    }
  };

  const toggleComfort = (comfort: Feature | null) => {
    if (comfort === null) {
      setSelectedComfort([]);
    } else {
      if (selectedComfort.some(item => item.id === comfort.id)) {
        setSelectedComfort(selectedComfort.filter(item => item.id !== comfort.id));
      } else {
        setSelectedComfort([...selectedComfort, comfort]);
      }
    }
  };

  const loadModelData = async (modelId: string) => {
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
  };

  const value = {
    model,
    rims,
    colors,
    engines,
    transmissions,
    upholsteries,
    assistances,
    comforts,
    selectedColor,
    selectedRim,
    selectedEngine,
    selectedTransmission,
    selectedUpholstery,
    selectedAssistance,
    selectedComfort,
    setSelectedColor,
    setSelectedRim,
    setSelectedEngine,
    setSelectedTransmission, 
    setSelectedUpholstery,
    toggleAssistance,
    toggleComfort,
    totalPrice,
    loadModelData
  };

  return (
    <ConfigurationContext.Provider value={value}>
      {children}
    </ConfigurationContext.Provider>
  );
};