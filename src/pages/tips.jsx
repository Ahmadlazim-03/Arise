import CardSection from '../components/CardSection';
import { successTips } from '../utils/data';

export default function TipsPage() {
  return (
    <div className="space-y-4">
      <CardSection title="🧠 Tips Sukses Bulking">
        <ul className="list-disc pl-5 space-y-2">
          {successTips.map((tip, idx) => (
            <li key={idx} className="leading-relaxed">{tip}</li>
          ))}
        </ul>
      </CardSection>
    </div>
  );
}
