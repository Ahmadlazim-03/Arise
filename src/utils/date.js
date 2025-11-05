// Small date utilities

// Convert a date key (YYYY-MM-DD) into Indonesian day name
// Minggu, Senin, Selasa, Rabu, Kamis, Jumat, Sabtu
export function indoDayName(dateKey) {
  try {
    if (!dateKey) return null;
    const [y, m, d] = String(dateKey).split('-').map((x) => parseInt(x, 10));
    if (!y || !m || !d) return null;
    const dt = new Date(y, m - 1, d);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[dt.getDay()];
  } catch {
    return null;
  }
}

// Today in YYYY-MM-DD (kept here if needed elsewhere)
export function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
