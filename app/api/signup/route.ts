import { sign, verify } from "jsonwebtoken";
import { isEmpty } from "../isEmpty";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { username, learner } = await req.json();

    console.log(learner);
    if (!username || !learner || isEmpty([username, learner.learner]))
      return new Response("Missing fields", { status: 400 });

    const name = `${learner.learner.split(" ")[0]} ${
      learner.learner.split(" ")[1]
    }`.toLowerCase();

    const userCheck = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { name }],
      },
    });

    if (userCheck) return new Response("User already exsts", { status: 409 });
    const user = await prisma.user.create({
      data: {
        username,
        name,
        class: learner.class.split(" ")[0],
      },
      include: {
        posts: true,
      },
    });

    const token = await sign(
      { id: user.id, username: user.username, name },
      process.env.JWT_SECRET as string
    );

    return Response.json({ token, user });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
