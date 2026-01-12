"use client";
import { motion } from "motion/react";
import { useUser } from "../contexts/UserContext";
import Nav from "../Nav";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TPost } from "../types";
import axios from "axios";
import { getCookie } from "cookies-next";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../loadingComp";
import Error from "../Error";
import Post from "../Post";

export default function Profile() {
  const { user } = useUser();
  const router = useRouter();
  const [posts, setPosts] = useState<TPost[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fetchPosts = async () => {
    axios
      .get(`/api/posts/user/${user?.id}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setPosts((prev) => {
          const unfilteredPosts = [...prev, ...res.data];
          const filteredPosts = new Map(
            unfilteredPosts.map((post) => [post.id, post])
          );

          console.log(Array.from(filteredPosts.values()));

          return Array.from(filteredPosts.values());
        });
        setPage((prev) => prev + 1);
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };
  useEffect(() => {
    if (!user) return;
    fetchPosts();
  }, [user]);
  return !user ? (
    <Loading className="flex items-center justify-center h-screen" />
  ) : (
    <>
      <Nav />
      <div className="mt-30">
        <div className="flex items-center justify-center flex-col">
          <h1 className="capitalize text-[1.2rem] font-semibold">
            {user?.name}
          </h1>
          <div className="flex gap-4 text-(--secondary-text)">
            <motion.h1
              onClick={() => router.push(`/user/followers/${user?.id}`)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.9 }}
            >
              Followers: {user?.followers.length}
            </motion.h1>
            <motion.h1
              onClick={() => router.push(`/user/following/${user?.id}`)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.9 }}
            >
              Following: {user?.following.length}
            </motion.h1>
          </div>
        </div>

        <InfiniteScroll
          dataLength={posts.length}
          hasMore={hasMore}
          next={fetchPosts}
          loader={
            <Loading className="flex items-center justify-center mt-30 w-3/4" />
          }
          className="flex items-center my-30 mx-4"
        >
          {posts.map((post) => (
            <Post post={post} key={post.id} />
          ))}
        </InfiniteScroll>
        {error && <Error error={error} className="mt-30" />}
      </div>
    </>
  );
}
