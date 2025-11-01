import TableComponent from '../components/TableComponent';
import { targetColumns, targetData } from '../utils/data';

export default function TargetPage() {
  return (
    <div className="space-y-4 pb-4">
      <div className="card p-4">
        <h3 className="text-lg font-bold mb-2">Target Kenaikan Berat</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
          Target progres berat badan per periode waktu.
        </p>
        <TableComponent columns={targetColumns} data={targetData} />
      </div>
    </div>
  );
}
