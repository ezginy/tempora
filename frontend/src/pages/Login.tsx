import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    try {
      await login(email, password);
      navigate("/board");
    } catch (err) {
      setError("Invalid email or password.");
      console.error("Login failed: ", err);
    }
  };

  return (
    <div className="p-4 gap-4 text-text-primary bg-surface-page flex flex-col justify-center items-center flex-1 min-h-screen">
      <h1 className="text-2xl font-bold">Log in</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`p-2 rounded-md bg-surface-card-title text-text-primary w-full max-w-sm ${
          error ? "border border-priority-high" : ""
        }`}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={`p-2 rounded-md bg-surface-card-title text-text-primary w-full max-w-sm ${
          error ? "border border-priority-high" : ""
        }`}
      />
      {error && <p className="text-priority-high text-sm">{error}</p>}

      <button
        onClick={handleLogin}
        className="px-4 py-2 rounded-lg bg-accent text-surface-page font-semibold hover:opacity-80 transition-opacity w-full max-w-sm"
      >
        Log in
      </button>
    </div>
  );
}

export default Login;
