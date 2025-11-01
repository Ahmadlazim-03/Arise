import Checklist from '../components/Checklist';
import { scheduleData } from '../utils/data';
import { useProgress } from '../context/ProgressContext';
import { useMemo } from 'react';

export default function JadwalPage() {
  const { progress, toggle } = useProgress();
  
  return (
    <div className="space-y-4 pb-4">
      {scheduleData.map((day) => {
        const items = (day.exercises || []).map((ex) => ({ key: `${day.day}::${ex}`, label: ex }));
        const completed = items.filter(item => progress.exercises[item.key]).length;
        const total = items.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return (
          <div key={day.day} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">{day.day}</h3>
              <span className="text-sm font-semibold text-primary">{completed}/{total}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">{day.focus}</p>
            
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
        );
      })}
    </div>
  );
}
