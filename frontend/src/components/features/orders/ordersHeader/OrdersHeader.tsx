import { FaArrowLeft, FaUser } from 'react-icons/fa';
import styles from './OrdersHeader.module.css';

interface OrdersHeaderProps {
  isAuthenticated: boolean;
  firstName?: string;
  lastName?: string;
  onBackClick: () => void;
  onLogout: () => void;
}

const OrdersHeader = ({ isAuthenticated, firstName, lastName, onBackClick, onLogout }: OrdersHeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <button className={styles.backButton} onClick={onBackClick}>
          <FaArrowLeft />
          <span>Back</span>
        </button>
        <h1 className={styles.title}>My Orders</h1>

        {isAuthenticated && firstName && lastName && (
          <div className={styles.userInfo}>
            <FaUser />
            <span>{firstName} {lastName}</span>
            <button className={styles.logoutButton} onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default OrdersHeader;