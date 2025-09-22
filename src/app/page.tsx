import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen w-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/logo.webp"
          alt="logo"
          width={200}
          height={200}
          className=""
        />
      </div>

      {
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-4">
          <Link href="/buzzerQuiz">
            <button className="px-4 py-2 bg-red-600 text-white rounded">
              Red Template
            </button>
          </Link>
          <Link href="/vibeCoding">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Blue Template
            </button>
          </Link>
          <Link href="/workShop">
            <button className="px-4 py-2 bg-green-600 text-white rounded">
              Green Template
            </button>
          </Link>
        </div>
        }
    </main>
  );
}
