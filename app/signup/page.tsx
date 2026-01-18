"use client";
import axios from "axios";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "../LoadingComp";

export default function Signup() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return loading ? (
    <Loading className="flex items-center justify-center h-screen" />
  ) : (
    <>
      <form
        className="flex flex-col gap-4 items-center justify-center h-screen"
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          axios
            .post(`/api/getChildren`, { identifier, password })
            .then((res) => {
              setCookie("children", JSON.stringify(res.data.children));
              setCookie("tokenBAC", res.data.token);
              router.push("/signup/stage2");
            })
            .catch((err) => {
              setError(err.response.data);
              setLoading(false);
            });
        }}
      >
        <div className="text-center mb-5">
          <h1 className="text-3xl font-medium">Create your account</h1>
          <p className="text-(--secondary-text) text-lg">
            Join the BAOC Connect community today
          </p>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col">
          <label htmlFor="identifier" className="text-[1.2rem]">
            Enter your sis username
          </label>
          <input
            type="text"
            placeholder="JohnDoe123"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="input"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-[1.2rem]">
            Enter your password
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            className="input"
          />
        </div>
        <h1 className="text-(--secondary-text) flex gap-1">
          Already have an account?{" "}
          <Link
            href={"/login"}
            className="hover:underline text-foreground font-medium"
          >
            LogIn
          </Link>
        </h1>
        <button className="button">Next</button>
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
    </>
  );
}
