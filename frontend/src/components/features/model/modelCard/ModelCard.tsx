import { useState } from "react";
import { getImageUrl } from "@lib/getImageUrl";
import { Model } from "../../../../types/types";
import styles from "./ModelCard.module.css";

interface ModelCardProps {
  model: Model;
  onSelect?: (model: Model) => void;
  isSelected?: boolean;
}

const ModelCard = ({ model, onSelect, isSelected = false }: ModelCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onSelect) {
      onSelect(model);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''} ${isHovered ? styles.hovered : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      data-testid="model-card"
    >
      <div className={styles.badge}>
        <span>New</span>
      </div>

      <div className={styles.content}>
        <h3 className={styles.modelName}>{model.name}</h3>

        <div className={styles.imageContainer}>
          <img
            src={getImageUrl(model.imagePath)}
            className={styles.modelImage}
            alt={`${model.name} model`}
          />
        </div>

        <div className={styles.priceSection}>
          <span className={styles.priceLabel}>Starting at</span>
          <span className={styles.basePrice}>{formatPrice(model.basePrice)}</span>
        </div>

        <button className={styles.selectButton}>
          {isSelected ? 'Selected' : 'Configure'}
        </button>
      </div>
    </div>
  );
};

export default ModelCard;