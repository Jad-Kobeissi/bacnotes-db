"use client";
import dynamic from "next/dynamic";

const page = dynamic(() => import("./notes"), { ssr: false });
export default page;
