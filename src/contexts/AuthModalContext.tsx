import { createContext, useContext, useCallback, ReactNode } from 'react';
import { useAuth } from '../context/UnifiedAuthProvider';

interface AuthModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const { login } = useAuth();

  // Since we're using MSAL redirect flow, we don't need a modal
  // Just trigger the login directly
  const openModal = useCallback(() => {
    login();
  }, [login]);

  const closeModal = useCallback(() => {
    // No-op since we don't have a modal anymore
  }, []);

  return (
    <AuthModalContext.Provider value={{ isOpen: false, openModal, closeModal }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}
