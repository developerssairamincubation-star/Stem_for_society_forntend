import { InstitutionsPage } from "@/sfs/components/institutions/InstitutionsPage";
import { SfsPage } from "@/sfs/components/SfsPage";
import { usePageMeta } from "@/sfs/lib/usePageMeta";

/** /institutions: the redesigned institutions page (new route). */
export default function Institutions() {
  usePageMeta({
    title: "Institutions | STEM for Society",
    description: "Four structured training plans covering 24 essential professional skills, from foundational workplace basics to entrepreneurship, for schools, colleges and universities.",
  });
  return (
    <SfsPage>
      <InstitutionsPage />
    </SfsPage>
  );
}
