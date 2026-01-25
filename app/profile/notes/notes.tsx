"use client";
import { motion } from "motion/react";
import { useUser } from "../../contexts/UserContext";
import Loading from "../../LoadingComp";
import Nav from "../../Nav";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { TNote, TPost } from "../../types";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../../Post";
import Error from "../../Error";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Note from "@/app/Note";

export default function Profile() {
  const { user } = useUser();
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [notes, setNotes] = useState<TNote[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const fetchNotes = () => {
    console.log(user);
    axios
      .get(`/api/notes/user/${user?.id}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setNotes((prev) => {
          const unfilteredNotes = [...prev, ...res.data];

          const filteredNotes = new Map(
            unfilteredNotes.map((u) => [u.id, u]),
          ).values();

          return Array.from(filteredNotes);
        });
        setPage((prev) => prev + 1);
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };
  useEffect(() => {
    fetchNotes();
  }, []);
  return !user ? (
    <Loading className="flex items-center justify-center h-screen" />
  ) : (
    <>
      <Nav />
      <div className="my-40 flex flex-col items-center justify-center">
        <h1 className="font-medium capitalize text-lg">{user?.name}</h1>
        <div className="flex gap-3 text-(--secondary-text)">
          <motion.p whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
            Followers: {user.followers.length}
          </motion.p>
          <motion.p whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
            Following: {user.following.length}
          </motion.p>
        </div>
      </div>
      <div className="text-[1.2rem] flex gap-4 items-center justify-center">
        <Link href={`/profile`} className="text-(--secondary-text)">
          Posts
        </Link>
        <Link href={`/profile/notes`}>Notes</Link>
      </div>
      <InfiniteScroll
        dataLength={notes.length}
        hasMore={hasMore}
        next={fetchNotes}
        loader={
          <Loading className="flex items-center justify-center mt-30 w-screen" />
        }
        className="w-3/4 mx-6 gap-8 flex flex-col "
      >
        {notes.map((note) => (
          <Note key={note.id as string} note={note} setNotes={setNotes} />
        ))}
      </InfiniteScroll>
      {error && <Error error={error} className="mt-20 text-[1.3rem]" />}
    </>
  );
}
