import { createContext } from 'react';

// Keep context identity stable when Vite refreshes the provider component.
export const AuthContext = createContext(null);
