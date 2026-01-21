"use client";
import { useUser } from "@/app/contexts/UserContext";
import Error from "@/app/Error";
import Loading from "@/app/LoadingComp";
import Nav from "@/app/Nav";
import { TPost } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function PostComp({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [post, setPost] = useState<TPost | null>(null);
  const { user } = useUser();
  const router = useRouter();
  const fetchPost = () => {
    setLoading(true);
    setError("");
    axios
      .get(`/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchPost();
  }, []);
  return loading ? (
    <Loading className="flex items-center justify-center h-screen" />
  ) : (
    <>
      <Nav />
      <div className="flex flex-col items-center justify-center h-screen border">
        <h1 className="text-[1.2rem] capitalize">{post?.author.name}</h1>
        <h1 className="text-[1.5rem] font-semibold">{post?.title}</h1>
        <p className="text-(--secondary-text)">{post?.content}</p>
        <div className="flex overflow-x-auto snap-x snap-mandatory max-w-[550px] w-full">
          {post?.imageUrls.map((url, index) => (
            <img
              key={index}
              alt={`Image ${index + 1}`}
              src={url}
              className="object-contain rounded-md max-w-[500px] snap-center snap-mandatory"
              onClick={(e) => {
                e.stopPropagation();
                window.open(url, "_blank");
              }}
            />
          ))}
        </div>
        {post?.authorId == user?.id && (
          <div className="flex items-center gap-2">
            <button
              className="bg-red-500 text-white px-6 py-1 font-semibold rounded-md my-5 border border-red-500 hover:bg-transparent hover:text-red-500 transition-all duration-200 active:bg-transparent active:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                axios
                  .delete(`/api/posts/${post?.id}`, {
                    headers: {
                      Authorization: `Bearer ${getCookie("token")}`,
                    },
                  })
                  .then(() => {
                    alert("Post deleted successfully");
                    router.push("/profile");
                  })
                  .catch((err) => {
                    alert("Error deleting post: " + err.response.data);
                  });
              }}
            >
              Delete
            </button>
            <button
              className="button"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/post/edit/${post?.id}`);
              }}
            >
              Edit
            </button>
          </div>
        )}
        {error && <Error error={error} className="text-[1.2rem] font-medium" />}
      </div>
    </>
  );
}
