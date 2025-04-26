import styles from "./StartPage.module.css"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MercedesLogo from "../../assets/icons/mercedes_star.svg";

const StartPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const handleConfigureClick = () => {
    navigate('/configure');
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={`${styles.textGroup} ${isVisible ? styles.visible : ''}`}>
          <h1 className={styles.title}>Design Perfection.</h1>
          <h2 className={styles.subTitle}>Configure Yours.</h2>
          <div className={styles.designLine}></div>
        </div>

        <button
          className={`${styles.configureButton} ${isVisible ? styles.visible : ''}`}
          onClick={handleConfigureClick}
          aria-label="Start vehicle configuration"
        >
          <span className={styles.buttonText}>Configure Now</span>
          <span className={styles.buttonIcon}>→</span>
        </button>
      </div>
      
      <footer className={styles.footer}>
        <div className={styles.copyright}>
          © {new Date().getFullYear()} Softwarequalität & React
        </div>
        <div className={styles.createdBy}>
          Created by David Pospisil (AIN 6 SE)
        </div>
        <div className={styles.brandIcon}>
          <img src={MercedesLogo} alt="mercedes star" className={styles.mercedesIcon}/>
        </div>
      </footer>
    </div>
  );
};

export default StartPage;