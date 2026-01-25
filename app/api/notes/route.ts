import { TJWT } from "@/app/types";
import { prisma } from "@/lib/prisma";
import { decode, verify } from "jsonwebtoken";
import { isEmpty } from "../isEmpty";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded = decode(authHeader) as TJWT;

    const notes = await prisma.note.findMany({
      where: {
        authorId: {
          not: decoded.id,
        },
      },
      include: {
        author: true,
        likedUsers: true,
      },
    });

    if (notes.length == 0)
      return new Response("No notes found", { status: 404 });

    return Response.json(notes);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const { title, content, files, subject } = await req.json();

    console.log(files);

    if (!title || !content || !subject || isEmpty([title, content, subject]))
      return new Response("Please fill all fields", { status: 400 });

    const decoded = decode(authHeader) as TJWT;
    const note = await prisma.note.create({
      data: {
        title,
        content,
        authorId: decoded.id,
        imageUrls: files,
        subject: subject,
      },
    });

    return new Response("Posted");
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
