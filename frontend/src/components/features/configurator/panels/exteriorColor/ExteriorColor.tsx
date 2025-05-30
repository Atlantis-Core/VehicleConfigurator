import React from 'react';
import styles from './ExteriorColor.module.css';
import { Color } from '../../../types/types';

interface ExteriorColorProps {
  colors: Color[];
  selectedColor?: Color;
  onSelectColor: (color: Color) => void;
}

const ExteriorColor: React.FC<ExteriorColorProps> = ({ colors, selectedColor, onSelectColor }) => {
  const colorTypes = ['glossy', 'metallic', 'matte'];

  return (
    <div className={styles.categoryContent}>
      <h3>Exterior Color</h3>
      {colorTypes.map((colorType) => {
        const colorsOfType = colors.filter((color) => color.type === colorType);
        if (colorsOfType.length === 0) return null;

        return (
          <div key={colorType} className={styles.colorTypeSection}>
            <h4 className={styles.colorTypeHeading}>{colorType}</h4>
            <div className={styles.colorOptions}>
              {colorsOfType.map((color) => (
                <div
                  key={color.id}
                  className={`${styles.colorOption} ${selectedColor?.id === color.id ? styles.selected : ''}`}
                  onClick={() => onSelectColor(color)}
                >
                  <div
                    className={`${styles.colorSwatch} ${styles[color.type.toLowerCase()]}`}
                    style={{ backgroundColor: color.hexCode || color.name }}
                  ></div>
                  <span className={styles.colorName}>{color.name}</span>
                  <div className={styles.colorDetails}>
                    <span className={styles.colorType}>{color.type}</span>
                    {color.additionalPrice > 0 && (
                      <span className={styles.colorPrice}>+{color.additionalPrice.toLocaleString()} €</span>
                    )}
                    {color.additionalPrice === 0 && (
                      <span className={styles.colorIncluded}>Included</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExteriorColor;