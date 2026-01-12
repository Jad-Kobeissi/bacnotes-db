"use client";
import axios from "axios";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "../loadingComp";
import Error from "../Error";

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
            })
            .finally(() => setLoading(false));
        }}
      >
        <div className="text-center">
          <h1 className="text-[1.6rem] font-medium">Step 1: SIS LogIn</h1>
          <p className="text-(--secondary-text) text-[1.1rem]">
            Enter your SIS credentials
          </p>
        </div>
        {error && <Error error={error} />}
        <div className="flex flex-col">
          <label htmlFor="identifier" className="text-[1.2rem]">
            SIS Username
          </label>
          <input
            type="text"
            className="input"
            placeholder="JohnDoe123"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-[1.2rem]">
            SIS Password
          </label>
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
          />
        </div>
        <Link
          href="/login"
          className="text-(--secondary-text) text-[1rem] hover:underline active:underline"
        >
          Already Have An Account? LogIn
        </Link>
        <button className="button">Next</button>
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
