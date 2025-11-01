import CardSection from '../components/CardSection';
import WeightChart from '../components/WeightChart';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useProgress } from '../context/ProgressContext';

export default function HomePage() {
  const { stats, resetToday, exportToday, exportAll, importProgress, dateKey } = useProgress();
  const [weights, setWeights] = useState([]); // [{label, weight}]
  const [weightInput, setWeightInput] = useState('');
  const [calEntries, setCalEntries] = useState([]); // [{date, calories}]
  const [calInput, setCalInput] = useState('');
  const [workouts, setWorkouts] = useState(0);

  // Load from localStorage
  useEffect(() => {
    try {
      const w = JSON.parse(localStorage.getItem('weights') || '[]');
      const c = JSON.parse(localStorage.getItem('calories') || '[]');
      const wk = parseInt(localStorage.getItem('workouts') || '0', 10);
      setWeights(Array.isArray(w) ? w : []);
      setCalEntries(Array.isArray(c) ? c : []);
      setWorkouts(Number.isFinite(wk) ? wk : 0);
    } catch (e) {}
  }, []);

  const currentWeight = weights.length ? weights[weights.length - 1].weight : '-';
  const avgCalories = useMemo(() => {
    if (!calEntries.length) return '-';
    const sum = calEntries.reduce((acc, x) => acc + (Number(x.calories) || 0), 0);
    return Math.round(sum / calEntries.length);
  }, [calEntries]);

  const addWeight = () => {
    const value = Number(weightInput);
    if (!value || value <= 0) return;
    const next = [...weights, { label: `Minggu ${weights.length + 1}`, weight: value }];
    setWeights(next);
    localStorage.setItem('weights', JSON.stringify(next));
    setWeightInput('');
  };

  const addCalories = () => {
    const value = Number(calInput);
    if (!value || value <= 0) return;
    const next = [...calEntries, { date: new Date().toISOString(), calories: value }];
    setCalEntries(next);
    localStorage.setItem('calories', JSON.stringify(next));
    setCalInput('');
  };

  const incWorkout = (delta) => {
    const next = Math.max(0, workouts + delta);
    setWorkouts(next);
    localStorage.setItem('workouts', String(next));
  };

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h1 className="text-2xl font-extrabold tracking-tight mb-2">Selamat Datang di Bulking Tracker Ectomorph 💪</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Pantau progres bulking-mu dari ponsel. Semua fitur dirancang mobile-first dan mudah digunakan.</p>
      </div>

      {/* Quick summary cards - mobile-first grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <CardSection title="⚖️ Berat Terkini" className="p-4">
          <div className="text-2xl font-bold">{currentWeight} {currentWeight !== '-' ? 'kg' : ''}</div>
          <p className="text-xs text-gray-500 mt-1">Dari input mingguan</p>
        </CardSection>
        <CardSection title="🏋️ Latihan Dilakukan" className="p-4">
          <div className="flex items-center gap-3">
            <button className="btn-primary" onClick={() => incWorkout(1)}>+1</button>
            <button className="btn-accent" onClick={() => incWorkout(-1)}>-1</button>
            <div className="text-2xl font-bold ml-auto">{workouts}</div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Hitung latihan minggu ini</p>
        </CardSection>
        <CardSection title="🔥 Rata-rata Kalori" className="p-4">
          <div className="text-2xl font-bold">{avgCalories} {avgCalories !== '-' ? 'kcal' : ''}</div>
          <p className="text-xs text-gray-500 mt-1">Dari input kalori harian</p>
        </CardSection>
      </div>

  <CardSection title="✅ Progres Harian" className="p-4">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Tanggal: <span className="font-semibold">{dateKey}</span>
        </div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="card p-3">
            <div className="font-semibold">Latihan (Exercises)</div>
            <div className="text-gray-600 dark:text-gray-300 mt-1">{stats.exercises.done} / {stats.exercises.total} selesai</div>
            <Link className="btn-primary mt-2 justify-center w-full" href="/jadwal">Buka</Link>
          </div>
          <div className="card p-3">
            <div className="font-semibold">Pola Makan</div>
            <div className="text-gray-600 dark:text-gray-300 mt-1">{stats.meals.done} / {stats.meals.total} selesai</div>
            <Link className="btn-primary mt-2 justify-center w-full" href="/pola-makan">Buka</Link>
          </div>
          <div className="card p-3">
            <div className="font-semibold">Recovery</div>
            <div className="text-gray-600 dark:text-gray-300 mt-1">{stats.recovery.done} / {stats.recovery.total} selesai</div>
            <Link className="btn-primary mt-2 justify-center w-full" href="/istirahat">Buka</Link>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn-accent" onClick={resetToday}>Reset Hari Ini</button>
          <button className="btn-primary" onClick={exportToday}>Export Hari Ini (JSON)</button>
          <button className="btn-primary" onClick={exportAll}>Export Semua Hari</button>
          <label className="btn-primary cursor-pointer">
            Import JSON
            <input type="file" accept="application/json" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importProgress(f);
            }} />
          </label>
        </div>
      </CardSection>

      <CardSection title="📈 Grafik Progres Berat (Mingguan)">
        <WeightChart data={weights} />
        <div className="mt-3 flex gap-2">
          <input
            type="number"
            inputMode="decimal"
            placeholder="Berat (kg)"
            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
          />
          <button className="btn-primary" onClick={addWeight}>Simpan</button>
        </div>
      </CardSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardSection title="🍽️ Catat Kalori Harian">
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="numeric"
              placeholder="Kalori (kcal)"
              className="flex-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2"
              value={calInput}
              onChange={(e) => setCalInput(e.target.value)}
            />
            <button className="btn-primary" onClick={addCalories}>Tambah</button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Tips: target surplus +300–500 kalori/hari.</p>
        </CardSection>

        <CardSection title="🧭 Navigasi Cepat">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            <Link className="btn-primary justify-center" href="/jadwal">Jadwal</Link>
            <Link className="btn-primary justify-center" href="/pola-makan">Pola Makan</Link>
            <Link className="btn-primary justify-center" href="/target">Target</Link>
            <Link className="btn-primary justify-center" href="/istirahat">Istirahat</Link>
            <Link className="btn-primary justify-center" href="/tips">Tips</Link>
          </div>
        </CardSection>
      </div>
    </div>
  );
}
