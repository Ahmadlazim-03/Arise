// Static data source for the app

export const scheduleColumns = [
  { key: 'day', header: 'Hari' },
  { key: 'focus', header: 'Fokus Latihan' },
  { key: 'detail', header: 'Detail Latihan' },
];

export const scheduleData = [
  {
    day: 'Senin',
    focus: 'Push Day (Dada, Bahu, Triceps)',
    detail: 'Push-up 4×15, Incline Push-up 3×12, Shoulder Press 4×10, Triceps Dips 3×10, Dumbbell Lateral Raise 3×12',
    exercises: [
      'Push-up 4×15',
      'Incline Push-up 3×12',
      'Shoulder Press 4×10',
      'Triceps Dips 3×10',
      'Dumbbell Lateral Raise 3×12',
    ],
  },
  {
    day: 'Selasa',
    focus: 'Pull Day (Punggung, Biceps)',
    detail: 'Pull-up 4×8, Inverted Row 3×10, Dumbbell Curl 4×10, Hammer Curl 3×12, Dumbbell Row 3×10',
    exercises: [
      'Pull-up 4×8',
      'Inverted Row 3×10',
      'Dumbbell Curl 4×10',
      'Hammer Curl 3×12',
      'Dumbbell Row 3×10',
    ],
  },
  {
    day: 'Rabu',
    focus: 'Leg + Core',
    detail: 'Squat 4×15, Lunges 3×12 per kaki, Calf Raises 3×20, Leg Raises 3×15, Plank 3×45 detik',
    exercises: [
      'Squat 4×15',
      'Lunges 3×12 per kaki',
      'Calf Raises 3×20',
      'Leg Raises 3×15',
      'Plank 3×45 detik',
    ],
  },
  {
    day: 'Kamis',
    focus: 'Istirahat',
    detail: 'Stretching ringan 15–20 menit',
    exercises: [
      'Stretching ringan 15–20 menit',
    ],
  },
  {
    day: 'Jumat',
    focus: 'Full Body',
    detail: 'Burpees 3×10, Push-up 3×15, Pull-up 3×8, Squat 3×15, Plank 3×1 menit',
    exercises: [
      'Burpees 3×10',
      'Push-up 3×15',
      'Pull-up 3×8',
      'Squat 3×15',
      'Plank 3×1 menit',
    ],
  },
  {
    day: 'Sabtu',
    focus: 'Cardio + Abs',
    detail: 'Jogging ringan 20–30 menit, Sit-up 3×20, Bicycle Crunch 3×15, Leg Raise 3×15',
    exercises: [
      'Jogging ringan 20–30 menit',
      'Sit-up 3×20',
      'Bicycle Crunch 3×15',
      'Leg Raise 3×15',
    ],
  },
  {
    day: 'Minggu',
    focus: 'Recovery',
    detail: 'Tidur cukup 8 jam, makan kalori surplus',
    exercises: [
      'Tidur cukup 8 jam',
      'Makan kalori surplus',
    ],
  },
];

export const mealsColumns = [
  { key: 'time', header: 'Waktu' },
  { key: 'menu', header: 'Menu' },
];

export const mealsData = [
  { time: '07.00 – Sarapan', menu: 'Oatmeal + susu, 3 telur (2 putih + 1 utuh), pisang/roti gandum, susu protein' },
  { time: '10.00 – Snack Pagi', menu: 'Kacang almond / selai kacang + buah' },
  { time: '12.30 – Makan Siang', menu: 'Nasi + ayam/ikan/daging + sayur + telur' },
  { time: '16.00 – Snack Sore', menu: 'Susu protein (Rimbamas) + pisang + madu' },
  { time: 'Setelah Workout', menu: '1 scoop protein shake + 5g creatine' },
  { time: '19.30 – Makan Malam', menu: 'Nasi + ayam/daging + tahu/tempe' },
  { time: '22.00 – Sebelum Tidur', menu: 'Susu hangat + telur rebus / keju cottage' },
];

export const targetColumns = [
  { key: 'period', header: 'Periode' },
  { key: 'gain', header: 'Kenaikan Ideal' },
  { key: 'note', header: 'Catatan' },
];

export const targetData = [
  { period: 'Per minggu', gain: '+0.25 – 0.5 kg', note: 'Sebagian besar dari otot' },
  { period: 'Per bulan', gain: '+1 – 2 kg', note: 'Naik perlahan agar otot dominan' },
  { period: '3 bulan', gain: '+3 – 5 kg', note: 'Target realistis untuk ectomorph' },
  { period: '6 bulan', gain: '+5 – 8 kg', note: 'Jika pola makan dan latihan konsisten' },
];

export const recoveryColumns = [
  { key: 'activity', header: 'Kegiatan' },
  { key: 'detail', header: 'Rincian' },
];

export const recoveryData = [
  { activity: 'Tidur malam', detail: 'Minimal 7–9 jam per malam' },
  { activity: 'Waktu tidur ideal', detail: '22.00 – 06.00' },
  { activity: 'Stretching', detail: 'Setelah latihan 10–15 menit' },
  { activity: 'Minum air putih', detail: '2–3 liter per hari' },
  { activity: 'Hari libur (Minggu)', detail: 'Pemulihan otot & makan kalori lebih' },
];

export const successTips = [
  '✅ Minum air cukup (2–3 liter per hari)',
  '✅ Konsumsi protein 1.6–2.2 gram/kg berat badan',
  '✅ Kalori surplus +300–500 kalori dari kebutuhan harian',
  '✅ Tidur cukup dan hindari begadang',
  '✅ Catat progres berat badan mingguan',
  '✅ Fokus pada teknik latihan',
  '✅ Hindari stres dan overtraining',
];
