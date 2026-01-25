import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) return new Response("User not found", { status: 404 });

    const page = new URL(req.url).searchParams.get("page") || "1";
    const take = 10;
    const skip = (parseInt(page) - 1) * take;

    const notes = await prisma.note.findMany({
      where: { authorId: id },
      include: {
        author: true,
        likedUsers: true,
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });

    if (notes.length === 0)
      return new Response("No notes found", { status: 404 });

    return Response.json(notes);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
