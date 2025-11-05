import WeightChart from '../components/WeightChart';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useProgress } from '../context/ProgressContext';

export default function HomePage() {
  const { stats, resetToday, exportToday, exportAll, importProgress, dateKey } = useProgress();
  const [weights, setWeights] = useState([]); // [{label, weight}]
  const [weightInput, setWeightInput] = useState('');
  const [workouts, setWorkouts] = useState(0);
  const [weightRange, setWeightRange] = useState(8); // last N points

  // Load from localStorage
  useEffect(() => {
    try {
      const w = JSON.parse(localStorage.getItem('weights') || '[]');
      const wk = parseInt(localStorage.getItem('workouts') || '0', 10);
      setWeights(Array.isArray(w) ? w : []);
      setWorkouts(Number.isFinite(wk) ? wk : 0);
    } catch (e) {}
  }, []);

  const currentWeight = weights.length ? weights[weights.length - 1].weight : '-';

  const addWeight = () => {
    const value = Number(weightInput);
    if (!value || value <= 0) return;
    const next = [...weights, { label: `Minggu ${weights.length + 1}`, weight: value }];
    setWeights(next);
    localStorage.setItem('weights', JSON.stringify(next));
    setWeightInput('');
  };

  // (Calories feature removed)

  const incWorkout = (delta) => {
    const next = Math.max(0, workouts + delta);
    setWorkouts(next);
    localStorage.setItem('workouts', String(next));
  };

  const totalProgress = useMemo(() => {
    const total = stats.exercises.total + stats.meals.total + stats.recovery.total;
    const done = stats.exercises.done + stats.meals.done + stats.recovery.done;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }, [stats]);

  const weightsToShow = useMemo(() => {
    return (weights || []).slice(-weightRange);
  }, [weights, weightRange]);

  return (
    <div className="space-y-4 pb-4">
      <div className="card p-5 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Bulking Daily
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{dateKey}</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{totalProgress}%</div>
            <div className="text-xs text-gray-500">Progress</div>
          </div>
        </div>
        <div className="mt-4 progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${totalProgress}%` }} />
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Link href="/jadwal" className="card p-4 hover:shadow-xl transition-all active:scale-95">
          <div className="text-2xl font-bold text-primary">{stats.exercises.done}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">of {stats.exercises.total}</div>
          <div className="text-xs font-medium mt-2">Latihan</div>
          <div className="mt-2 progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${stats.exercises.total ? (stats.exercises.done / stats.exercises.total * 100) : 0}%` }} />
          </div>
        </Link>

        <Link href="/pola-makan" className="card p-4 hover:shadow-xl transition-all active:scale-95">
          <div className="text-2xl font-bold text-accent">{stats.meals.done}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">of {stats.meals.total}</div>
          <div className="text-xs font-medium mt-2">Makan</div>
          <div className="mt-2 progress-bar-bg">
            <div className="h-full bg-gradient-to-r from-accent via-orange-500 to-accent rounded-full transition-all duration-500" style={{ width: `${stats.meals.total ? (stats.meals.done / stats.meals.total * 100) : 0}%` }} />
          </div>
        </Link>

        <Link href="/istirahat" className="card p-4 hover:shadow-xl transition-all active:scale-95">
          <div className="text-2xl font-bold text-green-600">{stats.recovery.done}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">of {stats.recovery.total}</div>
          <div className="text-xs font-medium mt-2">Recovery</div>
          <div className="mt-2 progress-bar-bg">
            <div className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 rounded-full transition-all duration-500" style={{ width: `${stats.recovery.total ? (stats.recovery.done / stats.recovery.total * 100) : 0}%` }} />
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="card p-4">
        <h2 className="text-sm font-semibold mb-3">Catatan Cepat</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <div className="text-sm font-medium min-w-[70px]">Workout</div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-lg bg-primary text-white font-bold shadow-md active:scale-90 transition-all" onClick={() => incWorkout(1)}>+</button>
              <button className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 font-bold active:scale-90 transition-all" onClick={() => incWorkout(-1)}>-</button>
            </div>
            <div className="ml-auto text-xl font-bold text-primary">{workouts}</div>
          </div>

          {/* (Calories input removed) */}

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <div className="text-sm font-medium min-w-[70px]">Berat</div>
            <input
              type="number"
              inputMode="decimal"
              placeholder="kg"
              className="input-modern flex-1 text-sm"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
            />
            <button className="btn-primary text-sm px-4" onClick={addWeight}>OK</button>
          </div>
        </div>
      </div>

      {/* Charts (Weight only) */}
      <div className="card p-4">
        <h2 className="text-sm font-semibold mb-3">Grafik</h2>
        <div className="space-y-6">
          <section>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-600 dark:text-gray-400">Progres Berat</div>
              <div className="flex gap-1">
                {[4,8,12].map((n) => (
                  <button
                    key={n}
                    onClick={() => setWeightRange(n)}
                    className={`px-2 py-1 rounded-md text-xs font-medium ${weightRange===n? 'bg-primary text-white':'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            {weightsToShow.length ? (
              <WeightChart data={weightsToShow} />
            ) : (
              <div className="text-xs text-gray-500">Belum ada data berat. Tambahkan di bagian Catatan Cepat.</div>
            )}
          </section>
        </div>
      </div>

      {/* Data Management */}
      <div className="card p-4">
        <h2 className="text-sm font-semibold mb-3">Kelola Data</h2>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button className="btn-outline" onClick={resetToday}>Reset Hari Ini</button>
          <button className="btn-primary" onClick={exportToday}>Export Hari Ini</button>
          <button className="btn-primary" onClick={exportAll}>Export Semua</button>
          <label className="btn-primary cursor-pointer">
            Import JSON
            <input type="file" accept="application/json" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importProgress(f);
            }} />
          </label>
        </div>
      </div>
    </div>
  );
}
