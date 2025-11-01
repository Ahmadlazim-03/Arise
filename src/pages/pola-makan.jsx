import Checklist from '../components/Checklist';
import { mealsData } from '../utils/data';
import { useProgress } from '../context/ProgressContext';
import { useMemo } from 'react';

export default function PolaMakanPage() {
  const { progress, toggle } = useProgress();
  const items = mealsData.map((r) => ({ key: r.time, label: r.time, description: r.menu }));
  
  const completed = items.filter(item => progress.meals[item.key]).length;
  const total = items.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <div className="space-y-4 pb-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold">Pola Makan Harian</h3>
          <span className="text-sm font-semibold text-accent">{completed}/{total}</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
          Centang makan yang sudah kamu penuhi hari ini.
        </p>
        
        {/* Progress Bar */}
        <div className="mb-4 progress-bar-bg">
          <div className="h-full bg-gradient-to-r from-accent via-orange-500 to-accent rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
        </div>
        
        <Checklist
          items={items}
          values={progress.meals}
          onToggle={(k) => toggle('meals', k)}
        />
      </div>
    </div>
  );
}
