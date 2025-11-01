import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldDark = saved ? saved === 'dark' : prefersDark;
      setIsDark(shouldDark);
    } catch (e) {}
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    const root = document.documentElement;
    if (next) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="rounded-lg border border-gray-200 dark:border-gray-800 p-2 hover:bg-gray-100 dark:hover:bg-gray-900"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? '🌙' : '🌞'}
    </button>
  );
}
