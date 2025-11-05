import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { scheduleData, mealsData, recoveryData } from '../utils/data';
import { indoDayName } from '../utils/date';

const ProgressContext = createContext(null);

const todayKey = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const buildDefaults = (schedule = scheduleData) => {
  const exercises = {};
  (schedule || []).forEach((row) => {
    (row.exercises || []).forEach((ex) => {
      exercises[`${row.day}::${ex}`] = false;
    });
  });
  const meals = {};
  mealsData.forEach((row) => {
    meals[row.time] = false;
  });
  const recovery = {};
  recoveryData.forEach((row) => {
    recovery[row.activity] = false;
  });
  return { exercises, meals, recovery };
};

export function ProgressProvider({ children }) {
  const initialDate = todayKey();
  const [dateKey, setDateKey] = useState(initialDate);
  // Custom schedule management
  const [customSchedule, setCustomScheduleState] = useState(() => {
    try {
      const raw = localStorage.getItem('schedule:custom');
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  });
  const schedule = useMemo(() => (Array.isArray(customSchedule) && customSchedule.length ? customSchedule : scheduleData), [customSchedule]);
  const readFromStorage = (key) => {
    try {
      const raw = localStorage.getItem(`progress:${key}`);
      if (raw) return { ...buildDefaults(schedule), ...JSON.parse(raw) };
    } catch (e) {}
    return buildDefaults(schedule);
  };
  const [progress, setProgress] = useState(() => readFromStorage(initialDate));
  const [loaded, setLoaded] = useState(true);

  // When date changes, load without overwriting storage first
  useEffect(() => {
    setLoaded(false);
    const next = readFromStorage(dateKey);
    setProgress(next);
    setLoaded(true);
  }, [dateKey, schedule]);

  // Persist on change (skip until initial load done)
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(`progress:${dateKey}`, JSON.stringify(progress));
    } catch (e) {}
  }, [dateKey, progress, loaded]);

  const toggle = useCallback((category, itemKey) => {
    setProgress((prev) => ({
      ...prev,
      [category]: { ...prev[category], [itemKey]: !prev[category][itemKey] },
    }));
  }, []);

  const resetToday = useCallback(() => {
    const defaults = buildDefaults(schedule);
    setProgress(defaults);
    try {
      localStorage.setItem(`progress:${dateKey}`, JSON.stringify(defaults));
    } catch (e) {}
  }, [dateKey, schedule]);

  const stats = useMemo(() => {
    // Exercises should be counted per-day (today only)
    const dayName = indoDayName(dateKey);
    const exerciseEntries = Object.entries(progress.exercises || {}).filter(([k]) =>
      dayName ? k.startsWith(`${dayName}::`) : true
    );
    const exercisesDone = exerciseEntries.filter(([, v]) => !!v).length;
    const exercisesTotal = exerciseEntries.length;

    const mealEntries = Object.entries(progress.meals || {}).filter(([k]) =>
      mealsData.some((r) => r.time === k)
    );
    const recoveryEntries = Object.entries(progress.recovery || {}).filter(([k]) =>
      recoveryData.some((r) => r.activity === k)
    );

    const countTrue = (entries) => entries.filter(([, v]) => !!v).length;
    const len = (entries) => entries.length;
    return {
      exercises: { done: exercisesDone, total: exercisesTotal },
      meals: { done: countTrue(mealEntries), total: len(mealEntries) },
      recovery: { done: countTrue(recoveryEntries), total: len(recoveryEntries) },
    };
  }, [progress, dateKey]);

  const exportToday = useCallback(() => {
    const blob = new Blob([
      JSON.stringify({ date: dateKey, ...progress }, null, 2),
    ], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress-${dateKey}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [dateKey, progress]);

  const exportAll = useCallback(() => {
    const all = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('progress:')) {
        try { all[k.replace('progress:', '')] = JSON.parse(localStorage.getItem(k)); } catch (e) {}
      }
    }
    const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress-all.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const importProgress = useCallback(async (file) => {
    const text = await file.text();
    try {
      const json = JSON.parse(text);
      // Accept either single day object or a map of days
      if (json && json.date) {
        localStorage.setItem(`progress:${json.date}`, JSON.stringify({
          exercises: json.exercises || {},
          meals: json.meals || {},
          recovery: json.recovery || {},
        }));
      } else {
        Object.entries(json || {}).forEach(([date, obj]) => {
          localStorage.setItem(`progress:${date}`, JSON.stringify(obj));
        });
      }
      // Reload today if same date
      const key = `progress:${dateKey}`;
      const raw = localStorage.getItem(key);
      if (raw) setProgress({ ...buildDefaults(schedule), ...JSON.parse(raw) });
    } catch (e) {
      console.warn('Failed to import progress JSON', e);
    }
  }, [dateKey, schedule]);

  // Schedule mutators
  const setCustomSchedule = useCallback((nextSchedule) => {
    try {
      localStorage.setItem('schedule:custom', JSON.stringify(nextSchedule));
    } catch {}
    setCustomScheduleState(nextSchedule);
    // Refresh today's progress keys with new defaults
    setProgress((prev) => ({ ...buildDefaults(nextSchedule), ...prev }));
  }, []);

  const resetSchedule = useCallback(() => {
    try { localStorage.removeItem('schedule:custom'); } catch {}
    setCustomScheduleState(null);
    setProgress((prev) => ({ ...buildDefaults(scheduleData), ...prev }));
  }, []);

  const value = useMemo(() => ({ dateKey, setDateKey, progress, toggle, resetToday, stats, exportToday, exportAll, importProgress, schedule, setCustomSchedule, resetSchedule }), [dateKey, progress, toggle, resetToday, stats, exportToday, exportAll, importProgress, schedule, setCustomSchedule, resetSchedule]);

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
