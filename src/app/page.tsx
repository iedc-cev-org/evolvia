import StarField from "@/components/StarField";

export default function Home() {
  return (
    <main className="h-screen w-screen bg-black">
      <StarField />
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white">
        <h1 className="text-4xl">Evolvia</h1>
      </div>
    </main>
  );
}
