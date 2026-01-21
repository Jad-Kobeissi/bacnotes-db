import { TJWT, TPost } from "@/app/types";
import { storage } from "@/lib/firebase";
import { prisma } from "@/lib/prisma";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { decode, verify } from "jsonwebtoken";
import sharp from "sharp";

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

    await Promise.all(
      posts.map((post) => {
        return prisma.post.update({
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
      }),
    );

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

    // Verify user exists in database
    const userExists = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!userExists) {
      return new Response("User not found. Please log in again.", {
        status: 404,
      });
    }

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const files = formData.getAll("files") as File[];

    // Upload files first in parallel
    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());

        // Process image with sharp: resize to 800px width and set quality
        const compressedImageBuffer = await sharp(buffer)
          .resize(800)
          .webp({ quality: 80 }) // Convert to WebP with 80% quality
          .toBuffer();

        const imageRef = ref(
          storage,
          `${process.env.NEXT_PUBLIC_POSTS_BUCKET}/${crypto.randomUUID()}`,
        );

        await uploadBytes(imageRef, compressedImageBuffer);
        return await getDownloadURL(imageRef);
      }),
    );

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: decoded.id,
        imageUrls,
      },
    });

    return Response.json(post);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
