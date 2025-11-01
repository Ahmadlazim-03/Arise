import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

/**
 * Higher-Order Component to protect routes
 * Redirects to login if not authenticated
 */
export const withAuth = (WrappedComponent) => {
  return (props) => {
    const { authenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !authenticated) {
        router.push('/login');
      }
    }, [authenticated, loading, router]);

    // Show loading spinner while checking auth
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Memverifikasi autentikasi...
            </p>
          </motion.div>
        </div>
      );
    }

    // Show nothing while redirecting
    if (!authenticated) {
      return null;
    }

    // User is authenticated, render the component
    return <WrappedComponent {...props} />;
  };
};

/**
 * Hook to require authentication
 * Can be used inside components instead of HOC
 */
export const useRequireAuth = () => {
  const { authenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.push('/login');
    }
  }, [authenticated, loading, router]);

  return { authenticated, loading };
};
