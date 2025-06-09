import styles from './LoginForm.module.css';

interface LoginFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
  };
  isLoading: boolean;
  onSubmit: (data: { firstName: string; lastName: string; email: string }) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LoginForm = ({ formData, isLoading, onSubmit, onChange }: LoginFormProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className={styles.authSection}>
      <div className={styles.authCard}>
        <h2>Access Your Orders</h2>
        <p>Please enter your information to view your orders</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={onChange}
              required
              placeholder="Enter your first name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={onChange}
              required
              placeholder="Enter your last name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;