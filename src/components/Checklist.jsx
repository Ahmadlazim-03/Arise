export default function Checklist({ items = [], values = {}, onToggle, caption }) {
  return (
    <div className="space-y-3">
      {caption && <p className="text-sm text-gray-500">{caption}</p>}
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.key} className="card p-3 flex items-start gap-3">
            <label className="flex items-start gap-3 w-full">
              <input
                type="checkbox"
                checked={!!values[it.key]}
                onChange={() => onToggle(it.key)}
                className="mt-1 h-5 w-5 accent-primary"
              />
              <div className="flex-1">
                <div className="font-medium leading-tight">{it.label}</div>
                {it.description && (
                  <div className="text-xs text-gray-500 mt-1">{it.description}</div>
                )}
              </div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
