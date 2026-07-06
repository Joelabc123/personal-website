import Hero from "@/sections/Hero";
import About from "@/sections/About";
import Journey from "@/sections/Journey";
import Contact from "@/sections/Contact";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <About />
      <Journey />
      <Contact />
    </main>
  );
}
