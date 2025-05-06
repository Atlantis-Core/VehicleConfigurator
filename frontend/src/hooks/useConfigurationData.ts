import { useState, useEffect } from 'react';
import { getColors, getEngines, getModels, getRims, getTransmissions, getFeatures, getInteriors } from '@api/getter';
import { Color, Engine, Model, Rim, Transmission, Feature, Interior } from '../types/types';

export function useConfigurationData(modelId: string | undefined) {
  // State variables for data
  const [model, setModel] = useState<Model>();
  const [rims, setRims] = useState<Rim[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [engines, setEngines] = useState<Engine[]>([]);
  const [transmissions, setTransmissions] = useState<Transmission[]>([]);
  const [upholsteries, setUpholsteries] = useState<Interior[]>([]);
  const [assistances, setAssistances] = useState<Feature[]>([]);
  const [comforts, setComforts] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
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
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading config data:', err);
        setIsLoading(false);
      }
    }

    loadData();
  }, [modelId]);
  
  return {
    model, rims, colors, engines, transmissions, upholsteries, 
    assistances, comforts, isLoading
  };
}