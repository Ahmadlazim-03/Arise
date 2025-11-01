import CardSection from '../components/CardSection';
import TableComponent from '../components/TableComponent';
import { targetColumns, targetData } from '../utils/data';

export default function TargetPage() {
  return (
    <div className="space-y-4">
      <CardSection title="🎯 Target Kenaikan Berat">
        <TableComponent columns={targetColumns} data={targetData} />
      </CardSection>
    </div>
  );
}
