import { TJWT, TPost } from "@/app/types";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { decode, verify } from "jsonwebtoken";
import sharp from "sharp";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const decoded = decode(authHeader) as TJWT;

    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          not: decoded.id,
        },
        viewedUsers: {
          none: {
            id: decoded.id,
          },
        },
      },
      include: {
        author: true,
        viewedUsers: true,
        likedUsers: true,
      },
    });

    if (posts.length == 0) return new Response("No new posts", { status: 404 });

    await Promise.all(
      posts.map((post) => {
        return prisma.post.update({
          where: {
            id: post.id,
          },
          data: {
            viewedUsers: {
              connect: {
                id: decoded.id,
              },
            },
          },
        });
      }),
    );

    return Response.json(posts);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const decoded = decode(authHeader) as { id: string };

    // Verify user exists in database
    const userExists = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!userExists) {
      return new Response("User not found. Please log in again.", {
        status: 404,
      });
    }

    const { title, content, files } = await req.json();

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: decoded.id,
        imageUrls: files,
      },
    });

    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new Response(error?.message || "Internal Server Error", {
      status: 500,
    });
  }
}
