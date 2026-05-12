import { Navbar } from "@/components/layout/navbar";
import { PortfolioHero } from "@/components/ui/prisma-hero";
import { CapabilitiesSection } from "@/components/sections/capabilities-section";
import { WorksHorizontal } from "@/components/sections/works-horizontal";
import { HowWorkSection } from "@/components/sections/how-work-section";
import { CinematicFooter } from "@/components/ui/motion-footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="inicio">
        <PortfolioHero />
        <CapabilitiesSection />
        <WorksHorizontal />
        <HowWorkSection />
        <CinematicFooter />
      </main>
    </>
  );
}
