import { handleUpload, HandleUploadBody } from "@vercel/blob/client";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        return {};
      },
      onUploadCompleted: async () => {},
    });

    return Response.json(jsonResponse);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
