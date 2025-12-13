export default function FilterPanel({
  models,
  selectedModel,
  setSelectedModel,
}) {
  return (
    <div className="p-4 bg-white shadow rounded-lg flex gap-6 items-center">
      <div className="flex flex-col">
        <label className="text-gray-600 mb-1 text-sm">Model</label>
        <select
          className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          {models.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
