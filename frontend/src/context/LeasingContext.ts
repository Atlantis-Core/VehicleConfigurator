import React, { createContext, useContext, ReactNode } from 'react';
import { useLeasing } from '@hooks/useLeasing';

const LeasingContext = createContext<ReturnType<typeof useLeasing> | undefined>(undefined);

interface LeasingProviderProps {
  children: ReactNode;
  totalPrice: number;
}

// Provider component that makes leasing available for every component
export const LeasingProvider = ({ children, totalPrice }: LeasingProviderProps) => {
  // Create single instance of leasing
  const leasingData = useLeasing(totalPrice);
  
  return React.createElement(
    LeasingContext.Provider,
    { value: leasingData },
    children
  );
};

// Custom hook that lets components access the leasing context
export const useSharedLeasing = () => {
  const context = useContext(LeasingContext);
  if (context === undefined) {
    throw new Error('useSharedLeasing must be used within a LeasingProvider');
  }
  return context;
};