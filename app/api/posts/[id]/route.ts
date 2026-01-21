import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        likedUsers: true,
        viewedUsers: true,
      },
    });

    if (!post) return new Response("Post not found", { status: 404 });

    return Response.json(post);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
