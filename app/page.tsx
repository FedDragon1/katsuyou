import Link from "next/link";

export default function Home() {
  return (
      <div className="p-20">
          <h1>Homepage</h1>
          <Link href="./practice" className="text-blue-400 underline">Practice</Link>
      </div>
  );
}
