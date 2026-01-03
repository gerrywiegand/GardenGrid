import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function NavBar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <nav
      style={{
        display: "flex",
        gap: 12,
        padding: 12,
        borderBottom: "1px solid #ddd",
      }}
    >
      <Link to="/home">Home</Link>
      <button onClick={handleLogout} style={{ marginLeft: "auto" }}>
        Logout
      </button>
    </nav>
  );
}
