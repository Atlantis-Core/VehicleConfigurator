import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './SummaryPage.module.css';
import { ConfigurationSummary, Customer, Order } from '../../types/types';
import { IoArrowBack, IoCheckmarkCircle } from "react-icons/io5";
import { FaCreditCard, FaUniversity, FaHandHoldingUsd, FaFileContract } from 'react-icons/fa';
import Logo from "@assets/logo.svg";
import { findOrCreateCustomer, saveConfiguration, submitOrder } from '@api/setter';
import { useEmailVerification } from '@hooks/useEmailVerification';
import { useLeasing } from '@hooks/useLeasing';
import { toast } from 'react-toastify';
import { formatEuro } from '@utils/formatEuro';
import { getLocalCustomer } from '@hooks/useLocalCustomer';

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

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
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
      <div className={styles.container}>
        <div className={styles.verificationNotice}>
          <h2>Almost done!</h2>
          <p>Please verify your email to complete your order.</p>
          <p>We've sent a confirmation link to <strong>{contactInfo.email}</strong>.</p>

          <div className={styles.verificationProgress}>
            <div className={styles.progressBar}>
              <div className={styles.progressBarFill}></div>
            </div>
            <p>Waiting for verification...</p>
          </div>

          <p>If you don't receive the email within a few minutes, please check your spam folder or try refreshing.</p>

          <button
            className={styles.refreshButton}
            onClick={() => {
              // Force re-check of verification status
              const checkAgain = !awaitingVerification;
              setAwaitingVerification(checkAgain);
              setTimeout(() => setAwaitingVerification(true), 100);
            }}
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
  }

  if (isComplete) {
    return (
      <div className={styles.container}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <IoCheckmarkCircle />
          </div>
          <h1>Thank You for Your Order!</h1>
          <p>Congratulations, {contactInfo.firstName}! Your {configuration.model.name} has been configured successfully.</p>
          <p className={styles.confirmationDetails}>
            We've sent a detailed confirmation to <strong>{contactInfo.email}</strong> with all the specifications of your dream car.
          </p>
          <div className={styles.orderInfo}>
            <p>Order Number: <strong>CFG-{orderId}</strong></p>
          </div>
          <p className={styles.nextSteps}>
            A dealer representative will contact you within 24-48 hours to discuss delivery options and finalize your purchase.
          </p>
          <div className={styles.buttonGroup}>
            <button
              className={styles.homeButton}
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
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

        <div className={styles.summaryCard}>
          <h2>Your Configuration</h2>
          <div className={styles.modelInfo}>
            <h3>{configuration.model.name}</h3>
            <p className={styles.modelType}>{configuration.model.type}</p>
          </div>

          <div className={styles.configItems}>
            {configuration.selectedEngine && (
              <div className={styles.configItem}>
                <span className={styles.itemLabel}>Engine</span>
                <span className={styles.itemValue}>{configuration.selectedEngine.name}</span>
              </div>
            )}

            {configuration.selectedTransmission && (
              <div className={styles.configItem}>
                <span className={styles.itemLabel}>Transmission</span>
                <span className={styles.itemValue}>{configuration.selectedTransmission.name}</span>
              </div>
            )}

            {configuration.selectedColor && (
              <div className={styles.configItem}>
                <span className={styles.itemLabel}>Exterior Color</span>
                <div className={styles.colorValue}>
                  <span
                    className={styles.colorSwatch}
                    style={{ backgroundColor: configuration.selectedColor.hexCode }}
                  ></span>
                  <span>{configuration.selectedColor.name}</span>
                </div>
                <span className={styles.itemPrice}>+ {formatEuro(configuration.selectedColor.additionalPrice)}</span>
              </div>
            )}

            {configuration.selectedRim && (
              <div className={styles.configItem}>
                <span className={styles.itemLabel}>Rims</span>
                <span className={styles.itemValue}>{configuration.selectedRim.name}</span>
                <span className={styles.itemPrice}>+ {formatEuro(configuration.selectedRim.additionalPrice)}</span>
              </div>
            )}

            {configuration.selectedUpholstery && (
              <div className={styles.configItem}>
                <span className={styles.itemLabel}>Upholstery</span>
                <span className={styles.itemValue}>{configuration.selectedUpholstery.name}</span>
                <span className={styles.itemPrice}>+ {formatEuro(configuration.selectedUpholstery.additionalPrice)}</span>
              </div>
            )}

            {configuration.selectedAssistance && configuration.selectedAssistance.length > 0 && (
              <div className={styles.configItem}>
                <span className={styles.itemLabel}>Assistance Systems</span>
                <span className={styles.itemValue}>
                  <ul className={styles.featureList}>
                    {configuration.selectedAssistance.map((item, index) => (
                      <li key={index}>{item.name}</li>
                    ))}
                  </ul>
                </span>
                <span className={styles.itemPrice}>
                  + {formatEuro(configuration.selectedAssistance.reduce((sum, item) => sum + item.additionalPrice, 0))}
                </span>
              </div>
            )}

            {configuration.selectedComfort && configuration.selectedComfort.length > 0 && (
              <div className={styles.configItem}>
                <span className={styles.itemLabel}>Comfort Features</span>
                <span className={styles.itemValue}>
                  <ul className={styles.featureList}>
                    {configuration.selectedComfort.map((item, index) => (
                      <li key={index}>{item.name}</li>
                    ))}
                  </ul>
                </span>
                <span className={styles.itemPrice}>
                  + {formatEuro(configuration.selectedComfort.reduce((sum, item) => sum + item.additionalPrice, 0))}
                </span>
              </div>
            )}
          </div>

          <div className={styles.totalPrice}>
            <span className={styles.totalLabel}>Total Price</span>
            <span className={styles.totalValue}>{formatEuro(configuration.totalPrice)}</span>
          </div>
        </div>

        <div className={styles.paymentSection}>
          <h2>Payment Method</h2>
          <div className={styles.paymentOptions}>
            <div
              className={`${styles.paymentOption} ${paymentMethod === 'financing' ? styles.selected : ''}`}
              onClick={() => setPaymentMethod('financing')}
            >
              <FaFileContract className={styles.paymentIcon} />
              <span>Financing</span>
            </div>
            <div
              className={`${styles.paymentOption} ${paymentMethod === 'bank' ? styles.selected : ''}`}
              onClick={() => setPaymentMethod('bank')}
            >
              <FaUniversity className={styles.paymentIcon} />
              <span>Bank Transfer</span>
            </div>
            <div
              className={`${styles.paymentOption} ${paymentMethod === 'cash' ? styles.selected : ''}`}
              onClick={() => setPaymentMethod('cash')}
            >
              <FaHandHoldingUsd className={styles.paymentIcon} />
              <span>Cash</span>
            </div>
            <div
              className={`${styles.paymentOption} ${paymentMethod === 'card' ? styles.selected : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <FaCreditCard className={styles.paymentIcon} />
              <span>Credit Card</span>
            </div>
          </div>

          {paymentMethod === 'financing' && (
            <div className={styles.paymentDetails}>
              <h3>Financing Options</h3>
              <div className={styles.financingOptions}>
                {leasingOptions.map(option => (
                  <div key={option.months} className={styles.financingOption}>
                    <input
                      type="radio"
                      id={`option-${option.months}`}
                      name="financingOption"
                      checked={selectedOption === option.months}
                      onChange={() => selectLeasingOption(option.months)}
                    />
                    <label htmlFor={`option-${option.months}`}>
                      <span className={styles.term}>{option.months} months</span>
                      <span className={styles.rate}>{option.rate}</span>
                      <span className={styles.monthly}>
                        {formatEuro(getMonthlyPaymentFor(option.months))}/month
                      </span>
                    </label>
                  </div>
                ))}
              </div>
              <p className={styles.disclaimer}>
                Financing subject to credit approval. Rates may vary based on creditworthiness.
              </p>
            </div>
          )}

          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <h2>Contact Information</h2>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={contactInfo.firstName}
                  onChange={handleContactInfoChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={contactInfo.lastName}
                  onChange={handleContactInfoChange}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={contactInfo.email}
                onChange={handleContactInfoChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={contactInfo.phone}
                onChange={handleContactInfoChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address">Address *</label>
              <textarea
                id="address"
                name="address"
                required
                value={contactInfo.address}
                onChange={(e) =>
                  setContactInfo(prev => ({
                    ...prev,
                    address: e.target.value
                  }))
                }
                rows={3}
              />
            </div>

            <button
              className={styles.submitButton}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Complete Purchase'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default SummaryPage;