import { useState } from 'react';
import { Color, Engine, Rim, Transmission, Feature, Interior } from '../types/types';
import { getCategories } from '@lib/getCategories';
import { getNextSubcategory } from '@lib/getNextSubcategory';

export function useConfiguration() {
  // Selected options
  const [selectedColor, setSelectedColor] = useState<Color>();
  const [selectedRim, setSelectedRim] = useState<Rim>();
  const [selectedEngine, setSelectedEngine] = useState<Engine>();
  const [selectedTransmission, setSelectedTransmission] = useState<Transmission>();
  const [selectedUpholstery, setSelectedUpholstery] = useState<Interior>();
  const [selectedAssistance, setSelectedAssistance] = useState<Feature[]>([]);
  const [selectedComfort, setSelectedComfort] = useState<Feature[]>([]);
  
  // Navigation state
  const [activeCategory, setActiveCategory] = useState<string>('motorization');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('engine');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const categories = getCategories();
  
  // Calculate progress
  const calculateProgress = (): number => {
    const totalSteps = categories.reduce((acc, cat) => acc + cat.subcategories.length, 0);
    const completedCount = Object.values(completedSteps).filter(Boolean).length;
    return Math.round((completedCount / totalSteps) * 100);
  };
  
  // Get next category
  const getNextCategory = () => {
    return getNextSubcategory(categories, activeCategory, activeSubcategory);
  };
  
  // Go to next category
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
      if (subcategoryId === 'assistance' || subcategoryId === 'comfort' || 
          subcategoryId === 'pricing' || subcategoryId === 'review') {
        setCompletedSteps(prev => ({ ...prev, [subcategoryId]: true }));
      }
    }
  };

  // Selection handlers
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
  };
  
  const handleSelectTransmission = (transmission: Transmission) => {
    setSelectedTransmission(transmission);
    setCompletedSteps(prev => ({ ...prev, 'transmission': true }));
  }

  const handleSelectUpholstery = (upholstery: Interior) => {
    setSelectedUpholstery(upholstery);
    setCompletedSteps(prev => ({ ...prev, 'upholstery': true }));
  };

  const handleSelectAssistance = (assistance: Feature | null) => {
    if (assistance === null) {
      setSelectedAssistance([]);
    } else if (assistance !== null) {
      if (selectedAssistance.length > 0 && selectedAssistance.some(item => item.id === assistance.id)) {
        setSelectedAssistance(selectedAssistance.filter(item => item.id !== assistance.id));
      } else {
        setSelectedAssistance([...selectedAssistance, assistance]);
      }
    }
    setCompletedSteps(prev => ({ ...prev, 'assistance': true }));
  };

  const handleSelectComfort = (comfort: Feature | null) => {
    if (comfort === null) {
      setSelectedComfort([]);
    } else if (comfort !== null) {
      if (selectedComfort.length > 0 && selectedComfort.some(item => item.id === comfort.id)) {
        setSelectedComfort(selectedComfort.filter(item => item.id !== comfort.id));
      } else {
        setSelectedComfort([...selectedComfort, comfort]);
      }
    }
    setCompletedSteps(prev => ({ ...prev, 'comfort': true }));
  };
  
  const goToSection = (category: string, subcategory: string) => {
    setActiveCategory(category);
    setActiveSubcategory(subcategory);
  };
  
  // Return all the config state and handlers
  return {
    // Selected options
    selectedColor, selectedRim, selectedEngine, selectedTransmission,
    selectedUpholstery, selectedAssistance, selectedComfort,
    
    // Handlers
    handleColorSelect, handleRimSelect, handleSelectEngine,
    handleSelectTransmission, handleSelectUpholstery,
    handleSelectAssistance, handleSelectComfort,
    
    // Navigation
    activeCategory, activeSubcategory, completedSteps,
    handleCategoryClick, handleNextClick, goToSection,
    
    // Progress
    calculateProgress, getNextCategory, categories, setCompletedSteps
  };
}