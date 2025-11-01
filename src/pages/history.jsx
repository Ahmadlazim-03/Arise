import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export default function HistoryPage() {
  const [days, setDays] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const entries = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('progress:')) {
        try {
          const date = k.replace('progress:', '');
          const obj = JSON.parse(localStorage.getItem(k));
          const count = (o) => Object.values(o || {}).filter(Boolean).length;
          const total = (o) => Object.keys(o || {}).length;
          entries.push({ date, obj, stats: {
            exercises: { done: count(obj.exercises), total: total(obj.exercises) },
            meals: { done: count(obj.meals), total: total(obj.meals) },
            recovery: { done: count(obj.recovery), total: total(obj.recovery) },
          }});
        } catch (e) {}
      }
    }
    entries.sort((a, b) => a.date < b.date ? 1 : -1);
    setDays(entries);
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(days.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDays = days.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!days.length) {
    return (
      <div className="card p-5">
        <h2 className="text-lg font-bold mb-3">Riwayat Progres</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Belum ada data riwayat. Mulai tandai checklist hari ini di halaman lain, lalu kembali ke sini.
        </p>
        <Link href="/" className="btn-primary inline-flex">Ke Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Riwayat Progres</h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Total: {days.length} hari
          </span>
        </div>
        <ul className="space-y-4">
          {currentDays.map((d) => (
            <li key={d.date} className="card p-5 hover:shadow-xl transition-all">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-bold text-base">{d.date}</div>
                  <button
                    className="btn-primary text-sm px-4"
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(d.obj, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `progress-${d.date}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Export
                  </button>
                </div>

                {/* Progress bars */}
                <div className="space-y-3 text-sm">
                  {['exercises','meals','recovery'].map((key) => {
                    const s = d.stats[key];
                    const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
                    const label = key === 'exercises' ? 'Exercises' : key === 'meals' ? 'Makan' : 'Recovery';
                    const gradient = key === 'exercises' 
                      ? 'bg-gradient-to-r from-primary via-blue-500 to-primary' 
                      : key === 'meals' 
                      ? 'bg-gradient-to-r from-accent via-orange-500 to-accent'
                      : 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-500';
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-semibold">{label}</span>
                          <span className="text-gray-600 dark:text-gray-400">{s.done}/{s.total} • {pct}%</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div className={`h-full ${gradient} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <details className="text-sm">
                  <summary className="cursor-pointer select-none font-medium text-primary">Detail Checklist</summary>
                  <div className="mt-3 space-y-3">
                    <section className="card p-3">
                      <div className="font-semibold mb-2">Exercises</div>
                      <ul className="list-disc pl-5 space-y-1 text-sm break-words">
                        {Object.entries(d.obj.exercises || {}).map(([k, v]) => (
                          <li key={k} className={v ? 'text-green-600 font-medium' : 'text-gray-500'}>{k.split('::')[1]} {v ? '✓' : ''}</li>
                        ))}
                      </ul>
                    </section>
                    <section className="card p-3">
                      <div className="font-semibold mb-2">Makan</div>
                      <ul className="list-disc pl-5 space-y-1 text-sm break-words">
                        {Object.entries(d.obj.meals || {}).map(([k, v]) => (
                          <li key={k} className={v ? 'text-green-600 font-medium' : 'text-gray-500'}>{k} {v ? '✓' : ''}</li>
                        ))}
                      </ul>
                    </section>
                    <section className="card p-3">
                      <div className="font-semibold mb-2">Recovery</div>
                      <ul className="list-disc pl-5 space-y-1 text-sm break-words">
                        {Object.entries(d.obj.recovery || {}).map(([k, v]) => (
                          <li key={k} className={v ? 'text-green-600 font-medium' : 'text-gray-500'}>{k} {v ? '✓' : ''}</li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </details>
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                currentPage === 1
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  : 'bg-primary/10 text-primary hover:bg-primary/20 active:scale-95'
              }`}
            >
              ← Prev
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first, last, current, and neighbors
                const showPage = 
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1);
                
                const showEllipsis = 
                  (page === currentPage - 2 && currentPage > 3) ||
                  (page === currentPage + 2 && currentPage < totalPages - 2);

                if (showEllipsis) {
                  return (
                    <span key={page} className="px-2 py-2 text-gray-400">
                      ...
                    </span>
                  );
                }

                if (!showPage) return null;

                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-10 h-10 rounded-xl font-medium transition-all ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-md scale-110'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary active:scale-95'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                currentPage === totalPages
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  : 'bg-primary/10 text-primary hover:bg-primary/20 active:scale-95'
              }`}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
