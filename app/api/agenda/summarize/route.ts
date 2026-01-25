import { verify } from "jsonwebtoken";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const { agenda } = await req.json();

    if (!agenda || !Array.isArray(agenda))
      return new Response("Invalid agenda data", { status: 400 });

    try {
      const aiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          "Summarize the following agenda items in a concise manner and give me study tips for each piece of agenda (use HTML formatting, dont set any background or any text colors keep everything to fonts, and text sizes. Sort them into categorioes based on what day of the week they are, make the date label have .aiDay. If there isnt any assignments for the day, output a centered piece of text with the text equal to 1.2rem with a className of text-(--secondary-text). make it this layout: <div class='aiSummary'><h1 class='aiSubject'>subject</h1><p class='aiContent'>{content}</p><p class='aiStudyTip'>Study Tips: {studyTip}</p></div> \n remove the ```html at the beginning and ``` at the end \n :\n" +
            JSON.stringify(agenda),
        ],
      });

      return Response.json({
        aiResponse: aiResponse.text,
      });
    } catch (error) {
      console.log(error);
      return new Response(`Error generating summary: ${error}`, {
        status: 500,
      });
    }
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
