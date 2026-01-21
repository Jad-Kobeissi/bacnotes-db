import { TJWT } from "@/app/types";
import { prisma } from "@/lib/prisma";
import { decode, verify } from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const decoded = decode(authHeader) as TJWT;

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = 5;
    const skip = (page - 1) * limit;
    const posts = await prisma.post.findMany({
      where: {
        authorId: decoded.id,
      },
      include: {
        author: true,
        likedUsers: true,
        viewedUsers: true,
      },
      take: limit,
      skip: skip,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (posts.length == 0)
      return new Response("No posts found", { status: 404 });

    return Response.json(posts);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
