"use client";
import { motion } from "motion/react";
import { useUser } from "../contexts/UserContext";
import Loading from "../LoadingComp";
import Nav from "../Nav";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { TPost } from "../types";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../Post";
import Error from "../Error";

export default function Profile() {
  const { user } = useUser();
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<TPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const fetchPosts = () => {
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
            unfilteredPosts.map((u) => [u.id, u]),
          ).values();

          return Array.from(filteredPosts);
        });
        setPage((prev) => prev + 1);
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  return !user ? (
    <Loading className="flex items-center justify-center h-screen" />
  ) : (
    <>
      <Nav />
      <div className="my-40 flex flex-col items-center justify-center">
        <h1 className="font-medium capitalize text-lg">{user?.name}</h1>
        <div className="flex gap-3 text-(--secondary-text)">
          <motion.p whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
            Followers: {user.followers.length}
          </motion.p>
          <motion.p whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
            Following: {user.following.length}
          </motion.p>
        </div>
      </div>
      <InfiniteScroll
        dataLength={posts.length}
        hasMore={hasMore}
        next={fetchPosts}
        loader={
          <Loading className="flex items-center justify-center mt-30 w-screen" />
        }
        className="w-3/4 mx-6 gap-8 flex flex-col "
      >
        {posts.map((post) => (
          <Post post={post} key={post.id} setPosts={setPosts} />
        ))}
      </InfiniteScroll>
      {error && <Error error={error} className="mt-20 text-[1.3rem]" />}
    </>
  );
}
