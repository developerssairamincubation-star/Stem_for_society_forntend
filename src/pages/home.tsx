import { Academy } from "@/sfs/components/Academy";
import { UpcomingEvents } from "@/sfs/components/events/UpcomingEvents";
import { Hero } from "@/sfs/components/Hero";
import { NetworkBeyondCampus } from "@/sfs/components/NetworkBeyondCampus";
import { PartnerCTA } from "@/sfs/components/PartnerCTA";
import { Partners } from "@/sfs/components/Partners";
import { SfsPage } from "@/sfs/components/SfsPage";
import { Testimonials } from "@/sfs/components/Testimonials";

/** Home: the redesigned SFS landing page. (The previous home sections remain in components1 but are no longer rendered.) */
function Home() {
  return (
    <SfsPage>
      <Hero />
      <Academy />
      <UpcomingEvents />
      <NetworkBeyondCampus />
      <Testimonials />
      <Partners />
      <PartnerCTA />
    </SfsPage>
  );
}

export default Home;
