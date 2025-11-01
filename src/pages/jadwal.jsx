import CardSection from '../components/CardSection';
import Checklist from '../components/Checklist';
import { scheduleData } from '../utils/data';
import { useProgress } from '../context/ProgressContext';

export default function JadwalPage() {
  const { progress, toggle } = useProgress();
  return (
    <div className="space-y-4">
      {scheduleData.map((day) => {
        const items = (day.exercises || []).map((ex) => ({ key: `${day.day}::${ex}`, label: ex }));
        return (
          <CardSection key={day.day} title={`🗓️ ${day.day} • ${day.focus}`}>
            <Checklist
              items={items}
              values={progress.exercises}
              onToggle={(k) => toggle('exercises', k)}
            />
          </CardSection>
        );
      })}
    </div>
  );
}
