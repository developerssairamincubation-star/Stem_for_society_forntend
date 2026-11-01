import { InstitutionsPage } from "@/sfs/components/institutions/InstitutionsPage";
import { SfsPage } from "@/sfs/components/SfsPage";

/** /institutions: the redesigned institutions page (new route). */
export default function Institutions() {
  return (
    <SfsPage>
      <InstitutionsPage />
    </SfsPage>
  );
}
