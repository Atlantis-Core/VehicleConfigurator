import React from 'react';
import { MdMenu, MdSettings, MdVisibility } from 'react-icons/md';
import styles from './ConfiguratorMobileHeader.module.css';

interface ConfiguratorMobileHeaderProps {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  getCurrentStepInfo: () => { categoryLabel: string; subcategoryLabel: string };
  calculateProgress: () => number;
  activeView: 'viewer' | 'options';
  setActiveView: (view: 'viewer' | 'options') => void;
}

const ConfiguratorMobileHeader: React.FC<ConfiguratorMobileHeaderProps> = ({
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  getCurrentStepInfo,
  calculateProgress,
  activeView,
  setActiveView
}) => {
  const stepInfo = getCurrentStepInfo();

  return (
    <div className={styles.mobileHeader}>
      <div className={styles.mobileHeaderTop}>
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          aria-label="Toggle configuration menu"
        >
          <MdMenu size={24} />
        </button>

        <div className={styles.mobileStepInfo}>
          <div className={styles.mobileStepTitle}>
            {stepInfo.categoryLabel}
          </div>
          <div className={styles.mobileStepSubtitle}>
            {stepInfo.subcategoryLabel}
          </div>
        </div>

        <button
          className={styles.mobileProgressButton}
          aria-label="Toggle progress view"
        >
          <MdSettings size={20} />
          <span className={styles.progressBadge}>{calculateProgress()}%</span>
        </button>
      </div>

      <div className={styles.mobileProgressContainer}>
        <div className={styles.mobileProgressBar}>
          <div
            className={styles.mobileProgressFill}
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>
      </div>

      <div className={styles.mobileViewToggle}>
        <button
          className={`${styles.viewToggleButton} ${activeView === 'viewer' ? styles.active : ''}`}
          onClick={() => setActiveView('viewer')}
        >
          <MdVisibility size={18} />
          <span>3D View</span>
        </button>
        <button
          className={`${styles.viewToggleButton} ${activeView === 'options' ? styles.active : ''}`}
          onClick={() => setActiveView('options')}
        >
          <MdSettings size={18} />
          <span>Options</span>
        </button>
      </div>
    </div>
  );
};

export default ConfiguratorMobileHeader;