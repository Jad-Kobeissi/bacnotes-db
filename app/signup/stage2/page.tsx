"use client";
import Error from "@/app/Error";
import Loading from "@/app/loadingComp";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SecondStage() {
  const [learners, setLearners] = useState<Array<any>>([]);
  const [selectedLearner, setSelectedLearner] = useState<string>("");
  const [username, setUsername] = useState<any>();
  const [loading, setLoadnig] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => {
    setLearners(JSON.parse(getCookie("children") as string) || []);
  }, []);
  return loading ? (
    <Loading className="flex items-center justify-center h-screen" />
  ) : (
    <>
      <form
        className="flex flex-col gap-3 items-center justify-center h-screen"
        onSubmit={(e) => {
          e.preventDefault();
          setLoadnig(true);
          console.log(username);
          console.log(learners);

          axios
            .post(`/api/signup`, {
              username,
              learner: JSON.parse(selectedLearner),
            })
            .then((res) => {
              setCookie("token", res.data.token);
              deleteCookie("children");
              router.push("/home");
            })
            .catch((err) => {
              setError(err.response.data);
              setLoadnig(false);
            });
        }}
      >
        <div className="flex items-center justify-center text-center flex-col">
          <h1 className="text-[1.4rem]">Step 2: Profile Setup</h1>
          <p className="text-(--secondary-text) w-3/4">
            Please create a username for your account and select the
            corresponding child profile.
          </p>
        </div>
        {error && <Error error={error} />}
        <div className="flex flex-col">
          <label htmlFor="username" className="text-[1.2rem]">
            Username
          </label>
          <input
            type="text"
            className="input"
            id="username"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="child-select" className="text-[1.2rem]">
            Who are you?
          </label>
          <select
            id="child-select"
            className="input"
            onChange={(e) => {
              setSelectedLearner(e.target.value);
              console.log(e.target.value);
            }}
          >
            <option value="">Pick a child</option>
            {learners.map((learner, index) => (
              <option key={index} value={JSON.stringify(learner)}>
                {learner.learner}
              </option>
            ))}
          </select>
        </div>
        <button className="button">SignUp</button>
        <div className="w-3/4 h-[.1rem] bg-(--seperator-color)" />
        <div>
          <Link
            href={"/signup"}
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
            Back To Step 1
          </Link>
        </div>
      </form>
    </>
  );
}
