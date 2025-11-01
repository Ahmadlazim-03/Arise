/*
  Responsive table that stacks on mobile. Props:
  - columns: [{ key: 'day', header: 'Hari' }, ...]
  - data: [{ day: 'Senin', focus: 'Push', detail: '...' }, ...]
*/
export default function TableComponent({ columns = [], data = [] }) {
  return (
    <div>
      {/* Mobile stacked cards */}
      <div className="md:hidden space-y-3">
        {data.map((row, idx) => (
          <div key={idx} className="card p-4">
            <dl className="grid grid-cols-1 gap-2 text-sm">
              {columns.map((col) => (
                <div key={col.key} className="flex gap-2">
                  <dt className="min-w-28 text-gray-500">{col.header}</dt>
                  <dd className="flex-1 font-medium">{row[col.key]}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-b last:border-0 border-gray-100 dark:border-gray-800">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 align-top">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
