import CardSection from '../components/CardSection';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export default function HistoryPage() {
  const [days, setDays] = useState([]);

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

  if (!days.length) {
    return (
      <CardSection title="📜 Riwayat Progres">
        <p className="text-sm text-gray-600 dark:text-gray-300">Belum ada data riwayat. Mulai tandai checklist hari ini di halaman lain, lalu kembali ke sini.</p>
        <div className="mt-3">
          <Link href="/" className="btn-primary">Ke Dashboard</Link>
        </div>
      </CardSection>
    );
  }

  return (
    <div className="space-y-4">
      <CardSection title="📜 Riwayat Progres">
        <ul className="space-y-3">
          {days.map((d) => (
            <li key={d.date} className="card p-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold break-words">{d.date}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Exercises: {d.stats.exercises.done}/{d.stats.exercises.total} • Makan: {d.stats.meals.done}/{d.stats.meals.total} • Recovery: {d.stats.recovery.done}/{d.stats.recovery.total}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="btn-primary"
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
                  <details className="text-sm">
                    <summary className="cursor-pointer select-none">Detail</summary>
                    <div className="mt-2 space-y-3">
                      <section className="card p-2">
                        <div className="font-medium mb-1">Exercises</div>
                        <ul className="list-disc pl-5 space-y-1 text-xs break-words">
                          {Object.entries(d.obj.exercises || {}).map(([k, v]) => (
                            <li key={k} className={v ? 'text-green-600' : ''}>{k.split('::')[1]} {v ? '✓' : ''}</li>
                          ))}
                        </ul>
                      </section>
                      <section className="card p-2">
                        <div className="font-medium mb-1">Makan</div>
                        <ul className="list-disc pl-5 space-y-1 text-xs break-words">
                          {Object.entries(d.obj.meals || {}).map(([k, v]) => (
                            <li key={k} className={v ? 'text-green-600' : ''}>{k} {v ? '✓' : ''}</li>
                          ))}
                        </ul>
                      </section>
                      <section className="card p-2">
                        <div className="font-medium mb-1">Recovery</div>
                        <ul className="list-disc pl-5 space-y-1 text-xs break-words">
                          {Object.entries(d.obj.recovery || {}).map(([k, v]) => (
                            <li key={k} className={v ? 'text-green-600' : ''}>{k} {v ? '✓' : ''}</li>
                          ))}
                        </ul>
                      </section>
                    </div>
                  </details>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardSection>
    </div>
  );
}
