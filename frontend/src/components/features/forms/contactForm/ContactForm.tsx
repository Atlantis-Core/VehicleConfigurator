import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import styles from './ContactForm.module.css';
import { Customer } from '../../../../types/types';

interface ContactFormProps {
  contactInfo: Customer;
  onContactInfoChange: (info: Customer) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({
  contactInfo,
  onContactInfoChange,
  onSubmit,
  isSubmitting
}) => {
  const [addressFields, setAddressFields] = useState({
    street: '',
    postalCode: '',
    city: '',
    country: 'Deutschland'
  });

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (['firstName', 'lastName', 'email', 'phone'].includes(name)) {
      const updatedInfo = {
        ...contactInfo,
        [name]: value
      };
      onContactInfoChange(updatedInfo);
    }

    if (['street', 'postalCode', 'city', 'country'].includes(name)) {
      const updatedAddressFields = {
        ...addressFields,
        [name]: value
      };
      setAddressFields(updatedAddressFields);

      const { street, postalCode, city, country } = updatedAddressFields;
      const addressParts = [];
      if (street) addressParts.push(street);
      if (postalCode || city) {
        const cityLine = [postalCode, city].filter(Boolean).join(' ');
        if (cityLine) addressParts.push(cityLine);
      }
      if (country) addressParts.push(country);

      const fullAddress = addressParts.join(', ');

      const updatedInfo = {
        ...contactInfo,
        address: fullAddress
      };
      onContactInfoChange(updatedInfo);
    }
  };

  return (
    <form className={styles.contactForm} onSubmit={onSubmit}>
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
            onChange={handleFieldChange}
            placeholder="Max"
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
            onChange={handleFieldChange}
            placeholder="Mustermann"
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
          onChange={handleFieldChange}
          placeholder="max.mustermann@email.com"
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
          onChange={handleFieldChange}
          placeholder="+49 30 12345678"
        />
      </div>

      <div className={styles.addressSection}>
        <h3>Address *</h3>

        <div className={styles.formGroup}>
          <label htmlFor="street">Straße + Hausnummer *</label>
          <input
            type="text"
            id="street"
            name="street"
            required
            value={addressFields.street}
            onChange={handleFieldChange}
            placeholder="Musterstraße 123"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="postalCode">PLZ *</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              required
              value={addressFields.postalCode}
              onChange={handleFieldChange}
              placeholder="10115"
              maxLength={5}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="city">Wohnort *</label>
            <input
              type="text"
              id="city"
              name="city"
              required
              value={addressFields.city}
              onChange={handleFieldChange}
              placeholder="Berlin"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="country">Land *</label>
          <div className={styles.selectWithIcon}>
            <select
              id="country"
              name="country"
              required
              value={addressFields.country}
              onChange={handleFieldChange}
            >
              <option value="Deutschland">Deutschland</option>
              <option value="Österreich">Österreich</option>
              <option value="Schweiz">Schweiz</option>
              <option value="Niederlande">Niederlande</option>
              <option value="Belgien">Belgien</option>
              <option value="Frankreich">Frankreich</option>
            </select>
            <FaChevronDown className={styles.selectIcon} />
          </div>
        </div>

        {contactInfo.address && (
          <div className={styles.addressPreview}>
            <small>{contactInfo.address}</small>
          </div>
        )}
      </div>

      <button
        className={styles.submitButton}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processing...' : 'Complete Purchase'}
      </button>
    </form>
  );
};

export default ContactForm;