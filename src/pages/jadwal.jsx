import Checklist from '../components/Checklist';
import { useProgress } from '../context/ProgressContext';
import { useMemo } from 'react';
import { indoDayName } from '../utils/date';
import Link from 'next/link';

export default function JadwalPage() {
  const { progress, toggle, dateKey, schedule } = useProgress();
  const dayName = indoDayName(dateKey);

  const todaySchedule = useMemo(() => (schedule || []).find((d) => d.day === dayName) || null, [dayName, schedule]);

  if (!todaySchedule) {
    return (
      <div className="space-y-4 pb-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold">Jadwal Hari Ini</h3>
            <Link href="/kelola-jadwal" className="btn-primary text-xs">Kelola Jadwal</Link>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Tidak ada jadwal yang cocok untuk tanggal ini.</p>
        </div>
      </div>
    );
  }

  const items = (todaySchedule.exercises || []).map((ex) => ({ key: `${todaySchedule.day}::${ex}`, label: ex }));
  const completed = items.filter((item) => progress.exercises[item.key]).length;
  const total = items.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-4 pb-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold">{todaySchedule.day}</h3>
          <Link href="/kelola-jadwal" className="btn-primary text-xs">Kelola Jadwal</Link>
          <span className="text-sm font-semibold text-primary">{completed}/{total}</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">{todaySchedule.focus}</p>

        {/* Progress Bar */}
        <div className="mb-4 progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
        </div>

        <Checklist
          items={items}
          values={progress.exercises}
          onToggle={(k) => toggle('exercises', k)}
        />
      </div>
    </div>
  );
}
