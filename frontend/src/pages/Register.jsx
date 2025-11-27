import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState([]);
  const handleLogin = async () => {
    const res = await api.post("/auth/register", { username, password });
    setMessage(res.data.message);
    if (res.data.message === "seccess") {
      navigate("/");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {message &&
        message.map((message, index) => {
          return <div key={index}>{message}</div>;
        })}
      <div>
        <button onClick={handleLogin}>Register</button>
        <button onClick={() => navigate("/login")}>
          Do you already have an account?
        </button>
      </div>
    </div>
  );
};

export default Register;
