import { TJWT } from "@/app/types";
import { storage } from "@/lib/firebase";
import { prisma } from "@/lib/prisma";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { decode, verify } from "jsonwebtoken";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) return new Response("Post not found", { status: 404 });

    const decoded = decode(authHeader) as TJWT;

    if (post.authorId !== decoded.id)
      return new Response("Forbidden", { status: 403 });

    await prisma.post.delete({ where: { id } });

    await Promise.all(
      await post.imageUrls.map(async (url) => {
        const imageRef = ref(storage, url);
        await deleteObject(imageRef);
      })
    );
    return new Response("Post deleted", { status: 200 });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) return new Response("Post not found", { status: 404 });

    const decoded = decode(authHeader) as TJWT;

    if (post.authorId !== decoded.id)
      return new Response("Forbidden", { status: 403 });

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const files = formData.getAll("images") as File[];

    let imageUrls: string[] = post.imageUrls;

    if (files.length > 0) {
      await imageUrls.map(async (url) => {
        const imageRef = ref(storage, url);
        await deleteObject(imageRef);
      });

      imageUrls = await Promise.all(
        files.map(async (file) => {
          const storageRef = ref(
            storage,
            `posts/${decoded.id}/${crypto.randomUUID()}-${file.name}`
          );
          await uploadBytes(storageRef, file);
          return await getDownloadURL(storageRef);
        })
      );
    }
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: title && title !== "" ? title : post.title,
        content: content && content !== "" ? content : post.content,
        imageUrls,
      },
    });

    return Response.json(updatedPost);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
