import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * 5;
    const posts = await prisma.post.findMany({
      where: {
        authorId: id,
      },
      take: 5,
      skip,
      include: {
        author: true,
        likedUsers: true,
      },
    });

    if (posts.length == 0)
      return new Response("No posts found", { status: 404 });

    return Response.json(posts);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
