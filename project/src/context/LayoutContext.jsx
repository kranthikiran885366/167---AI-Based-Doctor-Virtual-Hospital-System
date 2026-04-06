import React, { createContext, useContext } from 'react';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout.js';

const LayoutContext = createContext();

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

export const LayoutProvider = ({ children }) => {
  const layoutState = useResponsiveLayout();

  return (
    <LayoutContext.Provider value={layoutState}>
      {children}
    </LayoutContext.Provider>
  );
};
