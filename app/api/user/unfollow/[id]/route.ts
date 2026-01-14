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
    const userToUnfollow = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        followers: true,
        following: true,
      },
    });

    if (!userToUnfollow) return new Response("User not found", { status: 404 });

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

    const notFollowing = !currentUser.following.some(
      (user) => user.id === userToUnfollow.id
    );

    if (notFollowing)
      return new Response("You are not following this user", {
        status: 400,
      });

    const newUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        following: {
          disconnect: {
            id,
          },
        },
      },
      include: {
        followers: true,
        following: true,
        likedPosts: true,
        posts: true,
        viewedPosts: true,
      },
    });
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        followers: {
          disconnect: {
            id: currentUser.id,
          },
        },
      },
    });

    return Response.json({ newUser });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
