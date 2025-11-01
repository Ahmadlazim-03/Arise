export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-200 dark:border-gray-800">
      <div className="container-responsive py-6 text-sm text-gray-600 dark:text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          © {new Date().getFullYear()} Bulking Tracker Ectomorph. Built with Next.js + Tailwind CSS.
        </p>
        <p>
          Deploy free on <a className="link" href="https://vercel.com/" target="_blank" rel="noreferrer">Vercel</a>.
        </p>
      </div>
    </footer>
  );
}
