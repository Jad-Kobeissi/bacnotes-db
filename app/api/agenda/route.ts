import { TJWT } from "@/app/types";
import axios from "axios";
import { decode, verify } from "jsonwebtoken";

export function getISOWeek(date: Date): number {
  const tempDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = tempDate.getUTCDay() || 7; // Sunday = 7
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(
    ((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return weekNum;
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    const tokenBAC = req.headers.get("tokenBAC");
    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const decoded = decode(authHeader) as TJWT;
    const url = new URL(req.url);

    const week = url.searchParams.get("week") || getISOWeek(new Date());
    if (week == "") return new Response("Week is required", { status: 400 });
    try {
      const res = await axios.get(
        `https://sisapi.bac.edu.lb/api/agenda/${week}/parent/${decoded.BACId}`,
        {
          headers: {
            Authorization: `Bearer ${tokenBAC}`,
          },
        },
      );

      return Response.json(res.data.data.agenda);
    } catch (error: any) {
      console.log(error.response);
      return new Response(`Error fetching agenda: ${error.response.data}`, {
        status: error.response.status,
      });
    }
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
