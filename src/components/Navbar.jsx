import Link from 'next/link';
import { useRouter } from 'next/router';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/jadwal', label: 'Jadwal' },
  { href: '/pola-makan', label: 'Pola Makan' },
  { href: '/target', label: 'Target' },
  { href: '/istirahat', label: 'Istirahat' },
  { href: '/tips', label: 'Tips' },
  { href: '/history', label: 'History' },
];

export default function Navbar() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
      <div className="container-responsive flex items-center justify-between h-16">
        <Link href="/" className="font-extrabold tracking-tight text-xl transition-transform hover:scale-105">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Bulking Daily</span>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const active = router.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-all duration-300 rounded-lg px-3 py-2 ${
                  active
                    ? 'bg-gradient-to-r from-primary/10 to-blue-500/10 text-primary font-semibold shadow-sm scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
      {/* Mobile overflow nav removed in favor of BottomBar */}
    </header>
  );
}
