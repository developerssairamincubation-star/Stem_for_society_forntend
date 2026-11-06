import { useState } from 'react'
import { PartnerCategories } from '@/sfs/components/partner/PartnerCategories'
import { PartnerHero } from '@/sfs/components/partner/PartnerHero'
import { RegisterSection } from '@/sfs/components/partner/RegisterSection'
import { TrustedPartners } from '@/sfs/components/partner/TrustedPartners'
import { SfsPage } from '@/sfs/components/SfsPage'
import { usePageMeta } from '@/sfs/lib/usePageMeta'

/** /partner-with-us: the public collaboration page and organisation registration. */
export default function PartnerCollaboration() {
  const [type, setType] = useState('')
  const [interest, setInterest] = useState('')
  usePageMeta({
    title: 'Partner With Us | STEM for Society',
    description:
      'Educational institutions, startups, corporates and innovation centres: partner with STEM for Society to create learning opportunities and empower the next generation.',
  })

  return (
    <SfsPage>
      <div className="relative isolate bg-gradient-to-b from-surface via-white to-surface">
        <PartnerHero />
        <PartnerCategories onChoose={setType} />
        <RegisterSection type={type} onTypeChange={setType} interest={interest} onInterestChange={setInterest} />
        <TrustedPartners />
      </div>
    </SfsPage>
  )
}
