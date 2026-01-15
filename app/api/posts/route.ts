import { TJWT } from "@/app/types";
import { prisma } from "@/lib/prisma";
import { decode, verify } from "jsonwebtoken";
import { isEmpty } from "../isEmpty";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const decoded = decode(authHeader) as TJWT;

    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          not: decoded.id,
        },
        author: {
          class: decoded.class,
        },
        viewedUsers: {
          none: {
            id: decoded.id,
          },
        },
      },
      include: {
        author: true,
        viewedUsers: true,
        likedUsers: true,
      },
    });

    if (posts.length == 0) return new Response("No new posts", { status: 404 });

    await posts.forEach(async (post) => {
      await prisma.post.update({
        where: {
          id: post.id,
        },
        data: {
          viewedUsers: {
            connect: {
              id: decoded.id,
            },
          },
        },
      });
    });

    return Response.json(posts);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const decoded = decode(authHeader) as TJWT;

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const files = formData.getAll("files");

    let fileUrls: string[] = [];
    if (Array.from(files).length > 0) {
      fileUrls = await Promise.all(
        files.map(async (file) => {
          const imageRef = ref(
            storage,
            `${process.env.postsBucket}/${crypto.randomUUID()}`
          );
          await uploadBytes(imageRef, file as File);

          return await getDownloadURL(imageRef);
        })
      );
    }
    if (!title || !content || isEmpty([title, content]))
      return new Response("Please fill missing fields", { status: 404 });
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: decoded.id,
        imageUrls: fileUrls,
      },
    });

    return Response.json(post);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
