import { CampusAmbassadorPage } from "@/sfs/components/campus-ambassador/CampusAmbassadorPage";
import { SfsPage } from "@/sfs/components/SfsPage";

/** /campus-ambassador: the redesigned program page. Registration stays on /campus-ambassador-booking. */
export default function CampusAmbassadorDash() {
  return (
    <SfsPage>
      <CampusAmbassadorPage />
    </SfsPage>
  );
}
