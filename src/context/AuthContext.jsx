import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  isAuthenticated, 
  getCurrentUser, 
  logout as logoutUser 
} from '@/utils/biometricAuth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register'];

  useEffect(() => {
    checkAuth();
  }, [router.pathname]);

  const checkAuth = () => {
    const isAuth = isAuthenticated();
    const currentUser = getCurrentUser();

    setAuthenticated(isAuth);
    setUser(currentUser);
    setLoading(false);

    // Redirect logic
    const isPublicRoute = publicRoutes.includes(router.pathname);

    if (!isAuth && !isPublicRoute) {
      // Not authenticated and trying to access protected route
      router.push('/login');
    } else if (isAuth && isPublicRoute) {
      // Already authenticated and trying to access login/register
      router.push('/');
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setAuthenticated(false);
    router.push('/login');
  };

  const value = {
    user,
    authenticated,
    loading,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
