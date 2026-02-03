import { TJWT } from "@/app/types";
import axios from "axios";
import { decode, verify } from "jsonwebtoken";
import { getISOWeek } from "date-fns";

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
