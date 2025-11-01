import { useEffect, useState } from 'react';

export default function Splash() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem('hasSeenSplash');
      if (!seen) {
        setShow(true);
        const t = setTimeout(() => {
          setShow(false);
          localStorage.setItem('hasSeenSplash', '1');
        }, 1500);
        return () => clearTimeout(t);
      }
    } catch (e) {}
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="text-center animate-pulse">
        <div className="text-4xl font-extrabold tracking-tight">
          <span className="text-primary">Bulking</span> <span className="text-accent">Tracker</span>
        </div>
        <div className="mt-2 text-gray-500">Ectomorph</div>
      </div>
    </div>
  );
}
