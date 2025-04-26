import styles from "./StartPage.module.css"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const StartPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
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
    </div>
  );
};

export default StartPage;