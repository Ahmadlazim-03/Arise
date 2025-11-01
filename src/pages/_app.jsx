import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomBar from '../components/BottomBar';
import Splash from '../components/Splash';
import { ProgressProvider } from '../context/ProgressContext';
import { useEffect } from 'react';

export default function MyApp({ Component, pageProps }) {
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

  return (
    <ProgressProvider>
      <div className="min-h-screen flex flex-col">
        <Splash />
        <Navbar />
        <main className="flex-1 container-responsive py-6 pb-24">
          <Component {...pageProps} />
        </main>
        <Footer />
        <BottomBar />
      </div>
    </ProgressProvider>
  );
}
