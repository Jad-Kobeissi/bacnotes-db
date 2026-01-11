import axios from "axios";
import { isEmpty } from "../isEmpty";

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password || isEmpty([identifier, password]))
      return new Response("Missing fields", { status: 400 });

    let children = [];
    try {
      const loginAttempt = await axios.post(
        `https://sisapi.bac.edu.lb/api/login`,
        { identifier, password }
      );
      if (!loginAttempt.data.success)
        return new Response("Invalid credentials", { status: 401 });
      const token = loginAttempt.data.data._token;
      console.log(token);
      try {
        const fetchChildren = await axios.get(
          `https://sisapi.bac.edu.lb/api/select-child`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        children = fetchChildren.data.data.learners.map(
          (child: {
            id: number;
            class: string;
            learner: string;
            report_type: string;
          }) => {
            return child;
          }
        );

        return Response.json({ children, token });
      } catch (error: any) {
        console.log(error);
        return new Response(error.response.data.message, {
          status: 500,
        });
      }
    } catch (error: any) {
      console.log(error.response);
      return new Response(error.response.data.message, {
        status: 500,
      });
    }
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
