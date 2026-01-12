import { TJWT } from "@/app/types";
import { prisma } from "@/lib/prisma";
import { decode, verify } from "jsonwebtoken";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
        likedUsers: true,
        viewedUsers: true,
      },
    });

    if (!post) return new Response("Post not found", { status: 404 });

    const decoded = decode(authHeader) as TJWT;

    if (post.likedUsers.some((u) => u.id == decoded.id))
      return new Response("Post already liked", { status: 409 });

    await prisma.post.update({
      where: {
        id,
      },
      data: {
        likes: post.likes + 1,
        likedUsers: {
          connect: {
            id: decoded.id,
          },
        },
      },
    });

    return new Response("Post liked");
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
