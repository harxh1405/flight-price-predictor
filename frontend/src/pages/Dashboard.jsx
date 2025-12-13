import { useState } from "react";
import TabMenu from "../components/TabMenu";
import MetricCard from "../components/MetricCard";
import FilterPanel from "../components/FilterPanel";
import LineMetricChart from "../components/LineMetricsChart"; // FIXED IMPORT
import BarMetricsChart from "../components/BarMetricsChart";
import InsightsPanel from "../components/InsightsPanel";

import { Trophy, Activity, BarChart3 } from "lucide-react";
import { dashboardData } from "../dashboardData";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedModel, setSelectedModel] = useState("XGBoost");

  // MODEL LIST
  const models = [...new Set(dashboardData.map((d) => d.model))];

  // FILTERED DATA FOR SELECTED MODEL
  const selectedModelData = dashboardData.filter(
    (d) => d.model === selectedModel
  );

  // BEST PERFORMER RECORD
  const bestRecord = dashboardData.reduce((best, r) =>
    r.rmse < best.rmse ? r : best
  );

  // ----------------------------------------
  // 🔥 NEW ADDED STATISTICS FOR INSIGHTS PANEL
  // ----------------------------------------

  // 1️⃣ Average RMSE
  const avgRmse =
    dashboardData.reduce((sum, r) => sum + r.rmse, 0) / dashboardData.length;

  // 2️⃣ Calculate model variance → most stable + most sensitive models
  const modelVariance = {};
  models.forEach((m) => {
    const values = dashboardData
      .filter((d) => d.model === m)
      .map((d) => d.rmse);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance =
      values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
    modelVariance[m] = variance;
  });

  const mostStableModel = Object.entries(modelVariance).reduce((a, b) =>
    a[1] < b[1] ? a : b
  )[0];

  const mostSensitiveModel = Object.entries(modelVariance).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];

  // ----------------------------------------
  // UI
  // ----------------------------------------
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">
        FlightSense Dashboard
      </h1>

      <FilterPanel
        models={models}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />

      <TabMenu activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ----------------------------------------
          OVERVIEW TAB
         ---------------------------------------- */}
      {activeTab === "overview" && (
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* ROW 1 — METRIC CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Best RMSE"
              value={bestRecord.rmse.toFixed(3)}
              subtitle={bestRecord.model}
              icon={Trophy}
              color="blue"
              sparkData={selectedModelData.map((d) => ({ value: d.rmse }))}
              trend={-1}
            />

            <MetricCard
              title="Top Model"
              value={bestRecord.model}
              subtitle={`RS: ${bestRecord.random_state}, TS: ${bestRecord.test_size}`}
              icon={Activity}
              color="green"
              sparkData={selectedModelData.map((d) => ({ value: d.r2 }))}
              trend={1}
            />

            <MetricCard
              title="Total Evaluations"
              value={dashboardData.length}
              subtitle="All trained configurations"
              icon={BarChart3}
              color="purple"
              trend={0}
              sparkData={dashboardData.map((d) => ({ value: d.rmse }))}
            />
          </div>

          {/* ROW 2 — AI-STYLE INSIGHTS PANEL */}
          <InsightsPanel
            bestRecord={bestRecord}
            avgRmse={avgRmse}
            stableModel={mostStableModel}
            sensitiveModel={mostSensitiveModel}
          />
        </motion.div>
      )}

      {/* ----------------------------------------
          METRICS TAB
         ---------------------------------------- */}
      {activeTab === "metrics" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <BarMetricsChart data={selectedModelData} model={selectedModel} />
        </motion.div>
      )}

      {/* ----------------------------------------
          EVALUATION TAB
         ---------------------------------------- */}
      {activeTab === "evaluation" && (
        <motion.div
          className="space-y-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <LineMetricChart
            data={dashboardData}
            metric="rmse"
            title="RMSE vs Test Size"
          />
          <LineMetricChart
            data={dashboardData}
            metric="mae"
            title="MAE vs Test Size"
          />
          <LineMetricChart
            data={dashboardData}
            metric="r2"
            title="R² vs Test Size"
          />
        </motion.div>
      )}

      {/* ----------------------------------------
          STABILITY TAB
         ---------------------------------------- */}
      {activeTab === "stability" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <LineMetricChart
            data={dashboardData}
            metric="rmse"
            xKey="random_state"
            title="RMSE Stability Across Random States"
          />
        </motion.div>
      )}
    </div>
  );
}
