import Link from 'next/link';
import { useRouter } from 'next/router';

const items = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/jadwal', label: 'Jadwal', icon: '📅' },
  { href: '/pola-makan', label: 'Makan', icon: '🍽️' },
  { href: '/istirahat', label: 'Istirahat', icon: '😴' },
  { href: '/history', label: 'History', icon: '📜' },
];

export default function BottomBar() {
  const router = useRouter();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-t border-gray-200 dark:border-gray-800">
      <ul className="grid grid-cols-5 text-xs">
        {items.map((it) => {
          const active = router.pathname === it.href;
          return (
            <li key={it.href} className="">
              <Link
                href={it.href}
                className={`flex flex-col items-center justify-center py-2 ${
                  active ? 'text-primary font-semibold' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <span className="text-lg leading-none">{it.icon}</span>
                <span className="mt-1">{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
