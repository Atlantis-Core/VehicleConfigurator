import React, { createContext, useContext, ReactNode } from 'react';
import { useLeasing } from '@hooks/useLeasing';

const LeasingContext = createContext<ReturnType<typeof useLeasing> | undefined>(undefined);

interface LeasingProviderProps {
  children: ReactNode;
  totalPrice: number;
}

export const LeasingProvider = ({ children, totalPrice }: LeasingProviderProps) => {
  const leasingData = useLeasing(totalPrice);

  return (
    <LeasingContext.Provider value={leasingData}>
      {children}
    </LeasingContext.Provider>
  );
};

export const useSharedLeasing = () => {
  const context = useContext(LeasingContext);
  if (context === undefined) {
    throw new Error('useSharedLeasing must be used within a LeasingProvider');
  }
  return context;
};