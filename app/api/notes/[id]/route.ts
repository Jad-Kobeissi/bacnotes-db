import { TJWT } from "@/app/types";
import { storage } from "@/lib/firebase";
import { prisma } from "@/lib/prisma";
import { deleteObject, ref } from "firebase/storage";
import { decode, verify } from "jsonwebtoken";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const note = await prisma.note.findUnique({
      where: {
        id,
      },
    });

    if (!note) return new Response("Note not found", { status: 404 });

    const decoded = decode(authHeader) as TJWT;

    if (decoded.id !== note.authorId)
      return new Response("Forbidden", { status: 403 });

    note.imageUrls.forEach(async (url) => {
      const imageUrls = ref(storage, url);

      await deleteObject(imageUrls);
    });
    await prisma.note.delete({
      where: {
        id,
      },
    });

    return new Response("Note deleted successfully", { status: 200 });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const note = await prisma.note.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
        likedUsers: true,
      },
    });

    if (!note) return new Response("Note not found", { status: 404 });

    return Response.json(note);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const { title, content, subject, files } = await req.json();

    const { id } = await params;

    const note = await prisma.note.findUnique({
      where: {
        id,
      },
    });

    if (!note) return new Response("Note not found", { status: 404 });

    await prisma.note.update({
      where: {
        id,
      },
      data: {
        title:
          title && title !== "" && title !== note.title ? title : note.title,
        content:
          content && content !== "" && content !== note.content
            ? content
            : note.content,
        subject:
          subject && subject !== "" && subject !== note.subject
            ? subject
            : note.subject,
        imageUrls: files && files.length > 0 ? files : note.imageUrls,
      },
    });

    return new Response("Note updated successfully", { status: 200 });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
