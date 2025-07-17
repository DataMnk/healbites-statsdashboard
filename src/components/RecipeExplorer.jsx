import { useState } from 'react';
import '../dashboard.css';

const APP_ID = import.meta.env.VITE_EDAMAM_APP_ID;
const APP_KEY = import.meta.env.VITE_EDAMAM_APP_KEY;
const USER_ID = import.meta.env.VITE_EDAMAM_USER_ID;
const MAIN_QUERY = "dinner";

export default function RecipeExplorer() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);

  const fetchRecipe = async () => {
    setLoading(true);
    setError(null);
    setRecipe(null);

    try {
      let url = `https://api.edamam.com/api/recipes/v2?type=public&q=${MAIN_QUERY}&app_id=${APP_ID}&app_key=${APP_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      const bannedCuisines = banList.filter(a => a.type === "cuisine").map(a => a.value);
      const bannedLabels = banList.filter(a => a.type === "health").map(a => a.value);

      const filtered = data.hits.filter(({ recipe }) => {
        if (recipe.cuisineType?.some(c => bannedCuisines.includes(c))) return false;
        if (recipe.healthLabels?.some(h => bannedLabels.includes(h))) return false;
        return true;
      });

      if (!filtered.length) setError("No recipes found matching your filters.");
      else {
        const randomRecipe = filtered[Math.floor(Math.random() * filtered.length)].recipe;
        setRecipe(randomRecipe);
        setHistory(prev => prev[0]?.uri === randomRecipe.uri ? prev : [randomRecipe, ...prev]);
      }
    } catch {
      setError("Error fetching recipe. Please try again!");
    }
    setLoading(false);
  };

  const handleBan = (type, value) => {
    if (!banList.some(a => a.type === type && a.value === value)) {
      setBanList([...banList, { type, value }]);
    }
  };

  const handleRemoveBan = (type, value) => {
    setBanList(banList.filter(a => !(a.type === type && a.value === value)));
  };

  return (
    <div className="recipe-explorer">
      <h2 className="card-title">Food Suggestions</h2>
      <button onClick={fetchRecipe}>
        {loading ? "Loading..." : "Discover a Recipe"}
      </button>

      <div className="ban-list">
        <strong>Ban List:</strong>
        {banList.length === 0 && <span style={{ color: '#888', marginLeft: 8 }}>None</span>}
        {banList.map(attr => (
          <span
            key={attr.type + attr.value}
            className="pill pill-ban"
            onClick={() => handleRemoveBan(attr.type, attr.value)}
          >
            {attr.value}
          </span>
        ))}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {recipe && (
        <div>
          <h3>{recipe.label}</h3>
          <img src={recipe.image} alt={recipe.label} className="recipe-image" />

          <div>
            <strong>Ingredients:</strong>
            <ul className="ingredient-list">
              {recipe.ingredientLines.map((line, i) => <li key={i}>{line}</li>)}
            </ul>
          </div>

          {recipe.cuisineType?.length > 0 && (
            <div>
              <strong>Cuisine:</strong>{" "}
              {recipe.cuisineType.map(c => (
                <span
                  key={c}
                  className="pill pill-cuisine"
                  onClick={() => handleBan("cuisine", c)}
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {recipe.healthLabels?.length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <strong>Health Labels:</strong>{" "}
              {recipe.healthLabels.slice(0, 3).map(h => (
                <span
                  key={h}
                  className="pill pill-health"
                  onClick={() => handleBan("health", h)}
                >
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="history">
          <h4>Viewed Recipes:</h4>
          <div className="history">
            {history.slice(0, 5).map(r => (
              <div key={r.uri} className="history-item">
                <img src={r.image} alt={r.label} />
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>{r.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
