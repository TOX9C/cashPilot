import { useEffect, useState } from "react";
import api from "./api";

const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setAuthed(res.data.loggedIn))
      .catch(() => setAuthed(false))
      .finally(() => setLoading(false));
  }, []);

  return { loading, authed };
};

export default useAuth;
