import { MdClose } from "react-icons/md";
import styles from "./ConfiguratorMobileSidebarHeader.module.css";
import React from "react";

interface ConfiguratorMobileSidebarHeaderProps {
  closeSidebar: () => void;
}

const ConfiguratorMobileSidebarHeader: React.FC<ConfiguratorMobileSidebarHeaderProps> = ({ closeSidebar }) => {

  return (
    <div className={styles.mobileSidebarHeader}>
      <h3>Configuration Steps</h3>
      <button
        className={styles.mobileSidebarClose}
        onClick={closeSidebar}
      >
        <MdClose size={24} />
      </button>
    </div>
  );
};

export default ConfiguratorMobileSidebarHeader;