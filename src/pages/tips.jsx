import { successTips } from '../utils/data';

export default function TipsPage() {
  return (
    <div className="space-y-4 pb-4">
      <div className="card p-4">
        <h3 className="text-lg font-bold mb-2">Tips Sukses Bulking</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
          Panduan untuk mencapai target bulking Anda.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          {successTips.map((tip, idx) => (
            <li key={idx} className="leading-relaxed">{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
