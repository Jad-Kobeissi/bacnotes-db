"use client";
import Error from "@/app/Error";
import Loading from "@/app/LoadingComp";
import Nav from "@/app/Nav";
import { TPost } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const files = useRef<HTMLInputElement>(null);
  const fetchPost = () => {
    setLoading(true);
    axios
      .get(`/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setTitle(res.data.title as string);
        setContent(res.data.content as string);
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchPost();
  }, []);
  const router = useRouter();
  return loading ? (
    <Loading className="flex items-center justify-center h-screen" />
  ) : (
    <>
      <Nav />
      <form
        className="flex flex-col items-center justify-center h-screen gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          const formData = new FormData();
          formData.append("title", title);
          formData.append("content", content);
          Array.from(files.current?.files || []).forEach((file) => {
            formData.append("files", file);
          });
          axios
            .put(`/api/posts/${id}`, formData, {
              headers: {
                Authorization: `Bearer ${getCookie("token")}`,
              },
            })
            .then((res) => {
              alert("Post updated");
              router.push(`/post/${id}`);
            })
            .catch((err) => {
              alert("Error updating post: " + err.response.data);
              setLoading(false);
            });
        }}
      >
        <input
          type="text"
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="input"
          placeholder="Content"
          value={content}
          onChange={(e) => {
            e.target.style.height = e.target.scrollHeight + "px";
            setContent(e.target.value);
          }}
        />
        <input className="input" type="file" ref={files} multiple />
        <button className="button">Edit</button>
      </form>
      {error && (
        <Error error={error} className="text-center mt-20 text-[1.2rem]" />
      )}
    </>
  );
}
