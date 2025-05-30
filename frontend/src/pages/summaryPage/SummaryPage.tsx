import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './SummaryPage.module.css';
import { ConfigurationSummary, Customer, Order } from '../../types/types';
import { IoArrowBack } from "react-icons/io5";
import Logo from "@assets/logo.svg";
import { findOrCreateCustomer, saveConfiguration, submitOrder } from '@api/setter';
import { useEmailVerification } from '@hooks/useEmailVerification';
import { useLeasing } from '@hooks/useLeasing';
import { toast } from 'react-toastify';
import { getLocalCustomer } from '@hooks/useLocalCustomer';
import VerificationScreen from '@components/features/verificationScreen';
import SuccessScreen from '@components/features/successScreen';
import ConfigurationSummaryCard from '@components/features/configurator/configurationSummaryCard';
import PaymentSection from '@components/features/paymentSection';
import ContactForm from '@components/features/forms/contactForm';

interface SummaryPageProps { }

const createFinancingDetails = (
  paymentMethod: string,
  selectedOption: number | null,
  leasingOptions: any[],
  getMonthlyPaymentFor: (months: number) => number,
  totalPrice: number
) => {
  if (paymentMethod !== 'financing' || !selectedOption) return null;

  const selectedFinancingOption = leasingOptions.find(option => option.months === selectedOption);
  if (!selectedFinancingOption) return null;

  return {
    months: selectedFinancingOption.months,
    rate: selectedFinancingOption.rate,
    monthlyPayment: getMonthlyPaymentFor(selectedOption),
    totalAmount: totalPrice,
    label: selectedFinancingOption.label
  };
};

const SummaryPage: React.FC<SummaryPageProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [configuration, setConfiguration] = useState<ConfigurationSummary | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [contactInfo, setContactInfo] = useState<Customer>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    emailVerified: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [orderId, setOrderId] = useState("-");

  // email
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const isVerified = useEmailVerification(contactInfo.email, awaitingVerification);

  useEffect(() => {
    // Initialize contact info from local storage or default values
    const storedCustomer = getLocalCustomer();

    if (storedCustomer) {
      setContactInfo({
        ...contactInfo,
        id: storedCustomer.id || 0,
        firstName: storedCustomer.firstName || '',
        lastName: storedCustomer.lastName || '',
        email: storedCustomer.email || '',
      });
    }
  }, []);

  useEffect(() => {
    // Get configuration data from location state
    if (location.state && location.state.configuration) {
      setConfiguration(location.state.configuration);
    } else {
      navigate('/configurator');
    }
  }, [location, navigate]);

  const {
    leasingOptions,
    selectedOption,
    selectLeasingOption,
    getMonthlyPaymentFor
  } = useLeasing(configuration?.totalPrice || 0);

  const saveOrderDetails = async (customerId: number): Promise<string> => {
    if (!configuration) {
      throw new Error("Configuration is missing");
    }

    const configId = await saveConfiguration(configuration, customerId);

    const financingDetails = createFinancingDetails(
      paymentMethod,
      selectedOption,
      leasingOptions,
      getMonthlyPaymentFor,
      configuration.totalPrice
    );

    const orderInformation: Order = {
      id: "", // handled in backend
      customerId: customerId,
      configurationId: configId,
      paymentOption: paymentMethod,
      financing: financingDetails ? JSON.stringify(financingDetails) : null,
      orderDate: "" // handled in backend
    };

    const order = await submitOrder(orderInformation);
    console.log("Order created successfully:", order);
    return order.id;
  };

  useEffect(() => {
    if (isVerified && configuration && contactInfo.id) {
      saveOrderDetails(contactInfo.id)
        .then((newOrderId) => {
          setOrderId(newOrderId);
          setIsComplete(true);
          setAwaitingVerification(false);
        })
        .catch(error => {
          console.error("Error saving order details:", error);
          toast.error(error.message || "Failed to save your order. Please try again.");
          setAwaitingVerification(false);
        });
    }
  }, [isVerified, configuration, contactInfo.id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const customer = await findOrCreateCustomer(contactInfo);
      setContactInfo(prev => ({ ...prev, id: customer.id }));

      if (!customer.emailVerified) {
        // If email needs verification, wait for that process
        setAwaitingVerification(true);
      } else {
        // If already verified, proceed with order
        const newOrderId = await saveOrderDetails(customer.id);
        setOrderId(newOrderId);
        setIsComplete(true);
      }
    } catch (error) {
      console.error('Error during order process:', error);
      toast.error('Order process could not be completed.')
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!configuration) {
    return <div className={styles.loading}>Loading your configuration...</div>;
  }

  if (awaitingVerification) {
    return (
      <VerificationScreen
        contactInfo={contactInfo}
        onRefresh={() => {
          const checkAgain = !awaitingVerification;
          setAwaitingVerification(checkAgain);
          setTimeout(() => setAwaitingVerification(true), 100);
        }}
      />
    );
  }

  if (isComplete) {
    return (
      configuration &&
      <SuccessScreen
        contactInfo={contactInfo}
        configuration={configuration}
        orderId={orderId}
        onNavigateHome={() => navigate('/')}
      />
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          <IoArrowBack />
          <span>Back to Configurator</span>
        </button>
        <div className={styles.logo}>
          <img src={Logo} alt="Logo" />
        </div>
      </header>

      <main className={styles.content}>
        <h1 className={styles.title}>Order Summary</h1>

        <ConfigurationSummaryCard
          configuration={configuration}
        />


        <PaymentSection
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          leasingOptions={leasingOptions}
          selectedOption={selectedOption}
          onSelectLeasingOption={selectLeasingOption}
          getMonthlyPaymentFor={getMonthlyPaymentFor}
        />

        <ContactForm
          contactInfo={contactInfo}
          onContactInfoChange={setContactInfo}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </main>
    </div>
  );
}

export default SummaryPage;