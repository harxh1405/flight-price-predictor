import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plane,
  Clock4,
  MapPin,
  CalendarDays,
  Navigation,
  Gauge,
  CheckCircle,
  Loader2,
  Route,
} from "lucide-react";

export default function Predict() {
  const [formData, setFormData] = useState({
    airline: "",
    source: "",
    destination: "",
    total_stops: "",
    duration_hours: "",
    duration_minutes: "",
    journey_date: "",
    dep_time: "",
    arrival_time: "",
    route: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const airlines = [
    "IndiGo",
    "Air India",
    "Vistara",
    "SpiceJet",
    "GoAir",
    "AirAsia India",
    "Alliance Air",
  ];

  const cities = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Kolkata",
    "Chennai",
    "Hyderabad",
    "Pune",
  ];

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    setErr("");

    const body = {
      ...formData,
      duration:
        Number(formData.duration_hours) * 60 +
        Number(formData.duration_minutes),
    };

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      setPrediction(data.predicted_price);
    } catch {
      setErr("Something went wrong while predicting the price. Try again.");
    }

    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <h1 className="text-3xl font-bold text-gray-800">Predict Ticket Price</h1>

      {err && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg">
          {err}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 space-y-6 border"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FloatingSelect
            label="Airline"
            icon={<Plane className="text-blue-500" size={18} />}
            value={formData.airline}
            onChange={(v) => updateField("airline", v)}
            options={airlines}
          />

          <FloatingSelect
            label="Source"
            icon={<MapPin className="text-green-500" size={18} />}
            value={formData.source}
            onChange={(v) => updateField("source", v)}
            options={cities}
          />

          <FloatingSelect
            label="Destination"
            icon={<Navigation className="text-purple-500" size={18} />}
            value={formData.destination}
            onChange={(v) => updateField("destination", v)}
            options={cities}
          />

          <FloatingSelect
            label="Total Stops"
            icon={<Gauge className="text-amber-500" size={18} />}
            value={formData.total_stops}
            onChange={(v) => updateField("total_stops", v)}
            options={["non-stop", "1 stop", "2 stops", "3 stops", "4 stops"]}
          />

          <FloatingInput
            label="Duration (Hours)"
            type="number"
            icon={<Clock4 className="text-orange-500" size={18} />}
            value={formData.duration_hours}
            onChange={(v) => updateField("duration_hours", v)}
          />

          <FloatingInput
            label="Duration (Minutes)"
            type="number"
            icon={<Clock4 className="text-orange-500" size={18} />}
            value={formData.duration_minutes}
            onChange={(v) => updateField("duration_minutes", v)}
          />

          <FloatingInput
            label="Journey Date"
            type="date"
            icon={<CalendarDays className="text-teal-500" size={18} />}
            value={formData.journey_date}
            onChange={(v) => updateField("journey_date", v)}
          />

          <FloatingInput
            label="Departure Time"
            type="time"
            icon={<Clock4 className="text-rose-500" size={18} />}
            value={formData.dep_time}
            onChange={(v) => updateField("dep_time", v)}
          />

          <FloatingInput
            label="Arrival Time"
            type="time"
            icon={<Clock4 className="text-rose-500" size={18} />}
            value={formData.arrival_time}
            onChange={(v) => updateField("arrival_time", v)}
          />

          <FloatingInput
            label="Route"
            type="text"
            icon={<Route className="text-slate-500" size={18} />}
            value={formData.route}
            onChange={(v) => updateField("route", v)}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-blue-600 text-white text-lg font-semibold
                     hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Predict Price"
          )}
        </button>
      </form>

      {/* PREDICTION RESULT */}
      {prediction !== null && (
        <motion.div
          className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-lg max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center gap-3">
            <CheckCircle size={36} className="text-blue-600" />
            <h2 className="text-xl font-bold text-blue-700">
              Price Prediction
            </h2>
          </div>

          <p className="text-4xl font-extrabold mt-3 text-blue-900">
            ₹{prediction}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

/* -------------------------------
   REUSABLE COMPONENTS
-------------------------------- */

function FloatingInput({ label, type, value, onChange, icon }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3">{icon}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-3 py-3 border rounded-lg peer focus:ring-blue-500 focus:border-blue-500"
        required
      />
      <label className="absolute left-10 -top-2 text-xs bg-white px-2 text-blue-600">
        {label}
      </label>
    </div>
  );
}

function FloatingSelect({ label, icon, value, onChange, options }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3">{icon}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-3 py-3 border rounded-lg peer focus:ring-blue-500 focus:border-blue-500"
        required
      >
        <option value="">Select {label}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <label className="absolute left-10 -top-2 text-xs bg-white px-2 text-blue-600">
        {label}
      </label>
    </div>
  );
}
