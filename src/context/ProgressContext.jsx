import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { scheduleData, mealsData, recoveryData } from '../utils/data';

const ProgressContext = createContext(null);

const todayKey = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const buildDefaults = () => {
  const exercises = {};
  scheduleData.forEach((row) => {
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
  const readFromStorage = (key) => {
    try {
      const raw = localStorage.getItem(`progress:${key}`);
      if (raw) return { ...buildDefaults(), ...JSON.parse(raw) };
    } catch (e) {}
    return buildDefaults();
  };
  const [progress, setProgress] = useState(() => readFromStorage(initialDate));
  const [loaded, setLoaded] = useState(true);

  // When date changes, load without overwriting storage first
  useEffect(() => {
    setLoaded(false);
    const next = readFromStorage(dateKey);
    setProgress(next);
    setLoaded(true);
  }, [dateKey]);

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
    const defaults = buildDefaults();
    setProgress(defaults);
    try {
      localStorage.setItem(`progress:${dateKey}`, JSON.stringify(defaults));
    } catch (e) {}
  }, [dateKey]);

  const stats = useMemo(() => {
    const countTrue = (obj) => Object.values(obj || {}).filter(Boolean).length;
    const len = (obj) => Object.keys(obj || {}).length;
    return {
      exercises: { done: countTrue(progress.exercises), total: len(progress.exercises) },
      meals: { done: countTrue(progress.meals), total: len(progress.meals) },
      recovery: { done: countTrue(progress.recovery), total: len(progress.recovery) },
    };
  }, [progress]);

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
      if (raw) setProgress({ ...buildDefaults(), ...JSON.parse(raw) });
    } catch (e) {
      console.warn('Failed to import progress JSON', e);
    }
  }, [dateKey]);

  const value = useMemo(() => ({ dateKey, setDateKey, progress, toggle, resetToday, stats, exportToday, exportAll, importProgress }), [dateKey, progress, toggle, resetToday, stats, exportToday, exportAll, importProgress]);

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
