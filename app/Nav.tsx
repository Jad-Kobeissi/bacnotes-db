"use client";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Nav() {
  const router = useRouter();
  return (
    <nav className="flex justify-between items-center px-3 flex-wrap fixed top-0 left-0 w-screen backdrop-blur-md">
      <h1 className="min-[430px]:text-[1.3rem] text-[1rem] font-medium">
        BacConnect
      </h1>
      <div className="flex gap-3 min-[401px]:text-[1rem] text-[.9rem]">
        <Link href={"/home"}>Home</Link>
        <Link href={"/notes"}>Notes</Link>
        <Link href={"/agenda"}>Agenda</Link>
        <Link href={"/profile"}>Profile</Link>
        <button
          onClick={() => {
            deleteCookie("token");
            sessionStorage.clear();
            localStorage.clear();
            router.push("/");
          }}
        >
          LogOut
        </button>
      </div>
    </nav>
  );
}
