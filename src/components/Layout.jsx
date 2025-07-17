import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <nav style={{
        position: "fixed",
        top: 0,
        right: 0,
        background: "#70b340",
        padding: "1rem",
        borderRadius: "0 0 0 16px",
        zIndex: 1000
      }}>
        <Link to="/dashboard" style={{ color: "white", fontWeight: "bold", textDecoration: "none" }}>🏠 Dashboard</Link>
      </nav>
      <div style={{ marginTop: "4rem" }}>
        <Outlet />
      </div>
    </>
  );
}
