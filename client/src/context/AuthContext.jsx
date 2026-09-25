import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE } from '../utils/apiConfig';

const AuthContext = createContext(null);

const TOKEN_KEY = 'brand_builder_jwt_token';
const GUEST_RUNS_KEY = 'brand_builder_guest_runs';
const GUEST_KITS_KEY = 'brand_builder_guest_kits';
export const MAX_GUEST_RUNS = 2;

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Guest test count (persisted across page reloads)
  const [guestRunsCount, setGuestRunsCount] = useState(() => {
    const val = localStorage.getItem(GUEST_RUNS_KEY);
    return val ? parseInt(val, 10) : 0;
  });

  // Saved brands library
  const [savedBrands, setSavedBrands] = useState([]);
  const [isSavedBrandsLoading, setIsSavedBrandsLoading] = useState(false);

  // Auth Modal & Sidebar UI state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState('manual'); // 'save_gate' | 'run_limit' | 'manual'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ----------------------------------------------------
  // GUEST STORAGE HELPERS
  // ----------------------------------------------------
  const getGuestKits = useCallback(() => {
    try {
      const raw = localStorage.getItem(GUEST_KITS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const saveGuestKitLocally = useCallback((brandKit, meta = {}) => {
    if (!brandKit) return;
    try {
      const current = getGuestKits();
      const newEntry = {
        id: 'guest_' + Date.now(),
        brandName: meta.brandName || brandKit?.brandStrategy?.brandName || 'Untitled Brand',
        tagline: meta.tagline || brandKit?.brandStrategy?.tagline || '',
        initialPitch: meta.initialPitch || '',
        domain: meta.domain || brandKit?.brandStrategy?.archetype || 'general',
        brandKit,
        createdAt: new Date().toISOString()
      };
      const updated = [newEntry, ...current].slice(0, 5); // Keep last 5 guest creations
      localStorage.setItem(GUEST_KITS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('[AuthContext] Failed to save guest kit locally:', err);
    }
  }, [getGuestKits]);

  const incrementGuestRun = useCallback(() => {
    setGuestRunsCount(prev => {
      const next = prev + 1;
      localStorage.setItem(GUEST_RUNS_KEY, String(next));
      return next;
    });
  }, []);

  // ----------------------------------------------------
  // BRAND HISTORY ACTIONS
  // ----------------------------------------------------
  const fetchSavedBrands = useCallback(async (activeToken = token) => {
    if (!activeToken) {
      setSavedBrands([]);
      return;
    }
    setIsSavedBrandsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/brands`, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSavedBrands(data.sessions || []);
      }
    } catch (err) {
      console.warn('[AuthContext] Error fetching saved brands:', err);
    } finally {
      setIsSavedBrandsLoading(false);
    }
  }, [API_BASE, token]);

  const syncGuestSessions = useCallback(async (activeToken) => {
    const guestKits = getGuestKits();
    if (!guestKits || guestKits.length === 0) return;

    try {
      const res = await fetch(`${API_BASE}/api/brands/sync-guest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`
        },
        body: JSON.stringify({ brandSessions: guestKits })
      });

      if (res.ok) {
        // Clear local guest cache once migrated
        localStorage.removeItem(GUEST_KITS_KEY);
        await fetchSavedBrands(activeToken);
      }
    } catch (err) {
      console.warn('[AuthContext] Error syncing guest brand kits:', err);
    }
  }, [API_BASE, fetchSavedBrands, getGuestKits]);

  // ----------------------------------------------------
  // AUTH VERIFICATION ON MOUNT
  // ----------------------------------------------------
  useEffect(() => {
    let isMounted = true;
    async function verifyExistingSession() {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${savedToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setUser(data.user);
            setToken(savedToken);
            await fetchSavedBrands(savedToken);
          }
        } else {
          // Token expired or invalid
          localStorage.removeItem(TOKEN_KEY);
          if (isMounted) {
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.warn('[AuthContext] Session verification failed:', err);
        localStorage.removeItem(TOKEN_KEY);
        if (isMounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    verifyExistingSession();
    return () => { isMounted = false; };
  }, [API_BASE, fetchSavedBrands]);

  // ----------------------------------------------------
  // AUTH METHODS
  // ----------------------------------------------------
  const handleAuthSuccess = async (newToken, newUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
    setIsAuthModalOpen(false);

    // Automatically migrate guest creations directly to user's MongoDB history
    await syncGuestSessions(newToken);
    await fetchSavedBrands(newToken);
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed.');
    }

    await handleAuthSuccess(data.token, data.user);
    return data.user;
  };

  const register = async (email, password, displayName) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed.');
    }

    await handleAuthSuccess(data.token, data.user);
    return data.user;
  };

  const loginWithGoogle = async (credential) => {
    const res = await fetch(`${API_BASE}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Google authentication failed.');
    }

    await handleAuthSuccess(data.token, data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setSavedBrands([]);
    setIsSidebarOpen(false);
  };

  // ----------------------------------------------------
  // SAVE BRAND ACTION (PERSISTENCE)
  // ----------------------------------------------------
  const saveBrandToLibrary = async (brandKit, meta = {}) => {
    if (!token) {
      // Gate persistence: trigger auth modal
      openAuthModal('save_gate');
      return { gated: true };
    }

    const payload = {
      brandName: meta.brandName || brandKit?.brandStrategy?.brandName || 'Untitled Brand',
      tagline: meta.tagline || brandKit?.brandStrategy?.tagline || '',
      initialPitch: meta.initialPitch || '',
      domain: meta.domain || brandKit?.brandStrategy?.archetype || 'general',
      brandKit
    };

    const res = await fetch(`${API_BASE}/api/brands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to save brand to library.');
    }

    await fetchSavedBrands(token);
    return { success: true, session: data.session };
  };

  const deleteBrandSession = async (id) => {
    if (!token || !id) return;
    const res = await fetch(`${API_BASE}/api/brands/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      setSavedBrands(prev => prev.filter(b => (b._id || b.id) !== id));
    } else {
      const data = await res.json();
      throw new Error(data.error || 'Failed to delete brand session.');
    }
  };

  // ----------------------------------------------------
  // MODAL / SIDEBAR CONTROLS
  // ----------------------------------------------------
  const openAuthModal = (reason = 'manual') => {
    setAuthModalReason(reason);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    guestRunsCount,
    maxGuestRuns: MAX_GUEST_RUNS,
    canRunGuestTest: Boolean(token || guestRunsCount < MAX_GUEST_RUNS),
    incrementGuestRun,
    saveGuestKitLocally,
    getGuestKits,
    savedBrands,
    isSavedBrandsLoading,
    saveBrandToLibrary,
    deleteBrandSession,
    fetchSavedBrands,
    login,
    register,
    loginWithGoogle,
    logout,
    isAuthModalOpen,
    authModalReason,
    openAuthModal,
    closeAuthModal,
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSidebar
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
