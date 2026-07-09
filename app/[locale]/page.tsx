import Hero from "@/sections/Hero";
import Journey from "@/sections/Journey";
import Contact from "@/sections/Contact";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Journey />
      <Contact />
    </main>
  );
}
