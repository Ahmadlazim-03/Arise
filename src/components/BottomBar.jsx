import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

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
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 shadow-2xl">
      <div className="h-16 px-2">
        <ul className="grid grid-cols-5 h-full items-center gap-1">
          {items.map((it) => {
            const active = router.pathname === it.href;
            return (
              <li key={it.href} className="relative flex justify-center">
                <Link
                  href={it.href}
                  className="relative w-full flex flex-col items-center justify-center py-2"
                >
                  {active && (
                    <motion.div
                      layoutId="activeBottomTab"
                      className="absolute inset-0 bg-gradient-to-br from-primary/20 via-blue-500/20 to-primary/20 rounded-2xl"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <motion.div
                    className="relative z-10 flex flex-col items-center"
                    animate={{
                      scale: active ? 1.1 : 1,
                      y: active ? -2 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <motion.span
                      className="text-2xl leading-none mb-1"
                      animate={{
                        rotate: active ? [0, -10, 10, -10, 0] : 0,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {it.icon}
                    </motion.span>
                    <span
                      className={`text-[10px] font-medium transition-colors ${
                        active
                          ? 'text-primary font-bold'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {it.label}
                    </span>
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
