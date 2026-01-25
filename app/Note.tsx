import axios from "axios";
import { motion } from "motion/react";
import { TNote } from "./types";
import { getCookie } from "cookies-next";
import { useUser } from "./contexts/UserContext";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

export default function Note({
  note,
  setNotes,
}: {
  note: TNote;
  setNotes?: Dispatch<SetStateAction<TNote[]>>;
}) {
  const { user } = useUser();
  const router = useRouter();
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.95 }}
      className="border border-(--border-color) px-5 py-3 rounded-md"
      onClick={() => router.push(`/note/${note.id}`)}
      key={note.id as string}
    >
      <h1 className="text-[1.2rem] capitalize">{note.author.name}</h1>
      <h1 className="text-[1.5rem] font-semibold">{note.title}</h1>
      <p className="text-(--secondary-text)">{note.content}</p>
      <div className="flex overflow-x-scroll snap-x snap-mandatory max-w-[600px] w-full">
        {note.imageUrls.map((url, index) => (
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
      {note.authorId == user?.id && (
        <div className="flex items-center gap-2">
          <button
            className="bg-red-500 text-white px-6 py-1 font-semibold rounded-md my-5 border border-red-500 hover:bg-transparent hover:text-red-500 transition-all duration-200 active:bg-transparent active:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              axios
                .delete(`/api/notes/${note.id}`, {
                  headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                  },
                })
                .then(() => {
                  setNotes &&
                    setNotes((prev) => prev.filter((n) => n.id !== note.id));
                  alert("Note deleted successfully");
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
              router.push(`/notes/edit/${note.id}`);
            }}
          >
            Edit
          </button>
        </div>
      )}
    </motion.div>
  );
}
