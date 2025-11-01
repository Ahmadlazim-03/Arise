import CardSection from '../components/CardSection';
import Checklist from '../components/Checklist';
import { recoveryData } from '../utils/data';
import { useProgress } from '../context/ProgressContext';

export default function IstirahatPage() {
  const { progress, toggle } = useProgress();
  const items = recoveryData.map((r) => ({ key: r.activity, label: r.activity, description: r.detail }));
  return (
    <div className="space-y-4">
      <CardSection title="😴 Istirahat & Recovery">
        <Checklist
          caption="Centang aktivitas pemulihan yang sudah dilakukan."
          items={items}
          values={progress.recovery}
          onToggle={(k) => toggle('recovery', k)}
        />
      </CardSection>
    </div>
  );
}
