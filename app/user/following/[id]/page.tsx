"use client";
import Error from "@/app/Error";
import Loading from "@/app/LoadingComp";
import Nav from "@/app/Nav";
import { TUser } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { use, useEffect, useState } from "react";

export default function FollowingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [following, setFollowing] = useState<TUser[]>([]);
  const [user, setUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = () => {
    setLoading(true);
    axios
      .get(`/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setUser(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);

        setError(err.response.data);
      })
      .finally(() => setLoading(false));
  };
  const fetchFollowing = () => {
    axios
      .get(`/api/user/following/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setFollowing(res.data);
      })
      .catch((err) => {
        console.log(err);
        setError(err.response.data);
      });
  };
  useEffect(() => {
    fetchUser();
    fetchFollowing();
  }, []);
  return (
    <div>
      <Nav />
      {loading ? (
        <Loading className="flex items-center justify-center mt-60" />
      ) : (
        <div className="py-10 flex flex-col gap-10 items-center justify-center mt-50">
          <h1 className="text-[1.4rem] font-medium">
            Viewing {user?.name}'s Following
          </h1>
          {following.map((followedUser) => (
            <div className="border border-green-500">
              <h1>{followedUser.name}</h1>
            </div>
          ))}
        </div>
      )}
      {error && <Error error={error} className="text-center text-[1.4rem]" />}
    </div>
  );
}
