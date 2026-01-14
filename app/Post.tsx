import { motion } from "motion/react";
import { TPost } from "./types";
import { useEffect, useOptimistic, useState } from "react";
import { useUser } from "./contexts/UserContext";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { get } from "http";

export default function Post({ post }: { post: TPost }) {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user, setUser } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (!user) return;
    if (!post) return;
    setLiked(post.likedUsers.some((u) => u.id === user.id));
    setLikes(post.likes);

    setIsFollowing(user.following.some((u) => u.id === post.author.id));
  }, [user, post]);
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.9 }}
      key={post.id}
      className="border w-3/4 px-4 py-2"
      onClick={() => router.push(`/post/${post.id}`)}
    >
      <div className="flex gap-2 items-center">
        <h1 className="capitalize text-[1.1rem] underline">
          {post.author.name}
        </h1>
        {isFollowing ? (
          <button
            className="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFollowing(false);
              axios
                .post(
                  `/api/user/unfollow/${post.author.id}`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${getCookie("token")}`,
                    },
                  }
                )
                .then((res) => {
                  setUser(res.data.newUser);
                  sessionStorage.setItem(
                    "user",
                    JSON.stringify(res.data.newUser)
                  );
                })
                .catch((err) => {
                  setIsFollowing(true);
                  alert("Error unfollowing user: " + err.response.data);
                });
            }}
          >
            Unfollow
          </button>
        ) : (
          <button
            className="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFollowing(true);
              axios
                .post(
                  `/api/user/follow/${post.author.id}`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${getCookie("token")}`,
                    },
                  }
                )
                .then((res) => {
                  setUser(res.data.newUser);
                  sessionStorage.setItem(
                    "user",
                    JSON.stringify(res.data.newUser)
                  );
                })
                .catch((err) => {
                  setIsFollowing(false);
                  alert("Error following user: " + err.response.data);
                });
            }}
          >
            Follow
          </button>
        )}
      </div>
      <h1 className="text-[1.2rem] font-medium">{post.title}</h1>
      <p className="text-(--secondary-text)">{post.content}</p>
      <div className="flex items-center gap-2">
        <h1>{likes}</h1>
        {liked ? (
          <div
            className="bg-transparent w-fit h-fit p-2 rounded-full group hover:bg-[#eb4034] active:bg-[#eb4034] border border-[#eb4034] transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              setLiked(false);
              setLikes((prev) => prev - 1);
              axios
                .post(
                  `/api/posts/dislike/${post.id}`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${getCookie("token")}`,
                    },
                  }
                )
                .catch((err) => {
                  alert("Error liking post");
                  setLiked(false);
                  console.log(err);
                  setLikes((prev) => prev + 1);
                });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              className="w-6 fill-[#eb4034] group-hover:fill-white group-active:fill-white"
              fill="currentColor"
            >
              <path d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z" />
            </svg>
          </div>
        ) : (
          <div
            className="bg-[#eb4034] w-fit h-fit p-2 rounded-full group hover:bg-transparent border border-[#eb4034] transition-all duration-200 active:bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              setLiked(true);
              setLikes((prev) => prev + 1);
              axios
                .post(
                  `/api/posts/like/${post.id}`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${getCookie("token")}`,
                    },
                  }
                )
                .catch((err) => {
                  alert("Error liking post");
                  setLiked(false);
                  console.log(err);
                  setLikes((prev) => prev - 1);
                });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              className="w-6 fill-white group-hover:fill-[#eb4034] group-active:fill-[#eb4034]"
              fill="currentColor"
            >
              <path d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z" />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
}
