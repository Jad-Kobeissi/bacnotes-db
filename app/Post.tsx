"use client";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { TPost } from "./types";
import { useUser } from "./contexts/UserContext";
import axios from "axios";
import { getCookie } from "cookies-next";
import { Dispatch, SetStateAction } from "react";

export default function Post({
  post,
  setPosts,
}: {
  post: TPost;
  setPosts?: Dispatch<SetStateAction<TPost[]>>;
}) {
  const router = useRouter();
  const { user } = useUser();
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.95 }}
      key={post.id}
      onClick={() => router.push(`/post/${post.id}`)}
      className="border border-(--border-color) px-5 py-3 rounded-md w-full"
    >
      <h1 className="text-[1.2rem] capitalize">{post.author.name}</h1>
      <h1 className="text-[1.5rem] font-semibold">{post.title}</h1>
      <p className="text-(--secondary-text)">{post.content}</p>
      <div className="flex overflow-x-auto snap-x snap-mandatory max-w-[550px] w-full">
        {post.imageUrls.map((url, index) => (
          <img
            key={index}
            alt={`Image ${index + 1}`}
            src={url}
            className="object-contain rounded-md max-w-[500px]"
            onClick={(e) => {
              e.stopPropagation();
              window.open(url, "_blank");
            }}
          />
        ))}
      </div>
      {post.authorId == user?.id && (
        <button
          className="bg-red-500 text-white px-6 py-1 font-semibold rounded-md my-5 border border-red-500 hover:bg-transparent hover:text-red-500 transition-all duration-200 active:bg-transparent active:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            axios
              .delete(`/api/posts/${post.id}`, {
                headers: {
                  Authorization: `Bearer ${getCookie("token")}`,
                },
              })
              .then(() => {
                alert("Post deleted successfully");
                setPosts &&
                  setPosts((posts) => posts.filter((p) => p.id !== post.id));
              })
              .catch((err) => {
                alert("Error deleting post: " + err.response.data);
              });
          }}
        >
          Delete
        </button>
      )}
    </motion.div>
  );
}
