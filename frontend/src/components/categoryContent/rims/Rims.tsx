import React from "react";
import { Rim } from "../../../types/types";
import styles from "./Rims.module.css"
import { getImageUrl } from "@lib/getImageUrl";
import { IoCheckmarkCircle } from "react-icons/io5";

interface RimsProps {
  rims: Rim[],
  selectedRim?: Rim,
  handleRimSelect: (rim: Rim) => void
}

const Rims: React.FC<RimsProps> = ({ rims, selectedRim, handleRimSelect }) => {

  return (
    <div className={styles.categoryContent}>
      <h3>Wheels & Rims</h3>
      <div className={styles.rimOptions}>
        {rims.map((rim) => (
          <div
            key={rim.id}
            className={`${styles.rimOption} ${selectedRim?.id === rim.id ? styles.selected : ''}`}
            onClick={() => handleRimSelect(rim)}
          >
            <div className={styles.rimImage}>
              <img src={getImageUrl(rim.imagePath)} alt={rim.name} />
            </div>
            <div className={styles.rimInfo}>
              <span className={styles.rimName}>{rim.name}</span>
              <span className={styles.rimPrice}>+{rim.additionalPrice?.toLocaleString()} €</span>
            </div>
            {selectedRim?.id === rim.id && (
              <div className={styles.selectedIndicator}>
                <IoCheckmarkCircle size={24} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rims;