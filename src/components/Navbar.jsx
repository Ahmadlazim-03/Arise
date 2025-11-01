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
    <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 bg-white/90 dark:bg-gray-950/90 backdrop-blur">
      <div className="container-responsive flex items-center justify-between h-16">
        <Link href="/" className="font-extrabold tracking-tight text-xl">
          <span className="text-primary">Bulking</span> Tracker <span className="text-accent">Ectomorph</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const active = router.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition ${
                  active
                    ? 'text-primary font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary'
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
