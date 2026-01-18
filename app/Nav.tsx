import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex justify-between items-center px-3 flex-wrap">
      <h1 className="text-[1.3rem] font-medium">Bacnotes</h1>
      <div className="flex gap-3">
        <Link href={"/home"}>Home</Link>
        <Link href={"/notes"}>Notes</Link>
        <Link href={"/profile"}>Profile</Link>
        <button>LogOut</button>
      </div>
    </nav>
  );
}
