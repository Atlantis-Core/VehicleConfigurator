import React from 'react';
import { FaCar, FaPaintBrush, FaChair, FaCogs, FaStar, FaRegCircle, FaCircle } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import styles from './ConfiguratorSidebar.module.css';
import Logo from "@assets/logo.svg";

interface Category {
  id: string;
  label: string;
  subcategories: {
    id: string;
    label: string;
  }[];
}

interface ConfiguratorSidebarProps {
  categories: Category[];
  activeCategory: string;
  activeSubcategory: string;
  completedSteps: Record<string, boolean>;
  calculateProgress: () => number;
  onCategoryClick: (categoryId: string) => void;
  onSubcategoryClick: (subcategoryId: string) => void;
}

const ConfiguratorSidebar: React.FC<ConfiguratorSidebarProps> = ({
  categories,
  activeCategory,
  activeSubcategory,
  completedSteps,
  calculateProgress,
  onCategoryClick,
  onSubcategoryClick
}) => {

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

  return (
    <div className={styles.sidebar}>
      <nav className={styles.categoryNav}>
        {categories.map((category) => (
          <div
            key={category.id}
            className={styles.categoryGroup}
          >
            <div
              className={`${styles.categoryItem} ${activeCategory === category.id ? styles.active : ''}`}
              onClick={() => onCategoryClick(category.id)}
            >
              <div className={styles.categoryIcon}>
                {getCategoryIcon(category.id)}
              </div>
              <span className={styles.categoryLabel}>{category.label}</span>
              <div className={styles.categoryStatus}>
                {category.subcategories.every(sub => completedSteps[sub.id]) && (
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
                    onClick={() => onSubcategoryClick(subcategory.id)}
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

      <div className={styles.sidebarFooter}>
        <div className={styles.brandLogo}>
          <img src={Logo} alt="Logo" />
        </div>
        <div className={styles.brandTagline}>Premium Vehicle Configuration</div>
      </div>
    </div>
  );
};

export default ConfiguratorSidebar;