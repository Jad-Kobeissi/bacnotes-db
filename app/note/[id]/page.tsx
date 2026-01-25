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
        <div className="flex gap-2 border border-black/5 items-center justify-center w-fit my-2 px-4 py-1 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            fill="currentColor"
            className="w-5 fill-(--brand)"
          >
            <path d="M480 576L192 576C139 576 96 533 96 480L96 160C96 107 139 64 192 64L496 64C522.5 64 544 85.5 544 112L544 400C544 420.9 530.6 438.7 512 445.3L512 512C529.7 512 544 526.3 544 544C544 561.7 529.7 576 512 576L480 576zM192 448C174.3 448 160 462.3 160 480C160 497.7 174.3 512 192 512L448 512L448 448L192 448zM224 216C224 229.3 234.7 240 248 240L424 240C437.3 240 448 229.3 448 216C448 202.7 437.3 192 424 192L248 192C234.7 192 224 202.7 224 216zM248 288C234.7 288 224 298.7 224 312C224 325.3 234.7 336 248 336L424 336C437.3 336 448 325.3 448 312C448 298.7 437.3 288 424 288L248 288z" />
          </svg>
          <h1>{note?.subject.toLowerCase()}</h1>
        </div>
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
