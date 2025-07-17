import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProfileCard() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetch("/data/patient-profiles.json")
      .then(res => res.json())
      .then(setProfiles);
  }, []);

  return (
    <>
      <h2 className="card-title">Family Members</h2>
      {profiles.map(p => (
        <div key={p.id} className="profile-item">
          <h3>{p.name}</h3>
          <p>{p.conditions.length ? p.conditions.join(", ") : "No conditions"}</p>
          <Link to={`/profile/${p.id}`}>View Details →</Link>
        </div>
      ))}
    </>
  );
}
