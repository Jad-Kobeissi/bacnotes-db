"use client";
import axios from "axios";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();
  return loading ? (
    <p>loading...</p>
  ) : (
    <>
      <h1>login</h1>
      <form
        className="flex flex-col items-center justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setError("");
          axios
            .post(`/api/login`, { username, identifier, password })
            .then((res) => {
              setCookie("tokenBAC", res.data.token);
              setCookie("token", res.data.customToken);
              alert("User logged in");
              setUser(res.data.user);
              router.push("/home");
            })
            .catch((err) => {
              alert("Error");
              setError(err.response.data);
              setLoading(false);
              console.log(err);
            });
        }}
      >
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="JohnDoe123"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="identifier">SIS Username</label>
          <input
            type="text"
            id="identifier"
            placeholder="JFSIWLNB!@"
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="******"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <button className="button">LogIn</button>
      </form>
    </>
  );
}
