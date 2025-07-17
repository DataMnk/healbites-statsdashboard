import './dashboard.css';
import ProfileCard from './components/ProfileCard';
import StatSummary from './components/StatSummary';
import RecipeExplorer from './components/RecipeExplorer';

export default function App() {
  return (
    <div className="dashboard">
      <header>
        <h1 className="header-title">Healbites AI - Family Nutrition Dashboard</h1>
        <p className="header-subtitle">Personalized Overview</p>
      </header>
      <div className="dashboard-content">
        <section className="card sidebar">
          <ProfileCard />
        </section>
        <div className="right-column">
          <section className="card">
            <StatSummary />
          </section>
          <section className="card">
            <RecipeExplorer />
          </section>
        </div>
      </div>
    </div>
  );
}
