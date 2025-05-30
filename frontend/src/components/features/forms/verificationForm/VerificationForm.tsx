import styles from './VerificationForm.module.css';

interface VerificationFormProps {
  email: string;
  verificationCode: string;
  isLoading: boolean;
  onSubmit: (code: string) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const VerificationForm = ({ email, verificationCode, isLoading, onSubmit, onChange }: VerificationFormProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(verificationCode);
  };

  return (
    <div className={styles.authSection}>
      <div className={styles.authCard}>
        <h2>Verify Your Email</h2>
        <p>We've sent a verification code to <strong>{email}</strong></p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="verificationCode">Verification Code</label>
            <input
              id="verificationCode"
              type="text"
              name="verificationCode"
              value={verificationCode}
              onChange={onChange}
              required
              placeholder="Enter verification code"
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerificationForm;