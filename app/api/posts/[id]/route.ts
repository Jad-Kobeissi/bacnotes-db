import { TJWT } from "@/app/types";
import { prisma } from "@/lib/prisma";
import { del, put } from "@vercel/blob";
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
      await del(url);
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

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const files = formData.getAll("files") as File[];

    let imageUrls: string[] = [];

    if (files.length > 0) {
      await post.imageUrls.forEach(async (url) => {
        await del(url);
      });

      imageUrls = await Promise.all(
        files.map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer());

          const compressedImageBuffer = await sharp(buffer)
            .resize(800)
            .webp({ quality: 80 })
            .toBuffer();
          const blob = await put(
            `${process.env.NEXT_PUBLIC_POSTS_BUCKET}/${crypto.randomUUID()}`,
            compressedImageBuffer,
            {
              access: "public",
            },
          );

          return blob.url;
        }),
      );
    }

    await prisma.post.update({
      where: { id },
      data: {
        title:
          title && title !== "" && title !== post.title ? title : post.title,
        content:
          content && content !== "" && content !== post.content
            ? content
            : post.content,
        imageUrls: imageUrls.length > 0 ? imageUrls : post.imageUrls,
      },
    });

    return new Response("Post updated");
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
