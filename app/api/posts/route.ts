import { TJWT } from "@/app/types";
import { prisma } from "@/lib/prisma";
import { decode, verify } from "jsonwebtoken";

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

    await posts.forEach(async (post) => {
      await prisma.post.update({
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
    });

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

    const decoded = decode(authHeader) as TJWT;

    const { title, content } = await req.json();

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: decoded.id,
      },
    });

    return Response.json(post);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
