"use client";
import Nav from "@/app/Nav";
import { motion } from "motion/react";
import { TPost, TUser } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { use, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "@/app/LoadingComp";
import Post from "@/app/Post";
import { useRouter } from "next/navigation";

export default function User({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [user, setUser] = useState<TUser | null>(null);
  const [posts, setPosts] = useState<TPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const router = useRouter();
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
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => setLoading(false));
  };
  const fetchPosts = () => {
    axios
      .get(`/api/posts/user/${id}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setPosts((prev) => {
          const unfiltered = [...prev, ...res.data];

          const filtered = new Map(
            unfiltered.map((item) => [item.id, item]),
          ).values();

          return Array.from(filtered);
        });
        setPage((prev) => prev + 1);
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };
  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  return (
    <>
      <Nav />
      <div className="text-center my-30">
        <h1 className="text-[1.2rem] font-medium capitalize">{user?.name}</h1>
        <div className="text-(--secondary-text) flex gap-3 justify-center">
          <motion.h1
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => router.push(`/user/followers/${id}`)}
          >
            Followers: {user?.followers.length}
          </motion.h1>
          <motion.h1
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => router.push(`/user/following/${id}`)}
          >
            Following: {user?.following.length}
          </motion.h1>
        </div>
      </div>
      <InfiniteScroll
        hasMore={hasMore}
        next={fetchPosts}
        dataLength={posts.length}
        loader={<Loading className="flex items-center justify-center mt-30 " />}
        className="flex items-center justify-center flex-col gap-5"
      >
        {posts.map((post) => (
          <Post
            post={post}
            key={post.id}
            className="flex items-center flex-col w-fit border border-(--border-color) px-20"
          />
        ))}
      </InfiniteScroll>
    </>
  );
}
