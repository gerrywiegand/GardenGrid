import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Landing() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/home");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{ maxWidth: 420, margin: "48px auto", fontFamily: "system-ui" }}
    >
      <h1>GardenGrid</h1>
      <p>MVP: Login + protected API fetch.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <button disabled={loading} style={{ padding: 10 }}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <div style={{ border: "1px solid #f00", padding: 10 }}>
            Error: {error}
          </div>
        )}
      </form>
    </div>
  );
}
