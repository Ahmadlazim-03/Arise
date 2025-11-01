import Checklist from '../components/Checklist';
import { recoveryData } from '../utils/data';
import { useProgress } from '../context/ProgressContext';
import { useMemo } from 'react';

export default function IstirahatPage() {
  const { progress, toggle } = useProgress();
  const items = recoveryData.map((r) => ({ key: r.activity, label: r.activity, description: r.detail }));
  
  const completed = items.filter(item => progress.recovery[item.key]).length;
  const total = items.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <div className="space-y-4 pb-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold">Istirahat & Recovery</h3>
          <span className="text-sm font-semibold text-green-600">{completed}/{total}</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
          Centang aktivitas pemulihan yang sudah dilakukan.
        </p>
        
        {/* Progress Bar */}
        <div className="mb-4 progress-bar-bg">
          <div className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
        </div>
        
        <Checklist
          items={items}
          values={progress.recovery}
          onToggle={(k) => toggle('recovery', k)}
        />
      </div>
    </div>
  );
}
