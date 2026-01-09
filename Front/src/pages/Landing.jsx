import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Landing() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login"); // "login" or "signup"

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setValidationErrors(null);
    setLoading(true);

    try {
      if (mode === "login") {
        await login(username, password);
        navigate("/home");
      } else {
        await signup(username, password);

        // If signup auto-logs in (token returned), go home
        // If not, switch to login mode and let them login
        navigate("/home");
      }
    } catch (err) {
      try {
        const errorData = JSON.parse(err.message.split("\n\nDetails:\n")[1]);
        setValidationErrors(errorData);
      } catch {
        // If parsing fails, just show the error message
        setError(err.message || "Request failed");
      }
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
          {loading ? "Working..." : mode === "login" ? "Login" : "Sign Up"}
        </button>

        <p style={{ marginTop: 10 }}>
          {mode === "login" ? "No account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            style={{
              textDecoration: "underline",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            {mode === "login" ? "Sign up here" : "Log in here"}
          </button>
        </p>

        {error && (
          <div
            style={{
              border: "1px solid #f00",
              padding: 10,
              backgroundColor: "#fee",
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        {validationErrors && (
          <div
            style={{
              border: "1px solid #f00",
              padding: 10,
              backgroundColor: "#fee",
              marginTop: 10,
            }}
          >
            <strong>Validation Errors:</strong>
            <ul style={{ margin: "8px 0 0 0", paddingLeft: 20 }}>
              {Object.entries(validationErrors).map(([field, errors]) => (
                <li key={field}>
                  <strong>{field}:</strong>{" "}
                  {Array.isArray(errors) ? errors.join(", ") : errors}
                </li>
              ))}
            </ul>
          </div>
        )}

        {mode === "signup" && (
          <div
            style={{
              padding: 10,
              backgroundColor: "#f0f9ff",
              border: "1px solid #bfdbfe",
              fontSize: 14,
              marginTop: 10,
            }}
          >
            <strong>Password Requirements:</strong>
            <ul style={{ margin: "8px 0 0 0", paddingLeft: 20 }}>
              <li>At least 6 characters long</li>
              <li>At least one uppercase letter</li>
              <li>At least one digit</li>
              <li>At least one special character (!@#$%^&*...)</li>
              <li>No spaces allowed</li>
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}
