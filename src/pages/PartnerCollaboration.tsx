import { useState } from 'react'
import { PartnerCategories } from '@/sfs/components/partner/PartnerCategories'
import { PartnerHero } from '@/sfs/components/partner/PartnerHero'
import { RegisterSection } from '@/sfs/components/partner/RegisterSection'
import { TrustedPartners } from '@/sfs/components/partner/TrustedPartners'
import { SfsPage } from '@/sfs/components/SfsPage'
import { usePageMeta } from '@/sfs/lib/usePageMeta'
import '@/sfs/styles/sfs-partner.css'

/** /partner-with-us: the public collaboration page and organisation registration. */
export default function PartnerCollaboration() {
  const [type, setType] = useState('')
  usePageMeta({
    title: 'Partner With Us | STEM for Society',
    description:
      'Educational institutions, startups, companies and innovation centres: partner with STEM for Society to create learning opportunities and empower the next generation.',
  })

  return (
    <SfsPage polish>
      <PartnerHero />
      <PartnerCategories onChoose={setType} />
      <RegisterSection type={type} onTypeChange={setType} />
      <TrustedPartners />
    </SfsPage>
  )
}
