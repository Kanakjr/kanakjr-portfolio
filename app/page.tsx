import Hero from "@/components/sections/Hero";
import LatestWriting from "@/components/sections/LatestWriting";
import Projects from "@/components/sections/Projects";
import Career from "@/components/sections/Career";
import Patents from "@/components/sections/Patents";
import Skills from "@/components/sections/Skills";
import Achievements from "@/components/sections/Achievements";
import Portfolio from "@/components/sections/Portfolio";
import GitHubActivity from "@/components/sections/GitHubActivity";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-background">
      <Hero />
      <LatestWriting />
      <Projects />
      <Career />
      <Patents />
      <Skills />
      <Achievements />
      <Portfolio />
      <GitHubActivity />
      <Footer />
    </main>
  );
}
