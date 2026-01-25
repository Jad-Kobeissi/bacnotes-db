"use client";
import { useEffect, useRef, useState } from "react";
import { TNote } from "../types";
import { useUser } from "../contexts/UserContext";
import axios from "axios";
import { getCookie } from "cookies-next";
import Nav from "../Nav";
import { useRouter } from "next/navigation";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";
import imageCompression from "browser-image-compression";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../LoadingComp";
import Error from "../Error";
import Note from "../Note";
export default function Notes() {
  const [notes, setNotes] = useState<TNote[]>([]);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [postButtonDisabled, setPostButtonDisabled] = useState(false);
  const title = useRef<HTMLInputElement>(null);
  const content = useRef<HTMLTextAreaElement>(null);
  const subject = useRef<HTMLSelectElement>(null);
  const files = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const router = useRouter();
  const fetchNotes = () => {
    axios
      .get(`/api/notes`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setNotes((prev) => {
          const unfiltered = [...prev, ...res.data];

          const filtered = new Map(unfiltered.map((note) => [note.id, note]));

          return Array.from(filtered.values());
        });
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };
  useEffect(() => {
    fetchNotes();
  }, []);
  return (
    <>
      <Nav />
      <div className="mt-20">
        <h1 className="my-15 text-center text-[1.8rem] font-medium">Notes</h1>
        <form
          className="flex flex-col gap-4 w-3/4 mx-6"
          onSubmit={async (e) => {
            e.preventDefault();
            setPostButtonDisabled(true);
            let imageUrls: string[] = [];
            try {
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
                  console.log("Attempt 2");

                  return await getDownloadURL(imageRef);
                }),
              );
            } catch (error) {
              alert("Error uploading images: " + (error as any).message);
            }

            axios
              .post(
                `/api/notes`,
                {
                  title: title.current?.value,
                  content: content.current?.value,
                  subject: subject.current?.value,
                  files: imageUrls,
                },
                {
                  headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                  },
                },
              )
              .then((res) => {
                alert("Note posted successfully");
                router.push("/profile");
              })
              .catch((err) => {
                console.log(err);
                alert("Error posting note: " + err.response.data);
              })
              .finally(() => setPostButtonDisabled(false));
          }}
        >
          <input
            type="text"
            placeholder="Title"
            ref={title}
            className="input"
          />
          <textarea
            placeholder="Content"
            ref={content}
            className="input"
            onChange={(e) => {
              content.current!.style.height = e.target.scrollHeight + "px";
            }}
          />
          <input
            type="file"
            placeholder="Upload files"
            className="input"
            multiple
            ref={files}
          />
          <select name="subject" id="subject" ref={subject} className="input">
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
          <button disabled={postButtonDisabled} className="button">
            Post
          </button>
        </form>
      </div>
      <InfiniteScroll
        dataLength={notes.length}
        hasMore={hasMore}
        next={fetchNotes}
        loader={<Loading className="flex items-center justify-center mt-30" />}
      >
        {notes.map((note) => (
          <Note key={note.id as string} note={note} />
        ))}
      </InfiniteScroll>
      {error && (
        <Error error={error} className="text-[1.2rem] mt-20 font-medium" />
      )}
    </>
  );
}
