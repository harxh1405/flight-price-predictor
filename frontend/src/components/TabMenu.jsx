export default function TabMenu({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "metrics", label: "Metrics" },
    { id: "evaluation", label: "Evaluation" },
    { id: "stability", label: "Stability" },
  ];

  return (
    <div className="flex gap-4 border-b pb-2">
      {tabs.map((t) => (
        <button
          key={t.id}
          className={`pb-2 text-sm font-medium transition-all ${
            activeTab === t.id
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
