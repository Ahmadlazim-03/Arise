import { useEffect, useMemo, useState } from 'react';
import { useProgress } from '../context/ProgressContext';

function toTextarea(exercises = []) {
  return (exercises || []).join('\n');
}

function fromTextarea(text) {
  return String(text || '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function KelolaJadwalPage() {
  const { schedule, setCustomSchedule, resetSchedule } = useProgress();
  const [form, setForm] = useState([]);

  useEffect(() => {
    const initial = (schedule || []).map((d) => ({
      day: d.day,
      focus: d.focus || '',
      detail: d.detail || '',
      exercisesText: toTextarea(d.exercises),
    }));
    setForm(initial);
  }, [schedule]);

  const updateField = (idx, key, value) => {
    setForm((prev) => prev.map((row, i) => (i === idx ? { ...row, [key]: value } : row)));
  };

  const onSave = () => {
    const next = form.map((row) => ({
      day: row.day,
      focus: row.focus.trim(),
      detail: row.detail.trim(),
      exercises: fromTextarea(row.exercisesText),
    }));
    setCustomSchedule(next);
    alert('Jadwal disimpan. Perubahan diterapkan.');
  };

  return (
    <div className="space-y-4 pb-4">
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Kelola Jadwal Latihan</h2>
          <div className="flex gap-2">
            <button className="btn-outline text-xs" onClick={resetSchedule}>Reset ke Default</button>
            <button className="btn-primary text-xs" onClick={onSave}>Simpan Perubahan</button>
          </div>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Ubah daftar latihan per hari. Satu baris mewakili satu item latihan.</p>
      </div>

      <div className="space-y-4">
        {form.map((row, idx) => (
          <div key={row.day} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold">{row.day}</h3>
              <span className="text-xs text-gray-500">{fromTextarea(row.exercisesText).length} item</span>
            </div>

            <label className="block text-xs font-medium mb-1">Fokus</label>
            <input
              className="input-modern w-full mb-3 text-sm"
              value={row.focus}
              onChange={(e) => updateField(idx, 'focus', e.target.value)}
            />

            <label className="block text-xs font-medium mb-1">Detail</label>
            <input
              className="input-modern w-full mb-3 text-sm"
              value={row.detail}
              onChange={(e) => updateField(idx, 'detail', e.target.value)}
            />

            <label className="block text-xs font-medium mb-1">Latihan (satu per baris)</label>
            <textarea
              className="input-modern w-full h-32 text-sm"
              value={row.exercisesText}
              onChange={(e) => updateField(idx, 'exercisesText', e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-end gap-2">
          <button className="btn-outline text-xs" onClick={resetSchedule}>Reset ke Default</button>
          <button className="btn-primary text-xs" onClick={onSave}>Simpan Perubahan</button>
        </div>
      </div>
    </div>
  );
}
