import { useState, useEffect } from 'react';
import { LEASING_OPTIONS } from '@lib/getLeasingOptions';

export interface LeasingOption {
  months: number;
  rate: string;
  label: string;
  features: string[];
}

export const useLeasing = (basePrice: number) => {
  // Try to get the previously selected option from localStorage
  const getStoredOption = (): number | null => {
    const stored = localStorage.getItem('selectedLeasingOption');
    return stored ? parseInt(stored) : null;
  };
  
  // Initialize with the stored option or default to 36 months
  const [selectedOption, setSelectedOption] = useState<number>(getStoredOption() || 36);
  const leasingOptions = LEASING_OPTIONS;
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);

  // Calculate monthly payment for a given number of months
  const calculateMonthlyPayment = (months: number): number => {
    const option = leasingOptions.find(opt => opt.months === months);
    if (!option) return 0;

    // Extract the rate percentage from the rate string (e.g., "3.9%" -> 3.9)
    const ratePercentage = parseFloat(option.rate.replace('%', ''));
    const monthlyRate = ratePercentage / 100 / 12;
    
    // Calculate monthly payment using the formula:
    // P = L * r * (1 + r)^n / ((1 + r)^n - 1)
    // where P = payment, L = loan amount, r = monthly rate, n = number of months
    const numerator = basePrice * monthlyRate * Math.pow(1 + monthlyRate, months);
    const denominator = Math.pow(1 + monthlyRate, months) - 1;
    const payment = numerator / denominator;
    
    return Math.round(payment);
  };

  // Get monthly payment for any option
  const getMonthlyPaymentFor = (months: number): number => {
    return calculateMonthlyPayment(months);
  };

  // Calculate and set monthly payment for selected option
  useEffect(() => {
    const payment = calculateMonthlyPayment(selectedOption);
    setMonthlyPayment(payment);
  }, [selectedOption, basePrice]);

  // Save to localStorage when option changes
  useEffect(() => {
    localStorage.setItem('selectedLeasingOption', selectedOption.toString());
  }, [selectedOption]);

  // Select a new leasing option
  const selectLeasingOption = (months: number) => {
    if (leasingOptions.some(opt => opt.months === months)) {
      setSelectedOption(months);
    }
  };

  return {
    leasingOptions,
    selectedOption,
    monthlyPayment,
    selectLeasingOption,
    getMonthlyPaymentFor
  };
};