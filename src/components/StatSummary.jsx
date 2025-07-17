import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import CountUp from "react-countup";
import "../dashboard.css";

export default function StatSummary() {
  const [profiles, setProfiles] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [maxCalories, setMaxCalories] = useState(3000);

  useEffect(() => {
    fetch("/data/patient-profiles.json")
      .then(res => res.json())
      .then(setProfiles);
  }, []);

  const allConditions = Array.from(new Set(profiles.flatMap(p => p.conditions))).filter(Boolean);

  const filtered = profiles
    .filter(p => selectedCondition ? p.conditions.includes(selectedCondition) : true)
    .filter(p => p.recommendedCalories <= maxCalories);

  const total = filtered.length;
  const chronicCount = filtered.filter(p => p.conditions.length > 0).length;
  const chronicPercent = total > 0 ? Math.round((chronicCount / total) * 100) : 0;
  const avgCalories = total > 0 ? Math.round(filtered.reduce((sum, p) => sum + p.recommendedCalories, 0) / total) : 0;

  const bmiCats = { Normal: 0, Overweight: 0, Obese: 0, Other: 0 };
  filtered.forEach(p => {
    const cat = p.bmiCategory?.toLowerCase();
    if (cat?.includes("normal")) bmiCats.Normal++;
    else if (cat?.includes("overweight")) bmiCats.Overweight++;
    else if (cat?.includes("obese")) bmiCats.Obese++;
    else bmiCats.Other++;
  });

  const bmiChartData = [
    { name: "Normal", value: bmiCats.Normal },
    { name: "Overweight", value: bmiCats.Overweight },
    { name: "Obese", value: bmiCats.Obese },
    { name: "Other", value: bmiCats.Other }
  ];

  const chronicData = [
    { name: "Chronic", value: chronicCount },
    { name: "Non-Chronic", value: total - chronicCount }
  ];

  const mostActive = filtered.reduce((prev, curr) => curr.recommendedCalories > (prev?.recommendedCalories || 0) ? curr : prev, null);
  const leastActive = filtered.reduce((prev, curr) => curr.recommendedCalories < (prev?.recommendedCalories || Infinity) ? curr : prev, null);

  return (
    <div className="dashboard-summary">
      <h2 className="card-title">Family Statistics</h2>

      <div className="filters">
        <label>Filter by condition:</label>
        <select value={selectedCondition} onChange={e => setSelectedCondition(e.target.value)}>
          <option value="">All conditions</option>
          {allConditions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <label>Max Calories: {maxCalories} kcal</label>
        <input
          type="range"
          min="0"
          max="3000"
          step="50"
          value={maxCalories}
          onChange={e => setMaxCalories(+e.target.value)}
          className="progress-bar"
        />
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <h4>Total Members</h4>
          <CountUp end={total} duration={1.5} />
        </div>
        <div className="kpi-card">
          <h4>% Chronic</h4>
          <CountUp end={chronicPercent} suffix="%" duration={1.5} />
        </div>
        <div className="kpi-card">
          <h4>Avg. Calories</h4>
          <CountUp end={avgCalories} suffix=" kcal" duration={1.5} />
        </div>
      </div>

      <div className="charts">
        <div className="chart-item">
          <h4>Chronic Condition %</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={chronicData} dataKey="value" outerRadius={80} label>
                <Cell fill="#70b340" />
                <Cell fill="#ccc" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-item">
          <h4>BMI Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart layout="vertical" data={bmiChartData}>
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Bar dataKey="value" fill="#82ca9d" />
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="highlight-cards">
        {mostActive && (
          <div className="highlight-card most-active">
            <h4>🏆 Most Active</h4>
            <p>{mostActive.name}</p>
            <p>{mostActive.recommendedCalories} kcal</p>
          </div>
        )}
        {leastActive && (
          <div className="highlight-card least-active">
            <h4>🥱 Least Active</h4>
            <p>{leastActive.name}</p>
            <p>{leastActive.recommendedCalories} kcal</p>
          </div>
        )}
      </div>
    </div>
  );
}
