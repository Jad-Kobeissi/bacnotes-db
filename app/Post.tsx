"use client";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { TPost } from "./types";

export default function Post({ post }: { post: TPost }) {
  const router = useRouter();
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
    </motion.div>
  );
}
