import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">ShadowOps</h1>
        <p className="text-gray-400 mb-6">
          Engineering Risk Intelligence Dashboard
        </p>
        <Link
          href="/dashboard"
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg"
        >
          Enter Dashboard
        </Link>
      </div>
    </main>
  );
}
