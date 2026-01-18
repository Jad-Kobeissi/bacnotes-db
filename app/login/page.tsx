"use client";
import axios from "axios";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import Link from "next/link";
import Loading from "../LoadingComp";

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
    <div>
      <form
        className="flex flex-col items-center justify-center h-screen"
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
        <div className="text-center mb-5">
          <h1 className="text-3xl font-medium">Welcome Back</h1>
          <p className="text-(--secondary-text) text-lg">
            Sign in to your BAC Connect account
          </p>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col">
            <label htmlFor="username" className="text-[1.2rem]">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="JohnDoe123"
              onChange={(e) => setUsername(e.target.value)}
              className="input"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[1.2rem]" htmlFor="identifier">
              SIS Username
            </label>
            <input
              type="text"
              id="identifier"
              placeholder="JFSIWLNB!@"
              onChange={(e) => setIdentifier(e.target.value)}
              className="input"
            />
            <div className="flex flex-col">
              <label htmlFor="password" className="text-[1.2rem]">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="******"
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
            </div>
          </div>

          <h1 className="text-(--secondary-text) flex gap-1">
            Don't have an account?{" "}
            <Link
              href={"/signup"}
              className="hover:underline text-foreground font-medium"
            >
              Sign up
            </Link>
          </h1>
          <button className="button font-semibold">LogIn</button>
        </div>
        <div className="w-full flex flex-col items-center justify-center">
          <div className="w-3/4 bg-[#dedede] h-[.1rem] my-4"></div>
          <Link
            href={"/"}
            className="text-[1.2rem] flex gap-2 items-center hover:underline font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5"
              viewBox="0 0 640 640"
            >
              <path d="M73.4 297.4C60.9 309.9 60.9 330.2 73.4 342.7L233.4 502.7C245.9 515.2 266.2 515.2 278.7 502.7C291.2 490.2 291.2 469.9 278.7 457.4L173.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L173.3 288L278.7 182.6C291.2 170.1 291.2 149.8 278.7 137.3C266.2 124.8 245.9 124.8 233.4 137.3L73.4 297.3z" />
            </svg>
            Back
          </Link>
        </div>
      </form>
    </div>
  );
}
