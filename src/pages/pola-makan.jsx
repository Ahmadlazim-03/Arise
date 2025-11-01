import CardSection from '../components/CardSection';
import Checklist from '../components/Checklist';
import { mealsData } from '../utils/data';
import { useProgress } from '../context/ProgressContext';

export default function PolaMakanPage() {
  const { progress, toggle } = useProgress();
  const items = mealsData.map((r) => ({ key: r.time, label: r.time, description: r.menu }));
  return (
    <div className="space-y-4">
      <CardSection title="🍽️ Pola Makan Harian">
        <Checklist
          caption="Centang makan yang sudah kamu penuhi hari ini."
          items={items}
          values={progress.meals}
          onToggle={(k) => toggle('meals', k)}
        />
      </CardSection>
    </div>
  );
}
