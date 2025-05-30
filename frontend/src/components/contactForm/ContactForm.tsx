import React from 'react';
import styles from './ContactForm.module.css';
import { Customer } from '../../types/types';

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
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onContactInfoChange({
      ...contactInfo,
      [name]: value
    });
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

      <div className={styles.formGroup}>
        <label htmlFor="address">Address *</label>
        <textarea
          id="address"
          name="address"
          required
          value={contactInfo.address}
          onChange={handleFieldChange}
          rows={3}
          placeholder="Musterstraße 123, 10115 Berlin, Deutschland"
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
  );
};

export default ContactForm;