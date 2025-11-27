import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async () => {
    const res = await api.post("/auth/login", { username, password });
    console.log(res.data);
    if (res.data.message === "success") {
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
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>
        <button onClick={handleLogin}>Login</button>
        <button onClick={() => navigate("/register")}>
          Dont have an account?
        </button>
      </div>
    </div>
  );
};

export default Login;
