"use client";
import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
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
    <p>loading...</p>
  ) : (
    <>
      <h1 className="text-[1.3rem]">Stage 2</h1>
      <form
        className="flex flex-col gap-2 items-center justify-center"
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
              alert("Signed Up");
              deleteCookie("children");
              router.push("/home");
            })
            .catch((err) => {
              setError(err.response.data);
              setLoadnig(false);
            });
        }}
      >
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col gap-2">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="child-select">Who are you?</label>
          <select
            id="child-select"
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
      </form>
    </>
  );
}
