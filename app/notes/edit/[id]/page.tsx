"use client";
import { useUser } from "@/app/contexts/UserContext";
import Loading from "@/app/LoadingComp";
import Nav from "@/app/Nav";
import { TNote } from "@/app/types";
import { storage } from "@/lib/firebase";
import axios from "axios";
import { getCookie } from "cookies-next";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
export default function EditNote({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [note, setNote] = useState<TNote | null>(null);
  const [title, setTitle] = useState("");
  const content = useRef<HTMLTextAreaElement>(null);
  const [subject, setSubject] = useState("");
  const files = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { id } = React.use(params);
  const { user } = useUser();
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
        setTitle(res.data.title);
        if (content.current) content.current.value = res.data.content;
        setSubject(res.data.subject);
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

  return loading ? (
    <Loading className="flex items-center justify-center h-screen" />
  ) : (
    <>
      <Nav />
      <div className="flex-col flex items-center justify-center h-screen">
        <h1 className="text-center text-[1.2rem] font-medium">Editing Note</h1>
        <form
          className="flex flex-col gap-4 justify-center mx-4 "
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            let imageUrls: string[] = note?.imageUrls || [];
            if ((files.current?.files?.length || 0) > 0) {
              await Promise.all(
                (note?.imageUrls || []).map(async (url: string) => {
                  const imageRef = ref(storage, url);

                  await deleteObject(imageRef);
                }),
              );
              imageUrls = await Promise.all(
                Array.from(files.current?.files || []).map(async (file) => {
                  const imageRef = ref(
                    storage,
                    `${process.env.NEXT_PUBLIC_NOTES_BUCKET}/${crypto.randomUUID()}`,
                  );

                  const compressedImage = await imageCompression(file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    fileType: "image/webp",
                    initialQuality: 0.8,
                  });

                  await uploadBytes(imageRef, compressedImage);

                  return await getDownloadURL(imageRef);
                }),
              );
            }
            axios
              .put(
                `/api/notes/${id}`,
                {
                  title,
                  content: content.current?.value,
                  subject,
                  files: imageUrls,
                },
                {
                  headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                  },
                },
              )
              .then((res) => {
                alert("Edited Post");
                router.push(`/note/${id}`);
              })
              .catch((err) => {
                alert("There was an error editing post: " + err.response.data);
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
            ref={content}
            onChange={(e) => {
              content.current!.style.height = e.target.scrollHeight + "px";
            }}
          ></textarea>
          <select
            name="subject"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input"
          >
            <option value="">Select A Subject</option>
            <option value="ENGLISH">English</option>
            <option value="ARABIC">Arabic</option>
            <option value="FRENCH">French</option>
            <option value="MATH">Math</option>
            <option value="BIOLOGY">Biology</option>
            <option value="PHYSICS">Physics</option>
            <option value="CHEMISTRY">Chemistry</option>
            <option value="GEOGRAPHY">Geography</option>
            <option value="HISTORY">History</option>
            <option value="CIVICS">Civics</option>
            {parseInt(user?.class.split("-")[1] as string) >= 10 && (
              <>
                <option value="PHILOSOPHY">Philosophy</option>
                <option value="ECONOMICS">Economics</option>
              </>
            )}
          </select>
          <input type="file" ref={files} />
          <button className="button">Edit</button>
        </form>
      </div>
    </>
  );
}
