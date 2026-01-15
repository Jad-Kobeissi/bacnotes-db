"use client";
import { motion } from "motion/react";
import { useUser } from "@/app/contexts/UserContext";
import Error from "@/app/Error";
import Loading from "@/app/loadingComp";
import Nav from "@/app/Nav";
import { TUser } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FollowersPage() {
  const [followers, setFollowers] = useState<TUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUser();
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const fetchFollowers = async () => {
    setLoading(true);
    setError("");
    axios
      .get(`/api/user/follow/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setFollowers(res.data.followers);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data || "An error occurred");
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchFollowers();
  }, []);
  return loading ? (
    <Loading className="flex items-center justify-center h-screen" />
  ) : (
    <>
      <Nav />
      <div className="mt-40">
        <h1 className="text-xl font-bold text-center">User Followers</h1>
        <div className="flex flex-col items-center justify-center gap-2">
          {followers.map((follower) => (
            <motion.h1
              key={follower.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                router.push(`/user/${follower.id}`);
              }}
              className="border p-2 px-6 capitalize w-[300px] text-center cursor-pointer hover:bg-gray-200 transition"
            >
              {follower.name}
            </motion.h1>
          ))}
        </div>
        {error && <Error error={error} className="text-center text-[1.2rem]" />}
      </div>
    </>
  );
}
