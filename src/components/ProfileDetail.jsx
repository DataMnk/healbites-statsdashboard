import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, LabelList } from 'recharts';
import '../dashboard.css';

export default function ProfileDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch("/data/patient-profiles.json")
      .then(res => res.json())
      .then(data => {
        const person = data.find(p => p.id === Number(id));
        setProfile(person);
      });
  }, [id]);

  if (!profile) return <p style={{ padding: '2rem' }}>Loading…</p>;

  const macros = [
    { name: 'Protein (g)', value: profile.macronutrients.protein_g },
    { name: 'Carbs (g)', value: profile.macronutrients.carbs_g },
    { name: 'Fat (g)', value: profile.macronutrients.fat_g }
  ];

  const micros = Object.entries(profile.micronutrients).map(([key, val]) => ({
    name: key.replace(/_/g, ' ').replace("mg", "").toUpperCase(),
    value: val
  }));

  const colors = ["#70b340", "#ffc658", "#ff9e80"];

  const conditionColors = {
    hypertension: '#e74c3c',
    diabetes: '#ff6f00',
    dyslipidemia: '#f39c12',
    ckd: '#8e44ad'
  };

  return (
    <div className="profile-detail-container">
      <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>

      <div className="profile-card-detail">
        <div className="profile-avatar">👤</div>
        <div className="profile-info">
          <h1>{profile.name}</h1>
          <p><strong>Age:</strong> {profile.age}</p>
          <p><strong>BMI:</strong> {profile.bmi} ({profile.bmiCategory})</p>
          <p><strong>Calories/day:</strong> {profile.recommendedCalories}</p>
          <div className="conditions">
            {profile.conditions.length > 0 ? profile.conditions.map((cond, index) => (
              <span key={index} className="pill" style={{ backgroundColor: conditionColors[cond] || '#3498db' }}>
                {cond.charAt(0).toUpperCase() + cond.slice(1)}
              </span>
            )) : <span>No chronic conditions</span>}
          </div>
        </div>
      </div>

      <div className="charts">
        <div className="chart-item">
          <h3>Macronutrients</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={macros} dataKey="value" nameKey="name" outerRadius={100} label>
                {macros.map((_, index) => (
                  <Cell key={index} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-item">
          <h3>Micronutrients (mg)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart layout="vertical" data={micros}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip />
              <Bar dataKey="value" fill="#70b340">
                <LabelList dataKey="value" position="right" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
