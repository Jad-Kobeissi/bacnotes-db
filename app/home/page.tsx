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
  const [postButtonDisabled, setPostButtonDisabled] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const title = useRef<HTMLInputElement>(null);
  const content = useRef<HTMLTextAreaElement>(null);
  const files = useRef<HTMLInputElement>(null);
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
            setPostButtonDisabled(true);
            if (postButtonDisabled) return;
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
            const formData = new FormData();
            formData.append("title", title.current?.value || "");
            formData.append("content", content.current?.value || "");
            if (files.current?.files && files.current.files.length > 0) {
              Array.from(files.current.files).forEach((file) => {
                formData.append("files", file);
              });
            }
            axios
              .post(`/api/posts`, formData, {
                headers: {
                  Authorization: `Bearer ${getCookie("token")}`,
                },
              })
              .then((res) => {
                if (title.current) title.current.value = "";
                if (content.current) content.current.value = "";
                alert("Post created successfully!");
              })
              .catch((err) => {
                alert(
                  "Error Creating Post: " + err.response?.data || err.message
                );
              })
              .finally(() => setPostButtonDisabled(false));
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
          <div className="flex gap-2 items-center justify-between">
            <div>
              <label htmlFor="files">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="files"
                  ref={files}
                  multiple
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  fill="currentColor"
                  className="w-10 fill-(--brand) my-2 cursor-pointer"
                >
                  <path d="M304 112L192 112C183.2 112 176 119.2 176 128L176 512C176 520.8 183.2 528 192 528L448 528C456.8 528 464 520.8 464 512L464 272L376 272C336.2 272 304 239.8 304 200L304 112zM444.1 224L352 131.9L352 200C352 213.3 362.7 224 376 224L444.1 224zM128 128C128 92.7 156.7 64 192 64L325.5 64C342.5 64 358.8 70.7 370.8 82.7L493.3 205.3C505.3 217.3 512 233.6 512 250.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM387.4 496L252.6 496C236.8 496 224 483.2 224 467.4C224 461 226.1 454.9 230 449.8L297.6 362.9C303 356 311.3 352 320 352C328.7 352 337 356 342.4 362.9L410 449.9C413.9 454.9 416 461.1 416 467.5C416 483.3 403.2 496.1 387.4 496.1zM240 288C257.7 288 272 302.3 272 320C272 337.7 257.7 352 240 352C222.3 352 208 337.7 208 320C208 302.3 222.3 288 240 288z" />
                </svg>
              </label>
            </div>
            <button className="button" disabled={postButtonDisabled}>
              Post
            </button>
          </div>
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
