import { useState } from 'react'
import { GridLines } from '@/sfs/components/partner/GridLines'
import { PartnerCategories } from '@/sfs/components/partner/PartnerCategories'
import { PartnerHero } from '@/sfs/components/partner/PartnerHero'
import { TrustedPartners } from '@/sfs/components/partner/TrustedPartners'
import { SfsPage } from '@/sfs/components/SfsPage'
import { usePageMeta } from '@/sfs/lib/usePageMeta'

/** /partner-with-us: the public collaboration page. The organisation registration form sits in the opener. */
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
      <div className="relative isolate bg-surface">
        <GridLines />
        <PartnerHero type={type} onTypeChange={setType} interest={interest} onInterestChange={setInterest} />
        <PartnerCategories onChoose={setType} />
        <TrustedPartners />
      </div>
    </SfsPage>
  )
}
