import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Orders.module.css';
import { findCustomerByEmail, verifyCustomer, verifyCustomerCode } from '@api/helper';
import { Customer, OrderWithDetails } from '../../types/types';
import { getLocalCustomer, removeLocalCustomer, saveLocalCustomer } from '@state/localStorage/useLocalCustomer';
import { getOrdersByCustomer } from '@api/getter';
import OrdersHeader from '@components/features/orders/ordersHeader';
import LoginForm from '@components/features/forms/loginForm';
import VerificationForm from '@components/features/forms/verificationForm';
import OrdersList from '@components/features/orders/ordersList';

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
      setOrders(result.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to retrieve orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelVerification = () => {
    removeLocalCustomer();
    setLoginStep('login');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      verificationCode: ''
    });

    toast.dismiss();
    toast.info('Verification cancelled. Please login again.');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginSubmit = async (loginData: { firstName: string; lastName: string; email: string }) => {
    setIsLoading(true);
    try {
      const { firstName, lastName, email } = loginData;
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

  const handleVerifySubmit = async (verificationCode: string) => {
    setIsLoading(true);
    try {
      const { email } = formData;
      const isVerified = await verifyCustomerCode(email, verificationCode);

      if (isVerified) {
        const customerSession = getLocalCustomer();
        if (customerSession) {
          customerSession.verified = true;
          saveLocalCustomer(customerSession);
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

  const handleBackClick = () => navigate('/configurator');
  const handleConfigureClick = () => navigate('/configurator');

  const renderContent = () => {
    switch (loginStep) {
      case 'login':
        return (
          <LoginForm
            formData={formData}
            isLoading={isLoading}
            onSubmit={handleLoginSubmit}
            onChange={handleChange}
          />
        );
      case 'verify':
        return (
          <VerificationForm
            email={formData.email}
            verificationCode={formData.verificationCode}
            isLoading={isLoading}
            onSubmit={handleVerifySubmit}
            onChange={handleChange}
            onCancel={handleCancelVerification}
          />
        );
      case 'verified':
        return (
          <div className={styles.ordersSection}>
            <OrdersList
              orders={orders}
              isLoading={isLoading}
              onConfigureClick={handleConfigureClick}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <OrdersHeader
        isAuthenticated={loginStep === 'verified'}
        firstName={formData.firstName}
        lastName={formData.lastName}
        onBackClick={handleBackClick}
        onLogout={handleLogout}
      />

      <main className={styles.content}>
        {renderContent()}
      </main>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Orders;