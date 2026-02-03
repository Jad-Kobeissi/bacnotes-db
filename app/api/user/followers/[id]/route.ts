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

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        followers: true,
      },
    });

    if (!user) return new Response("User not found", { status: 404 });

    if (user.followers.length === 0)
      return new Response("No followers", { status: 404 });
    return Response.json(user.followers);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
