"use client";
import axios from "axios";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import Link from "next/link";
import Loading from "../loadingComp";
import Error from "../Error";

export default function Login() {
  const [username, setUsername] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();
  return loading ? (
    <Loading className="flex items-center justify-center h-screen" />
  ) : (
    <>
      <form
        className="flex flex-col items-center justify-center h-screen gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setError("");
          axios
            .post(`/api/login`, { username, identifier, password })
            .then((res) => {
              setCookie("tokenBAC", res.data.token);
              setCookie("token", res.data.customToken);
              setUser(res.data.user);
              router.push("/home");
            })
            .catch((err) => {
              setError(err.response.data);
              setLoading(false);
              console.log(err);
            });
        }}
      >
        <div className="text-center">
          <h1 className="text-[1.6rem] font-medium">Welcome back!</h1>
          <p className="text-(--secondary-text) text-[1.1rem]">
            Sign In to your BAC account
          </p>
        </div>
        {error && <Error error={error} />}
        <div className="flex flex-col">
          <label htmlFor="username" className="text-[1.2rem]">
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="JohnDoe123"
            className="input"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="identifier" className="text-[1.2rem]">
            SIS Username
          </label>
          <input
            type="text"
            id="identifier"
            placeholder="JFSIWLNB!@"
            className="input"
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-[1.2rem]">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="******"
            className="input"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Link
          href="/signup"
          className="text-(--secondary-text) text-[1rem] hover:underline active:underline"
        >
          Don't Have An Account? Sign Up
        </Link>
        <button className="button">LogIn</button>
        <div className="w-3/4 h-[.1rem] bg-(--seperator-color)" />
        <div>
          <Link
            href={"/"}
            className="text-[1.2rem] font-semibold text-(--secondary-text) flex items-center gap-2"
          >
            <svg
              className="w-5"
              fill="#797b81"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
            >
              <path d="M73.4 297.4C60.9 309.9 60.9 330.2 73.4 342.7L233.4 502.7C245.9 515.2 266.2 515.2 278.7 502.7C291.2 490.2 291.2 469.9 278.7 457.4L173.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L173.3 288L278.7 182.6C291.2 170.1 291.2 149.8 278.7 137.3C266.2 124.8 245.9 124.8 233.4 137.3L73.4 297.3z" />
            </svg>
            Back To Home
          </Link>
        </div>
      </form>
    </>
  );
}
