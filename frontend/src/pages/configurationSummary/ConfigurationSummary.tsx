import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ConfigurationSummary.module.css';
import { 
  Model, 
  Color, 
  Rim, 
  Engine, 
  Transmission, 
  Interior, 
  Feature 
} from '../../types/types';
import { IoArrowBack, IoCheckmarkCircle } from "react-icons/io5";
import { FaCreditCard, FaPaypal, FaApplePay, FaGooglePay } from 'react-icons/fa';
import Logo from "@assets/logo.svg";

interface ConfigurationSummaryProps {
  model: Model;
  selectedColor?: Color;
  selectedRim?: Rim;
  selectedEngine?: Engine;
  selectedTransmission?: Transmission;
  selectedUpholstery?: Interior;
  selectedAssistance?: Feature | null;
  selectedComfort?: Feature | null;
  totalPrice: number;
}

const ConfigurationSummary: React.FC<ConfigurationSummaryProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [configuration, setConfiguration] = useState<ConfigurationSummaryProps | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Get configuration data from location state
    if (location.state && location.state.configuration) {
      setConfiguration(location.state.configuration);
    } else {
      // Redirect back to configurator if no data is available
      navigate('/configurator');
    }
  }, [location, navigate]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      // In a real app, you'd send this data to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsComplete(true);
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!configuration) {
    return <div className={styles.loading}>Loading your configuration...</div>;
  }
  
  if (isComplete) {
    return (
      <div className={styles.container}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <IoCheckmarkCircle />
          </div>
          <h1>Your order has been placed!</h1>
          <p>Thank you for your purchase. We've sent a confirmation email to {contactInfo.email}.</p>
          <p>Your configuration ID: <strong>CFG-{Math.floor(Math.random() * 100000)}</strong></p>
          <button
            className={styles.homeButton} 
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
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
                <span className={styles.itemPrice}>+ {configuration.selectedEngine.additionalPrice.toLocaleString()} €</span>
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
                <span className={styles.itemPrice}>+ {configuration.selectedColor.additionalPrice.toLocaleString()} €</span>
              </div>
            )}
            
            {configuration.selectedRim && (
              <div className={styles.configItem}>
                <span className={styles.itemLabel}>Rims</span>
                <span className={styles.itemValue}>{configuration.selectedRim.name}</span>
                <span className={styles.itemPrice}>+ {configuration.selectedRim.additionalPrice.toLocaleString()} €</span>
              </div>
            )}
            
            {configuration.selectedUpholstery && (
              <div className={styles.configItem}>
                <span className={styles.itemLabel}>Upholstery</span>
                <span className={styles.itemValue}>{configuration.selectedUpholstery.name}</span>
                <span className={styles.itemPrice}>+ {configuration.selectedUpholstery.additionalPrice.toLocaleString()} €</span>
              </div>
            )}
            
            {configuration.selectedAssistance && (
              <div className={styles.configItem}>
                <span className={styles.itemLabel}>Assistance Package</span>
                <span className={styles.itemValue}>{configuration.selectedAssistance.name}</span>
                <span className={styles.itemPrice}>+ {configuration.selectedAssistance.additionalPrice.toLocaleString()} €</span>
              </div>
            )}
            
            {configuration.selectedComfort && (
              <div className={styles.configItem}>
                <span className={styles.itemLabel}>Comfort Package</span>
                <span className={styles.itemValue}>{configuration.selectedComfort.name}</span>
                <span className={styles.itemPrice}>+ {configuration.selectedComfort.additionalPrice.toLocaleString()} €</span>
              </div>
            )}
          </div>
          
          <div className={styles.totalPrice}>
            <span className={styles.totalLabel}>Total Price</span>
            <span className={styles.totalValue}>{configuration.totalPrice.toLocaleString()} €</span>
          </div>
        </div>
        
        <div className={styles.paymentSection}>
          <h2>Payment Method</h2>
          <div className={styles.paymentOptions}>
            <div 
              className={`${styles.paymentOption} ${paymentMethod === 'card' ? styles.selected : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <FaCreditCard className={styles.paymentIcon} />
              <span>Credit Card</span>
            </div>
            <div 
              className={`${styles.paymentOption} ${paymentMethod === 'paypal' ? styles.selected : ''}`}
              onClick={() => setPaymentMethod('paypal')}
            >
              <FaPaypal className={styles.paymentIcon} />
              <span>PayPal</span>
            </div>
            <div 
              className={`${styles.paymentOption} ${paymentMethod === 'applepay' ? styles.selected : ''}`}
              onClick={() => setPaymentMethod('applepay')}
            >
              <FaApplePay className={styles.paymentIcon} />
              <span>Apple Pay</span>
            </div>
            <div 
              className={`${styles.paymentOption} ${paymentMethod === 'googlepay' ? styles.selected : ''}`}
              onClick={() => setPaymentMethod('googlepay')}
            >
              <FaGooglePay className={styles.paymentIcon} />
              <span>Google Pay</span>
            </div>
          </div>
          
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <h2>Contact Information</h2>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name *</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                value={contactInfo.name} 
                onChange={handleContactInfoChange}
              />
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
              <label htmlFor="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={contactInfo.phone} 
                onChange={handleContactInfoChange}
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

export default ConfigurationSummary;