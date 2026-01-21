"use client";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { TPost } from "../types";
import axios from "axios";
import { getCookie } from "cookies-next";
import Nav from "../Nav";
import Error from "../Error";
import Post from "../Post";
import Loading from "../LoadingComp";
import { put } from "@vercel/blob";

export default function Home() {
  const { user } = useUser();
  const [posts, setPosts] = useState<TPost[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [postButtonDisabled, setPostButtonDisabled] = useState(false);
  const title = useRef<HTMLInputElement>(null);
  const content = useRef<HTMLTextAreaElement>(null);
  const [files, setFiles] = useState<File[]>([]);
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
            unfilteredPosts.map((post) => [post.id, post]),
          );
          sessionStorage.setItem(
            "posts",
            JSON.stringify(Array.from(filteredPosts.values())),
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
        <h1 className="text-3xl text-center mt-20">
          Hello {user?.name?.split(" ")[0]}!
        </h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (postButtonDisabled) return;
            setPostButtonDisabled(true);
            let imageUrls: string[] = [];
            await files.forEach(async (file) => {
              const blob = await put(
                `${process.env.NEXT_PUBLIC_POSTS_BUCKET}/${crypto.randomUUID()}-${file.name}`,
                file,
                {
                  access: "public",
                },
              );
              imageUrls.push(blob.url);
            });
            axios
              .post(
                `/api/posts`,
                {
                  title: title.current!.value,
                  content: content.current!.value,
                  files: imageUrls,
                },
                {
                  headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                  },
                },
              )
              .then((res) => {
                if (title.current) title.current.value = "";
                if (content.current) content.current.value = "";
                setFiles([]);
                alert("Posted!");
              })
              .catch((err) => {
                alert(
                  "There was an error posting: " +
                    (err.response?.data || "An error occurred"),
                );
                console.log(err);
              })
              .finally(() => setPostButtonDisabled(false));
          }}
          className="w-3/4 mx-6 my-4 gap-3 flex flex-col"
        >
          <input
            type="text"
            placeholder="Title"
            ref={title}
            className="input w-full"
          />
          <textarea
            placeholder="Content"
            ref={content}
            className="input w-full mt-2"
            onChange={(e) => {
              content.current!.style.height = e.target.scrollHeight + "px";
            }}
          />
          <div className="flex flex-wrap gap-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex gap-2 border border-(--border-color)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  fill="currentColor"
                  className="w-5 fill-black"
                  onClick={() => {
                    setFiles(files.filter((f, i) => i !== index));
                  }}
                >
                  <path d="M504.6 148.5C515.9 134.9 514.1 114.7 500.5 103.4C486.9 92.1 466.7 93.9 455.4 107.5L320 270L184.6 107.5C173.3 93.9 153.1 92.1 139.5 103.4C125.9 114.7 124.1 134.9 135.4 148.5L278.3 320L135.4 491.5C124.1 505.1 125.9 525.3 139.5 536.6C153.1 547.9 173.3 546.1 184.6 532.5L320 370L455.4 532.5C466.7 546.1 486.9 547.9 500.5 536.6C514.1 525.3 515.9 505.1 504.6 491.5L361.7 320L504.6 148.5z" />
                </svg>
                <h1>{file.name}</h1>
              </div>
            ))}
          </div>
          <label htmlFor="file-upload">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              fill="currentColor"
              className="fill-(--brand) w-10"
            >
              <path d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM224 176C250.5 176 272 197.5 272 224C272 250.5 250.5 272 224 272C197.5 272 176 250.5 176 224C176 197.5 197.5 176 224 176zM368 288C376.4 288 384.1 292.4 388.5 299.5L476.5 443.5C481 450.9 481.2 460.2 477 467.8C472.8 475.4 464.7 480 456 480L184 480C175.1 480 166.8 475 162.7 467.1C158.6 459.2 159.2 449.6 164.3 442.3L220.3 362.3C224.8 355.9 232.1 352.1 240 352.1C247.9 352.1 255.2 355.9 259.7 362.3L286.1 400.1L347.5 299.6C351.9 292.5 359.6 288.1 368 288.1z" />
            </svg>
            <input
              type="file"
              id="file-upload"
              multiple
              className="hidden"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            />
          </label>
          <button disabled={postButtonDisabled} className="button">
            Post
          </button>
        </form>
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
            <Post post={post} key={post.id} />
          ))}
        </InfiniteScroll>
        {error && <Error error={error} className="mt-20 text-[1.3rem]" />}
      </div>
    </>
  );
}
