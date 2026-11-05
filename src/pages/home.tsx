import { HomeHero } from "@/sfs/components/home/HomeHero";
import { NetworkBand } from "@/sfs/components/home/NetworkBand";
import { PartnerBand } from "@/sfs/components/home/PartnerBand";
import { PartnerLogos } from "@/sfs/components/home/PartnerLogos";
import { ProgrammeExplorer } from "@/sfs/components/home/ProgrammeExplorer";
import { ProofStrip } from "@/sfs/components/home/ProofStrip";
import { SfsPage } from "@/sfs/components/SfsPage";

/**
 * Home, redesign direction "Route": a calm page on cool paper, one full-colour band, one drawn line.
 * (Testimonials are left out until approved student quotes exist; the previous sample ones were placeholders.)
 */
function Home() {
  return (
    <SfsPage>
      <HomeHero />
      <ProofStrip />
      <ProgrammeExplorer />
      <NetworkBand />
      <PartnerLogos />
      <PartnerBand />
    </SfsPage>
  );
}

export default Home;
