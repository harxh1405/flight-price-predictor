import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plane,
  MapPin,
  Navigation,
  Gauge,
  Clock4,
  CalendarDays,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function Predict() {
  const [formData, setFormData] = useState({
    airline: "",
    source: "",
    destination: "",
    total_stops: "",
    journey_date: "",
    dep_time: "",
    arrival_time: "",
  });

  const [duration, setDuration] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const airlines = [
    "IndiGo",
    "Air India",
    "Vistara",
    "SpiceJet",
    "GoAir",
    "AirAsia India",
  ];

  const cities = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Kolkata",
    "Chennai",
    "Hyderabad",
  ];

  const stopsMap = {
    "non-stop": 0,
    "1 stop": 1,
    "2 stops": 2,
    "3 stops": 3,
    "4 stops": 4,
  };

  /* -----------------------------
     Helpers
  ----------------------------- */

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });

    if (field === "dep_time" || field === "arrival_time") {
      computeDuration(
        field === "dep_time" ? value : formData.dep_time,
        field === "arrival_time" ? value : formData.arrival_time
      );
    }
  };

  const computeDuration = (dep, arr) => {
    if (!dep || !arr) return;

    let [h1, m1] = dep.split(":").map(Number);
    let [h2, m2] = arr.split(":").map(Number);

    let t1 = h1 * 60 + m1;
    let t2 = h2 * 60 + m2;

    if (t2 < t1) t2 += 24 * 60;
    setDuration(t2 - t1);
  };

  const isFormValid = useMemo(() => {
    return (
      formData.airline &&
      formData.source &&
      formData.destination &&
      formData.source !== formData.destination &&
      formData.total_stops &&
      formData.journey_date &&
      formData.dep_time &&
      formData.arrival_time &&
      duration > 0
    );
  }, [formData, duration]);

  const getHour = (timeStr) => parseInt(timeStr.split(":")[0], 10);

  const getDayMonth = (dateStr) => {
    const d = new Date(dateStr);
    return {
      Journey_Day: d.getDate(),
      Journey_Month: d.getMonth() + 1,
    };
  };

  /* -----------------------------
     UX Hints & Explainability
  ----------------------------- */

  const getTimeHint = () => {
    const h = getHour(formData.dep_time);
    if (h < 6) return "Early morning flights are often cheaper.";
    if (h >= 22) return "Late-night flights can reduce ticket prices.";
    if (h >= 10 && h <= 18)
      return "Midday flights are in higher demand and may cost more.";
    return "Trying a slightly earlier or later departure may reduce the price.";
  };

  const getExplainabilityPoints = () => {
    const points = [];

    if (formData.total_stops === "non-stop") {
      points.push(
        "Non-stop flights usually cost more than connecting flights."
      );
    } else {
      points.push(
        "Flights with stops are generally cheaper than non-stop ones."
      );
    }

    if (duration > 180) {
      points.push("Longer travel duration often lowers ticket price.");
    } else {
      points.push("Shorter travel time can increase ticket cost.");
    }

    const h = getHour(formData.dep_time);
    if (h >= 10 && h <= 18) {
      points.push("Peak daytime hours usually have higher demand.");
    } else {
      points.push("Off-peak hours often provide better pricing.");
    }

    return points;
  };

  /* -----------------------------
     Submit
  ----------------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setPrediction(null);
    setError(null);

    const startTime = Date.now();
    const { Journey_Day, Journey_Month } = getDayMonth(formData.journey_date);

    const payload = {
      Airline: formData.airline,
      Source: formData.source,
      Destination: formData.destination,
      Duration_minutes: duration,
      stops_num: stopsMap[formData.total_stops],
      Dep_Hour: getHour(formData.dep_time),
      Arrival_Hour: getHour(formData.arrival_time),
      Journey_Day,
      Journey_Month,
    };

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      const elapsed = Date.now() - startTime;
      const MIN_LOADING = 1200;

      setTimeout(() => {
        setPrediction(data.predicted_price);
        setLoading(false);
      }, Math.max(0, MIN_LOADING - elapsed));
    } catch {
      setError("We couldn’t estimate the price right now. Please try again.");
      setLoading(false);
    }
  };

  /* -----------------------------
     UI
  ----------------------------- */

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">
        Estimate Flight Ticket Price
      </h1>

      {error && (
        <motion.div
          className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-xl flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AlertTriangle size={18} />
          <span>{error}</span>
        </motion.div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`bg-white rounded-2xl shadow-lg p-8 space-y-8 ${
          loading ? "opacity-70 pointer-events-none" : ""
        }`}
      >
        <Section title="Flight Details">
          <FieldSelect
            label="Airline"
            icon={<Plane className="text-blue-500" />}
            options={airlines}
            value={formData.airline}
            onChange={(v) => updateField("airline", v)}
          />
          <FieldSelect
            label="Source"
            icon={<MapPin className="text-green-500" />}
            options={cities}
            value={formData.source}
            onChange={(v) => updateField("source", v)}
          />
          <FieldSelect
            label="Destination"
            icon={<Navigation className="text-purple-500" />}
            options={cities}
            value={formData.destination}
            onChange={(v) => updateField("destination", v)}
            error={
              formData.source === formData.destination && formData.destination
            }
          />
          <FieldSelect
            label="Total Stops"
            icon={<Gauge className="text-amber-500" />}
            options={Object.keys(stopsMap)}
            value={formData.total_stops}
            onChange={(v) => updateField("total_stops", v)}
          />
        </Section>

        <Section title="Time & Duration">
          <FieldInput
            label="Departure Time"
            type="time"
            icon={<Clock4 className="text-rose-500" />}
            value={formData.dep_time}
            onChange={(v) => updateField("dep_time", v)}
          />
          <FieldInput
            label="Arrival Time"
            type="time"
            icon={<Clock4 className="text-rose-500" />}
            value={formData.arrival_time}
            onChange={(v) => updateField("arrival_time", v)}
          />
          {duration && (
            <p className="text-sm text-gray-600">
              Estimated Duration:{" "}
              <b>
                {Math.floor(duration / 60)}h {duration % 60}m
              </b>
            </p>
          )}
        </Section>

        <Section title="Journey Date">
          <FieldInput
            label="Journey Date"
            type="date"
            icon={<CalendarDays className="text-teal-500" />}
            value={formData.journey_date}
            onChange={(v) => updateField("journey_date", v)}
          />
        </Section>

        <button
          disabled={!isFormValid || loading}
          className={`w-full py-3 rounded-xl text-lg font-semibold ${
            isFormValid
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          {loading ? "Analyzing flight data..." : "Estimate Ticket Price"}
        </button>

        {loading && (
          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ul className="space-y-1">
              <li>• Analyzing similar routes</li>
              <li>• Evaluating airline pricing patterns</li>
              <li>• Factoring time & duration</li>
            </ul>
          </motion.div>
        )}
      </form>

      {prediction && !loading && (
        <motion.div
          className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-2xl shadow"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="text-blue-600" />
            <h2 className="text-xl font-bold text-blue-700">
              Estimated Ticket Price
            </h2>
          </div>

          <p className="text-4xl font-extrabold mt-4 text-blue-900">
            ₹{prediction.toLocaleString()}
          </p>

          <p className="text-sm text-blue-700 mt-2">
            Likely range: ₹{Math.round(prediction * 0.9).toLocaleString()} – ₹
            {Math.round(prediction * 1.1).toLocaleString()}
          </p>

          <p className="text-sm text-indigo-700 mt-3">💡 {getTimeHint()}</p>

          <div className="mt-4 bg-white/70 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Why this price?
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {getExplainabilityPoints().map((p, i) => (
                <li key={i}>• {p}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setPrediction(null)}
            className="mt-4 px-4 py-2 text-sm rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            Try another combination
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* Reusable Components */

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}

function FieldInput({ label, type, value, onChange, icon }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3">{icon}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-3 py-3 border rounded-lg"
        required
      />
      <label className="absolute left-10 -top-2 text-xs bg-white px-2 text-blue-600">
        {label}
      </label>
    </div>
  );
}

function FieldSelect({ label, options, value, onChange, icon, error }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3">{icon}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full pl-10 pr-3 py-3 border rounded-lg ${
          error ? "border-red-400" : ""
        }`}
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
