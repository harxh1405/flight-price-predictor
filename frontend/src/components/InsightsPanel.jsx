export default function InsightsPanel({
  bestRecord,
  avgRmse,
  stableModel,
  sensitiveModel,
}) {
  return (
    <div className="p-6 bg-white shadow rounded-xl border border-gray-100 space-y-2">
      <h3 className="text-lg font-semibold mb-2">Insights</h3>

      <ul className="text-gray-700 space-y-1 text-sm">
        <li>
          • The best performing model is <b>{bestRecord.model}</b> with an RMSE
          of <b>{bestRecord.rmse.toFixed(2)}</b>.
        </li>
        <li>
          • Average RMSE across all models is <b>{avgRmse.toFixed(2)}</b>.
        </li>
        <li>
          • Most stable model across random states is <b>{stableModel}</b>.
        </li>
        <li>
          • Most sensitive model (most variance) is <b>{sensitiveModel}</b>.
        </li>
        <li>
          • Best results obtained at test-size <b>{bestRecord.test_size}</b> and
          random-state <b>{bestRecord.random_state}</b>.
        </li>
      </ul>
    </div>
  );
}
