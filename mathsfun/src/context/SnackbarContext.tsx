'use client';
import { createContext, useContext, useState } from 'react';
import Snack from '@/components/Snack';

type SnackType = 'success' | 'error';

interface SnackbarContextType {
  showSnackbar: (message: string, type: SnackType) => void;
}

const SnackbarContext = createContext<SnackbarContextType>({
  showSnackbar: () => {},
});

export const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [snack, setSnack] = useState<{ message: string; type: SnackType } | null>(null);

  const showSnackbar = (message: string, type: SnackType) => {
    console.log('Showing snackbar:', message, type);
    setSnack({ message, type });
    setTimeout(() => {
      console.log('Hiding snackbar');
      setSnack(null);
    }, 3000);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snack
        message={snack?.message || ''}
        type={snack?.type || 'success'}
        isVisible={!!snack}
        onClose={() => setSnack(null)}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext); 