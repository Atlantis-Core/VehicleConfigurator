import styles from "./ConfiguratorMobileHeader.module.css";
import { MdClose, MdMenu, MdSettings, MdVisibility } from 'react-icons/md';

interface ConfiguratorMobileHeaderProps {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  getCurrentStepInfo: () => {
    categoryLabel: string;
    subcategoryLabel: string;
  };
  calculateProgress: () => number;
  activeView: 'viewer' | 'options';
  setActiveView: (view: 'viewer' | 'options') => void;
}

const ConfiguratorMobileHeader = ({
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  getCurrentStepInfo,
  calculateProgress,
  activeView,
  setActiveView
}: ConfiguratorMobileHeaderProps) => {

  return (
    <div className={styles.mobileHeader}>
      <div className={styles.mobileHeaderTop}>
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileSidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>

        <div className={styles.mobileStepInfo}>
          <div className={styles.mobileStepTitle}>
            {getCurrentStepInfo().subcategoryLabel}
          </div>
          <div className={styles.mobileStepSubtitle}>
            {getCurrentStepInfo().categoryLabel}
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
          <span>Configure</span>
        </button>
      </div>
    </div>
  );
};

export default ConfiguratorMobileHeader;