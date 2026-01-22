import { TJWT } from "@/app/types";
import { storage } from "@/lib/firebase";
import { prisma } from "@/lib/prisma";
import { del, put } from "@vercel/blob";
import { deleteObject, ref } from "firebase/storage";
import { decode, verify } from "jsonwebtoken";
import sharp from "sharp";

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
export async function DELETE(
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
    });

    if (!post) return new Response("Post not found", { status: 404 });

    const decoded = decode(authHeader) as TJWT;

    if (post.authorId !== decoded.id)
      return new Response("Forbidden", { status: 403 });

    await post.imageUrls.forEach(async (url) => {
      const imageRef = ref(storage, url);

      await deleteObject(imageRef);
    });
    await prisma.post.delete({
      where: { id },
    });

    return new Response("Post deleted successfully", { status: 200 });
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

    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) return new Response("Post not found", { status: 404 });

    const decoded = decode(authHeader) as TJWT;

    if (post.authorId !== decoded.id)
      return new Response("Forbidden", { status: 403 });

    const { title, content, files } = await req.json();

    await prisma.post.update({
      where: { id },
      data: {
        title:
          title && title !== "" && title !== post.title ? title : post.title,
        content:
          content && content !== "" && content !== post.content
            ? content
            : post.content,
        imageUrls: files && files.length > 0 ? files : post.imageUrls,
      },
    });

    return new Response("Post updated");
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
