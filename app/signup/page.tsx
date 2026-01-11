"use client";
import axios from "axios";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  return (
    <>
      <h1>Signup</h1>
      <form
        className="flex flex-col gap-4 items-center justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          axios
            .post(`/api/getChildren`, { identifier, password })
            .then((res) => {
              setCookie("children", JSON.stringify(res.data.children));
              setCookie("tokenBAC", res.data.token);
              router.push("/signup/stage2");
            })
            .catch((err) => {
              setError(err.response.data);
            });
        }}
      >
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col">
          <label htmlFor="identifier">Enter your sis username</label>
          <input
            type="text"
            placeholder="JohnDoe123"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Enter your password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
          />
        </div>
        <button className="button">Next</button>
      </form>
    </>
  );
}
