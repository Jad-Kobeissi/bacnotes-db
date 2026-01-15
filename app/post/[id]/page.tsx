"use client";
import { useUser } from "@/app/contexts/UserContext";
import Error from "@/app/Error";
import Loading from "@/app/loadingComp";
import Nav from "@/app/Nav";
import { TPost } from "@/app/types";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user, setUser } = useUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const { id } = React.use(params);
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(false);
  const router = useRouter();
  const [post, setPost] = useState<TPost | null>(null);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const fetchPost = async () => {
    setLoading(true);
    await axios
      .get(`/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        console.log(err);
        setError(err.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchPost();
  }, []);
  useEffect(() => {
    if (!user || !post) return;

    setLikes(post.likes);
    setLiked(post.likedUsers.some((u) => u.id === user.id));

    setIsFollowing(user.following.some((u) => u.id === post.author.id));
  }, [user, post]);
  return (
    <>
      <Nav />
      {loading ? (
        <Loading className="flex items-center justify-center h-screen" />
      ) : error ? (
        <Error error={error} className="my-60 text-[1.3rem]" />
      ) : (
        <div className="flex flex-col items-center justify-center h-screen gap-1">
          <div className="flex gap-2 items-center">
            <h1 className="capitalize text-[1.1rem] underline">
              {post?.author.name}
            </h1>
            {isFollowing ? (
              <button
                className="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFollowing(false);
                  axios
                    .post(
                      `/api/user/unfollow/${post?.author.id}`,
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
                      `/api/user/follow/${post?.author.id}`,
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
          <h1 className="text-[1.4rem] font-medium">{post?.title}</h1>
          <p className="text-(--secondary-text) text-[1.2rem]">
            {post?.content}
          </p>
          <div className="flex scroll-x overflow-x-auto snap-center snap-mandatory gap-2 my-2 max-w-[650px]">
            {post?.imageUrls.map((url) => (
              <img
                src={url}
                alt="image"
                key={url}
                className="max-w-[600px] w-full snap-center snap-mandatory "
                onClick={(e) => {
                  e.preventDefault();
                  window.open(url, "_blank");
                }}
              />
            ))}
          </div>
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
                      `/api/posts/dislike/${post?.id}`,
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
                      `/api/posts/like/${post?.id}`,
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
          {post?.authorId == user?.id && (
            <div className="flex gap-2">
              <Button
                variant={"destructive"}
                className="font-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteButtonDisabled(true);
                  axios
                    .delete(`/api/posts/${post?.id}`, {
                      headers: {
                        Authorization: `Bearer ${getCookie("token")}`,
                      },
                    })
                    .then((res) => {
                      alert("Post deleted successfully");
                      router.back();
                    })
                    .catch((err) => {
                      alert("Error deleting post: " + err.response.data);
                    })
                    .finally(() => setDeleteButtonDisabled(false));
                }}
                disabled={deleteButtonDisabled}
              >
                Delete
              </Button>
              <Button
                className="bg-(--brand) hover:bg-transparent border border-(--brand) hover:text-(--brand) font-semibold active:bg-transparent active:border-(--brand) active:text-(--brand)"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/post/edit/${post?.id}`);
                }}
              >
                Edit
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
