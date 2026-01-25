"use client";
import { useUser } from "@/app/contexts/UserContext";
import Nav from "@/app/Nav";
import { TNote } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = useUser();
  const [note, setNote] = useState<TNote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { id } = React.use(params);
  const router = useRouter();
  const fetchNote = () => {
    setLoading(true);
    axios
      .get(`/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setNote(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchNote();
  }, []);

  return (
    <>
      <Nav />
      <div
        className="border border-(--border-color) px-5 py-3 rounded-md flex flex-col items-center justify-center h-screen"
        key={note?.id as string}
      >
        <h1 className="text-[1.2rem] capitalize">{note?.author.name}</h1>
        <h1 className="text-[1.5rem] font-semibold">{note?.title}</h1>
        <p className="text-(--secondary-text)">{note?.content}</p>
        <div className="flex overflow-x-scroll snap-x snap-mandatory max-w-[600px] w-full">
          {note?.imageUrls.map((url, index) => (
            <img
              key={index}
              alt={`Image ${index + 1}`}
              src={url as string}
              className="object-contain rounded-md snap-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                window.open(url as string, "_blank");
              }}
            />
          ))}
        </div>
        {note?.authorId == user?.id && (
          <div className="flex items-center gap-2">
            <button
              className="bg-red-500 text-white px-6 py-1 font-semibold rounded-md my-5 border border-red-500 hover:bg-transparent hover:text-red-500 transition-all duration-200 active:bg-transparent active:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                axios
                  .delete(`/api/notes/${note?.id}`, {
                    headers: {
                      Authorization: `Bearer ${getCookie("token")}`,
                    },
                  })
                  .then(() => {
                    alert("Note deleted successfully");
                    router.push("/profile/notes");
                  })
                  .catch((err) => {
                    alert("Error deleting note: " + err.response.data);
                  });
              }}
            >
              Delete
            </button>
            <button
              className="button"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/notes/edit/${note?.id}`);
              }}
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </>
  );
}
