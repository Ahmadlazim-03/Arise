import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomBar from '../components/BottomBar';
import Splash from '../components/Splash';
import { ProgressProvider } from '../context/ProgressContext';
import { AuthProvider } from '../context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  // Ensure theme preference from localStorage is applied early
  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch (e) {}
  }, []);

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch(() => {});
    }
  }, []);

  // Public routes that don't need Navbar/BottomBar/Footer
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(router.pathname);

  return (
    <AuthProvider>
      <ProgressProvider>
        <div className="min-h-screen flex flex-col">
          <Splash />
          {!isPublicRoute && <Navbar />}
          <main className={`flex-1 container-responsive ${!isPublicRoute ? 'py-6 pb-24' : ''}`}>
            <Component {...pageProps} />
          </main>
          {!isPublicRoute && <Footer />}
          {!isPublicRoute && <BottomBar />}
        </div>
      </ProgressProvider>
    </AuthProvider>
  );
}
