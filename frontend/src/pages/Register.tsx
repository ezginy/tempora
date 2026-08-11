import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Pencil } from "lucide-react";
import { AVATAR_COLORS, AVATAR_KEYS } from "../utils/avatarColors";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatar, setAvatar] = useState(
    () => AVATAR_KEYS[Math.floor(Math.random() * AVATAR_KEYS.length)]
  );
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    try {
      await register({ email, password, username, displayName, avatar });
      navigate("/board");
    } catch (err) {
      setError("Registration failed. Please check your details.");
      console.error("Registration failed: ", err);
    }
  };

  return (
    <div className="p-4 gap-4 text-text-primary bg-surface-page flex flex-col justify-center items-center w-full min-h-screen">
      <h1 className="text-2xl font-bold">Register</h1>

      <div className="flex items-center gap-3 w-full max-w-sm">
        <div className="relative">
          <div
            className={`w-16 h-16 rounded-full ${AVATAR_COLORS[avatar]} flex items-center justify-center text-3xl font-bold text-text-primary`}
          >
            {displayName.charAt(0).toUpperCase() || "?"}
          </div>
          <button
            onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-surface-column border-2 border-surface-page flex items-center justify-center"
          >
            <Pencil size={12} className="text-text-primary" />
          </button>

          {isAvatarPickerOpen && (
            <div className="absolute top-full mt-2 left-0 p-3 rounded-lg bg-surface-card border border-surface-column flex gap-2 flex-wrap w-40 z-10">
              {AVATAR_KEYS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setAvatar(color);
                    setIsAvatarPickerOpen(false);
                  }}
                  className={`w-6 h-6 rounded-full ${AVATAR_COLORS[color]} ${
                    avatar === color
                      ? "ring-2 ring-offset-1 ring-offset-surface-card ring-text-primary"
                      : ""
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className={`p-2 rounded-md bg-surface-card-title text-text-primary flex-1 ${
            error ? "border border-priority-high" : ""
          }`}
        />
      </div>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className={`p-2 rounded-md bg-surface-card-title text-text-primary w-full max-w-sm ${
          error ? "border border-priority-high" : ""
        }`}
      />
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
        onClick={handleRegister}
        className="px-4 py-2 mt-2 rounded-lg bg-accent text-surface-page font-semibold hover:opacity-80 transition-opacity w-full max-w-sm"
      >
        Register
      </button>
    </div>
  );
}

export default Register;
