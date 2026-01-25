"use client";
import axios from "axios";
import moment from "moment";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import Nav from "../Nav";
import { TAgendaItem } from "../types";
import { useRouter } from "next/navigation";
import Loading from "../LoadingComp";

export default function AgendaPage() {
  const [agenda, setAgenda] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [week, setWeek] = useState<string>("4");
  const router = useRouter();
  const fetchAgenda = async (week: string) => {
    setLoading(true);
    alert("running");
    await axios
      .get(`/api/agenda?week=${week}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          tokenBAC: getCookie("tokenBAC") as string,
        },
      })
      .then(async (res) => {
        setAgenda(res.data);
        console.log(agenda);
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => setLoading(false));
  };
  const fetchAiResponse = async () => {
    if (!agenda || agenda.length == 0) return;
    setLoading(true);
    await axios
      .post(
        `/api/agenda/summarize`,
        {
          agenda,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        },
      )
      .then((res) => {
        setAiResponse(res.data.aiResponse);
      })
      .catch((err) => {
        alert(
          "There was an error generating the summary: " + err.response.data,
        );
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchAgenda(week);
  }, [week]);
  useEffect(() => {
    fetchAiResponse();
  }, [agenda]);
  return (
    <>
      <Nav />
      <div className="mt-40">
        <h1 className="text-[2rem] font-semibold my-20 text-center">
          View Your Agenda
        </h1>
        <div className="flex justify-center">
          <select
            className="input"
            onChange={(e) => {
              alert(e.target.value);
              setWeek(e.target.value);
            }}
            value={week}
          >
            <option value="3">Last Week</option>
            <option value="4">This Week</option>
            <option value="5">Next Week</option>
            <option value="6">2 Weeks From Now</option>
          </select>
        </div>
        {loading ? (
          <Loading className="flex items-center justify-center my-40" />
        ) : (
          <div id="AIsummary" className="my-30">
            <div
              dangerouslySetInnerHTML={{ __html: aiResponse }}
              className="flex flex-col w-3/4 my-20 mx-6"
            />
          </div>
        )}
      </div>
    </>
  );
}
