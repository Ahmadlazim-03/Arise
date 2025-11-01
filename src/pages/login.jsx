import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  authenticateBiometric, 
  isBiometricSupported, 
  getAvailableAuthenticators,
  isAuthenticated 
} from '@/utils/biometricAuth';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [supported, setSupported] = useState(false);
  const [authenticators, setAuthenticators] = useState({ platform: false, crossPlatform: false });
  const [registeredUsersCount, setRegisteredUsersCount] = useState(0);

  useEffect(() => {
    // Check if already logged in
    if (isAuthenticated()) {
      router.push('/');
      return;
    }

    checkBiometricSupport();
    checkRegisteredUsers();
  }, []);

  const checkBiometricSupport = async () => {
    const isSupported = isBiometricSupported();
    setSupported(isSupported);

    if (isSupported) {
      const auth = await getAvailableAuthenticators();
      setAuthenticators(auth);
    }
  };

  const checkRegisteredUsers = () => {
    const users = JSON.parse(localStorage.getItem('biometric_users') || '[]');
    setRegisteredUsersCount(users.length);
  };

  const handleLogin = async () => {
    setError('');

    if (!supported || !authenticators.platform) {
      setError('Device tidak mendukung biometric authentication');
      return;
    }

    if (registeredUsersCount === 0) {
      setError('Belum ada user terdaftar. Silakan registrasi terlebih dahulu.');
      return;
    }

    setLoading(true);

    try {
      const result = await authenticateBiometric();
      
      // Show success message briefly
      setTimeout(() => {
        router.push('/');
      }, 1000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Login Biometric
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Masuk menggunakan Face ID atau Fingerprint
          </p>
        </motion.div>

        {/* Support Status */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className={`p-4 rounded-xl ${
            supported && authenticators.platform
              ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
              : 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-start gap-3">
              {supported && authenticators.platform ? (
                <svg className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <div className="flex-1">
                <p className={`font-semibold ${
                  supported && authenticators.platform
                    ? 'text-green-800 dark:text-green-300'
                    : 'text-red-800 dark:text-red-300'
                }`}>
                  {supported && authenticators.platform
                    ? '✓ Device mendukung biometric'
                    : '✗ Biometric tidak tersedia'
                  }
                </p>
                <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                  {supported && authenticators.platform
                    ? `${registeredUsersCount} user terdaftar`
                    : 'Browser atau device tidak mendukung WebAuthn'
                  }
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="space-y-6">
            {/* Biometric Illustration */}
            <div className="text-center py-8">
              <motion.div
                animate={loading ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-full flex items-center justify-center mb-4"
              >
                <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {loading ? 'Memindai Biometric...' : 'Siap untuk Login'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {loading ? 'Verifikasi sedang berlangsung' : 'Klik tombol untuk memulai scan'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl"
              >
                <p className="text-red-800 dark:text-red-300 text-sm flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </motion.div>
            )}

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading || !supported || !authenticators.platform || registeredUsersCount === 0}
              className="w-full py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memverifikasi...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Scan Biometric untuk Login
                </>
              )}
            </button>

            {/* Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>
                  Login menggunakan Face ID, Touch ID, atau Fingerprint scanner yang sama 
                  dengan yang digunakan saat registrasi.
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Register Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Belum punya akun?{' '}
            <button
              onClick={() => router.push('/register')}
              className="text-primary hover:text-blue-600 font-semibold hover:underline"
            >
              Registrasi di sini
            </button>
          </p>
        </motion.div>

        {/* No Biometric Alternative */}
        {(!supported || !authenticators.platform) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl"
          >
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              <strong>Device tidak mendukung biometric?</strong><br/>
              Gunakan device dengan Face ID, Touch ID, atau Fingerprint scanner untuk menggunakan aplikasi ini.
              Atau gunakan browser yang mendukung WebAuthn (Chrome, Safari, Edge terbaru).
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
