"use client";
import Error from "@/app/Error";
import Loading from "@/app/LoadingComp";
import Nav from "@/app/Nav";
import { TPost } from "@/app/types";
import { put } from "@vercel/blob";
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
          let imageUrls: string[] = [];
          Array.from(files.current?.files || []).forEach(async (file) => {
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
            .put(
              `/api/posts/${id}`,
              {
                title,
                content,
                files: imageUrls,
              },
              {
                headers: {
                  Authorization: `Bearer ${getCookie("token")}`,
                },
              },
            )
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
