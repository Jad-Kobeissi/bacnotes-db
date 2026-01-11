"use client";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { TPost } from "../types";
import axios from "axios";
import { getCookie } from "cookies-next";
import Nav from "../Nav";

export default function Home() {
  const { user } = useUser();
  const [posts, setPosts] = useState<TPost[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const fetchPosts = async () => {
    axios
      .get(`/api/posts`, {
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
          sessionStorage.setItem(
            "posts",
            JSON.stringify(Array.from(filteredPosts.values()))
          );
          return Array.from(filteredPosts.values());
        });
      })
      .catch((err) => {
        setError(err.response?.data || "An error occurred");
        setHasMore(false);
      });
  };
  useEffect(() => {
    const savedPosts = sessionStorage.getItem("posts");
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
    fetchPosts();
  }, []);
  return (
    <>
      <Nav />
      <div>
        <h1>Hello {user?.name?.split(" ")[0]}!</h1>
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchPosts}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                border: "1px solid black",
                margin: "10px",
                padding: "10px",
              }}
            >
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <p>
                <i>By {post.author.name}</i>
              </p>
            </div>
          ))}
        </InfiniteScroll>
        {error && <p>{error}</p>}
      </div>
    </>
  );
}
