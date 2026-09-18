import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { login as loginRequest } from '../api/auth.js';
import { UNAUTHORIZED_EVENT } from '../api/client.js';
import { clearSession, getStoredAdmin, getToken, saveSession } from '../lib/authStorage.js';

const AuthContext = createContext(null);

const readStoredSession = () => {
  const token = getToken();
  return token ? { token, admin: getStoredAdmin() } : null;
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Any 401 means the token expired or was revoked. The axios interceptor has
  // already cleared storage; mirroring that here makes protected routes
  // redirect instead of rendering an empty admin shell.
  useEffect(() => {
    const handleUnauthorized = () => setSession(null);
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const signIn = useCallback(async (email, password) => {
    setIsSubmitting(true);
    try {
      const data = await loginRequest({ email, password });
      saveSession(data.token, data.admin);
      setSession({ token: data.token, admin: data.admin });
      return data.admin;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      admin: session?.admin ?? null,
      isAuthenticated: Boolean(session),
      isSubmitting,
      signIn,
      signOut,
    }),
    [session, isSubmitting, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};
