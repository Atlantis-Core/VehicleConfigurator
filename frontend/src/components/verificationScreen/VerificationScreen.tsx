import React from "react";
import styles from "./VerificationScreen.module.css";
import { Customer } from "../../types/types";
import { HiRefresh } from 'react-icons/hi';

interface VerificationScreenProps {
  contactInfo: Customer;
  onRefresh: () => void;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ contactInfo, onRefresh }) => {

  return (
    <div className={styles.container}>
      <div className={styles.verificationNotice}>
        <h2>Almost done!</h2>
        <p>Please verify your email to complete your order.</p>
        <p>We've sent a confirmation link to <br /><br /><strong>{contactInfo.email}</strong>.</p>

        <div className={styles.verificationProgress}>
          <div className={styles.progressBar}>
            <div className={styles.progressBarFill}></div>
          </div>
          <p>Waiting for verification...</p>
        </div>

        <p>If you don't receive the email within a few minutes, please check your spam folder or try refreshing.</p>

        <button
          className={styles.refreshButton}
          onClick={onRefresh}
        >
          <HiRefresh size={16} />
          Refresh Status
        </button>
      </div>
    </div>
  );
};

export default VerificationScreen;