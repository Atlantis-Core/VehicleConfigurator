import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getModels, getRims } from '@api/api';
import VehicleViewer from '@components/3DCarModel/VehicleViewer';
import styles from './Configurator.module.css';
import { IoArrowBack } from "react-icons/io5";
import { BsBookmark } from "react-icons/bs";
import { IoRefreshOutline } from "react-icons/io5";
import { Rim } from '../../types/types';

function Configurator() {
  const { modelId } = useParams();
  const navigate = useNavigate();
  const [model, setModel] = useState<any>(null);
  const [rims, setRims] = useState<Rim[]>([]);
  const [selectedColor, setSelectedColor] = useState('red');
  const [selectedRim, setSelectedRim] = useState<Number>(-1);
  const [activeCategory, setActiveCategory] = useState('Exterior');

  // Demo data
  const colors = [
    { id: 1, name: 'Ruby Red', value: '#b30000' },
    { id: 2, name: 'Obsidian Black', value: '#000000' },
    { id: 3, name: 'Silver Arrow', value: '#C0C0C0' },
    { id: 4, name: 'Alpine White', value: '#FFFFFF' },
    { id: 5, name: 'Ocean Blue', value: '#0047AB' },
  ];
  
  const packages = [
    { id: 1, name: 'Sport', price: '$2,500', features: ['Sport Suspension', 'Performance Exhaust', 'Sport Steering Wheel'] },
    { id: 2, name: 'Comfort', price: '$1,800', features: ['Heated Seats', 'Premium Sound System', 'Ambient Lighting'] },
    { id: 3, name: 'Technology', price: '$3,200', features: ['360° Camera', 'Head-up Display', 'Adaptive Cruise Control'] },
  ];

  const categories = [
    'Engine', 'Variants', 'Styles', 'Packages', 'Exterior', 'Interior', 
    'Multimedia', 'Assistance Systems', 'Summary'
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const [models, r] = await Promise.all([
          getModels(), getRims(),
        ]);
        const found = models.find((m) => m.id === parseInt(modelId || ''));
        if (found) setModel(found);
        setRims(r);
        if (r.length > 0) setSelectedRim(r[0].id);
      } catch (err) {
        console.error('Error loading config data', err);
      }
    }
    loadData();
  }, [modelId]);

  const handleBack = () => {
    navigate('/configurator');
  };

  if (!model) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loader}></div>
      <p>Loading your configuration...</p>
    </div>
  );

  const renderActiveCategoryContent = () => {
    switch (activeCategory) {
      case 'Exterior':
        return (
          <div className={styles.categoryContent}>
            <h3>Exterior Color</h3>
            <div className={styles.colorOptions}>
              {colors.map((color) => (
                <div 
                  key={color.id}
                  className={`${styles.colorOption} ${selectedColor === color.value ? styles.selected : ''}`}
                  onClick={() => setSelectedColor(color.value)}
                >
                  <div 
                    className={styles.colorSwatch} 
                    style={{ backgroundColor: color.value }}
                  ></div>
                  <span className={styles.colorName}>{color.name}</span>
                </div>
              ))}
            </div>

            <h3>Wheels</h3>
            <div className={styles.rimOptions}>
              {rims.map((rim) => (
                <div 
                  key={rim.id}
                  className={`${styles.rimOption} ${selectedRim === rim.id ? styles.selected : ''}`}
                  onClick={() => setSelectedRim(rim.id)}
                >
                  <div className={styles.rimImage}>
                    <img src={rim.imagePath || '/placeholder-rim.png'} alt={rim.name} />
                  </div>
                  <div className={styles.rimInfo}>
                    <span className={styles.rimName}>{rim.name}</span>
                    <span className={styles.rimPrice}>+${rim?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Packages':
        return (
          <div className={styles.categoryContent}>
            <h3>Equipment Packages</h3>
            <div className={styles.packageOptions}>
              {packages.map((pkg) => (
                <div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className={styles.categoryContent}>
            <p>Please select options for {activeCategory}</p>
          </div>
        );
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
          <div className={styles.modelSubtitle}>{model.subtitle || 'Premium Vehicle'}</div>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.priceWrapper}>
            <div className={styles.priceDetail}>
              <div className={styles.priceLabel}>Base Price</div>
              <div className={styles.priceValue}>{model.price?.toLocaleString()} €</div>
            </div>
            
            <div className={styles.priceDivider}></div>
            
            <div className={styles.priceDetail}>
              <div className={styles.priceLabel}>Monthly Leasing</div>
              <div className={styles.priceValue}>
                300,36 €
                <span className={styles.leaseTerms}>/mo.</span>
              </div>
            </div>
          </div>
          
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
            {categories.map((category) => (
              <div 
                key={category} 
                className={`${styles.categoryItem} ${activeCategory === category ? styles.active : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </div>
            ))}
          </nav>
        </div>

        {/* Center car viewer area */}
        <div className={styles.viewerWrapper}>
          <div className={styles.viewer}>
            <VehicleViewer modelPath={model.model3dPath} color={selectedColor} />
            <div className={styles.rotateIndicator}>
              <IoRefreshOutline />
              360°
            </div>
          </div>
          
          {/* Bottom options panel */}
          <div className={styles.optionsPanel}>
            {renderActiveCategoryContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configurator;