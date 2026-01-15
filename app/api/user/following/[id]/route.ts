import { prisma } from "@/lib/prisma";
import { decode, verify } from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const decoded: any = decode(authHeader);
    const currentUser = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      include: {
        following: true,
      },
    });

    if (!currentUser)
      return new Response("Current user not found", { status: 404 });

    return Response.json({ following: currentUser.following });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
