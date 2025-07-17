import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ padding: "4rem", textAlign: "center" }}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! This page doesn't exist.</p>
      <Link to="/dashboard">← Go back to Dashboard</Link>
    </div>
  );
}
