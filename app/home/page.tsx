"use client";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { TPost } from "../types";
import axios from "axios";
import { getCookie } from "cookies-next";
import Nav from "../Nav";
import Loading from "../loadingComp";
import Error from "../Error";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Post from "../Post";

export default function Home() {
  const { user } = useUser();
  const [posts, setPosts] = useState<TPost[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const title = useRef<HTMLInputElement>(null);
  const content = useRef<HTMLTextAreaElement>(null);
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
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
        <h1 className="text-center mt-20 text-[1.5rem] font-semibold">
          Hello {user?.name?.split(" ")[0]}!
        </h1>
        <form
          className="my-10 w-3/4 flex flex-col justify-center mx-4"
          onSubmit={(e) => {
            e.preventDefault();
            setTitleError("");
            setContentError("");
            if (title.current?.value.trim() === "") {
              setTitleError("Please fill title field");
              return;
            } else {
              setTitleError("");
            }
            if (content.current?.value.trim() === "") {
              setContentError("Please fill content field");
              return;
            } else {
              setContentError("");
            }
            axios
              .post(
                `/api/posts`,
                {
                  title: title.current?.value,
                  content: content.current?.value,
                },
                {
                  headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                  },
                }
              )
              .then((res) => {
                if (title.current) title.current.value = "";
                if (content.current) content.current.value = "";
                alert("Post created successfully!");
              })
              .catch((err) => {
                alert(
                  "Error Creating Post: " + err.response?.data || err.message
                );
              });
          }}
        >
          <div>
            <h1 className="text-red-500 mb-1">{titleError}</h1>
            <Input type="text" placeholder="Title" ref={title} />
          </div>
          <div>
            <h1 className="text-red-500 mb-1">{contentError}</h1>
            <Textarea placeholder="Content" className="mt-5" ref={content} />
          </div>
          <button className="button">Post</button>
        </form>
        <InfiniteScroll
          dataLength={posts.length}
          hasMore={hasMore}
          next={fetchPosts}
          loader={
            <Loading className="flex items-center justify-center mt-30 w-full" />
          }
          className="flex items-center my-30 mx-4"
        >
          {posts.map((post) => (
            <Post post={post} key={post.id} />
          ))}
        </InfiniteScroll>
        {error && <Error error={error} className="mt-20 text-[1.2rem]" />}
      </div>
    </>
  );
}
