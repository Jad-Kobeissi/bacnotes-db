import { prisma } from "@/lib/prisma";
import axios from "axios";
import { sign } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { username, identifier, password } = await req.json();

    if (!username || !identifier || !password)
      return new Response("Missing credentials", { status: 400 });

    let token;
    try {
      const loginAttempt = await axios.post(
        `https://sisapi.bac.edu.lb/api/login`,
        { identifier, password },
      );
      if (!loginAttempt.data.success)
        return new Response("Invalid credentials", { status: 401 });

      token = loginAttempt.data.data._token;
    } catch (error: any) {
      return new Response(error.response.data.message, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        posts: true,
        likedPosts: true,
        viewedPosts: true,
        followers: true,
        following: true,
      },
    });

    if (!user) return new Response("Invalid credentials", { status: 401 });

    const customToken = await sign(
      { id: user.id, username, name: user.name },
      process.env.JWT_SECRET!,
    );

    return Response.json({ customToken, token, user });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
