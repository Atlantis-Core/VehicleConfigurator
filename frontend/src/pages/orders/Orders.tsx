import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaFileAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Orders.module.css';
import { findCustomerByEmail, verifyCustomer, verifyCustomerCode } from '@api/helper';
import { Customer, OrderWithDetails } from '../../types/types';
import { getLocalCustomer, removeLocalCustomer, saveLocalCustomer } from '@hooks/useLocalCustomer';
import { getOrdersByCustomer } from '@api/getter';
import OrderCard from '@components/features/orders/orderCard';

const Orders = () => {
  const navigate = useNavigate();
  const [loginStep, setLoginStep] = useState<'login' | 'verify' | 'verified'>('login');
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    verificationCode: ''
  });

  // Check if customer is already authenticated from localStorage
  useEffect(() => {
    const localCustomer = getLocalCustomer();
    if (localCustomer) {
      try {
        if (localCustomer.verified) {
          setLoginStep('verified');
          fetchOrders(localCustomer.id);
          setFormData({
            ...localCustomer,
            verificationCode: ''
          })
        } else {
          setFormData(prev => ({
            ...prev,
            firstName: localCustomer.firstName,
            lastName: localCustomer.lastName,
            email: localCustomer.email
          }));
          setLoginStep('verify');
        }
      } catch (error) {
        console.error('Error parsing customer session:', error);
        removeLocalCustomer();
      }
    }
  }, []);

  // Function to fetch orders
  const fetchOrders = async (customerId: number) => {
    setIsLoading(true);
    try {
      const result = await getOrdersByCustomer(customerId);
      // TODO: Unhandled pagination
      setOrders(result.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to retrieve orders');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle login form submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { firstName, lastName, email } = formData;
      const customer: Customer = await findCustomerByEmail(email);

      if (customer.firstName.trim().toLowerCase() === firstName.trim().toLowerCase() && 
          customer.lastName.trim().toLowerCase() === lastName.trim().toLowerCase()) {
        saveLocalCustomer({
          id: customer.id,
          firstName,
          lastName,
          email,
          verified: false
        })

        // Send verification code
        if (await verifyCustomer(email)) {
          toast.success('Verification code sent to your email');
          setLoginStep('verify');
        }
      } else {
        toast.error('Customer information does not match our records');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Failed to verify customer information');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verification code submission
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { email, verificationCode } = formData;

      const isVerified = await verifyCustomerCode(email, verificationCode);

      if (isVerified) {
        // Update customer session in localStorage

        const customerSession = getLocalCustomer();
        if (customerSession) {
          customerSession.verified = true;

          // update local customer
          saveLocalCustomer(customerSession);

          // Fetch orders
          fetchOrders(customerSession.id);
          setLoginStep('verified');
          toast.success('Email verified successfully!');
        }
      } else {
        toast.error('Invalid verification code');
      }
    } catch (error) {
      console.error('Error during verification:', error);
      toast.error('Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    removeLocalCustomer();
    setLoginStep('login');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      verificationCode: ''
    });
    setOrders([]);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button
            className={styles.backButton}
            onClick={() => navigate('/configurator')}
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>
          <h1 className={styles.title}>My Orders</h1>

          {loginStep === 'verified' && (
            <div className={styles.userInfo}>
              <FaUser />
              <span>{formData.firstName} {formData.lastName}</span>
              <button
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className={styles.content}>
        {loginStep === 'login' && (
          <div className={styles.authSection}>
            <div className={styles.authCard}>
              <h2>Access Your Orders</h2>
              <p>Please enter your information to view your orders</p>

              <form onSubmit={handleLoginSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
        )}

        {loginStep === 'verify' && (
          <div className={styles.authSection}>
            <div className={styles.authCard}>
              <h2>Verify Your Email</h2>
              <p>We've sent a verification code to <strong>{formData.email}</strong></p>

              <form onSubmit={handleVerifySubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="verificationCode">Verification Code</label>
                  <input
                    id="verificationCode"
                    type="text"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={handleChange}
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
        )}

        {loginStep === 'verified' && (
          <div className={styles.ordersSection}>
            {isLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.loader}></div>
                <p>Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className={styles.emptyState}>
                <FaFileAlt size={48} />
                <h2>No Orders Found</h2>
                <p>You haven't placed any orders yet</p>
                <button
                  className={styles.configureButton}
                  onClick={() => navigate('/configurator')}
                >
                  Configure a Vehicle
                </button>
              </div>
            ) : (
              <div className={styles.ordersList}>
                {orders.map(order => (
                  <OrderCard order={order} />
                ))}
              </div>
            )}
          </div>
        )
        }
      </main >

      <ToastContainer position="bottom-right" />
    </div >
  );
};

export default Orders;