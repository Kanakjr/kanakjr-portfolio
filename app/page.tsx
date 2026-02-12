import Hero from "@/components/sections/Hero";
import Career from "@/components/sections/Career";
import Patents from "@/components/sections/Patents";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Achievements from "@/components/sections/Achievements";
import Portfolio from "@/components/sections/Portfolio";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-background">
      <Hero />
      <Career />
      <Patents />
      <Skills />
      <Projects />
      <Achievements />
      <Portfolio />
      <Footer />
    </main>
  );
}
