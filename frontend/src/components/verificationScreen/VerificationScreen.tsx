import React from "react";
import styles from "./VerificationScreen.module.css";
import { Customer } from "../../types/types";

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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6"></path>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          Refresh Status
        </button>
      </div>
    </div>
  );
};

export default VerificationScreen;