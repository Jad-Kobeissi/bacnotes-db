"use client";
import Loading from "@/app/loadingComp";
import Nav from "@/app/Nav";
import { TPost } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";

export default function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [editButtonDisabled, setEditButtonDisabled] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const files = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchPost = async () => {
    axios
      .get(`/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        alert("Error fetching post: " + err.response.data);
        setLoading(false);
      });
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
        className="flex items-center justify-center flex-col h-screen"
        onSubmit={(e) => {
          e.preventDefault();
          if (editButtonDisabled) return;
          setEditButtonDisabled(true);
          const formData = new FormData();
          formData.append("title", title);
          formData.append("content", content);
          files.current?.files &&
            Array.from(files.current.files).map((file) => {
              formData.append("images", file);
            });
          axios
            .put(`/api/posts/${id}`, formData, {
              headers: {
                Authorization: `Bearer ${getCookie("token")}`,
              },
            })
            .then((res) => {
              alert("Post updated successfully");
              router.push(`/post/${id}`);
            })
            .catch((err) => {
              alert("Error updating post: " + err.response.data);
            })
            .finally(() => setEditButtonDisabled(false));
        }}
      >
        <div className="flex flex-col gap-3 items-center">
          <Input
            placeholder={title}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder={content}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Input type="file" multiple accept="image/*" ref={files} />
          <Button disabled={editButtonDisabled}>Edit</Button>
        </div>
      </form>
    </>
  );
}
