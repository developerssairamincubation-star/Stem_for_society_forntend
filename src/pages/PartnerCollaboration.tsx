import { useState } from 'react'
import { GridLines } from '@/sfs/components/partner/GridLines'
import { PartnerCategories } from '@/sfs/components/partner/PartnerCategories'
import { PartnerHero } from '@/sfs/components/partner/PartnerHero'
import { RegisterSection } from '@/sfs/components/partner/RegisterSection'
import { TrustedPartners } from '@/sfs/components/partner/TrustedPartners'
import { WaysToCollaborate } from '@/sfs/components/partner/WaysToCollaborate'
import { SfsPage } from '@/sfs/components/SfsPage'
import { usePageMeta } from '@/sfs/lib/usePageMeta'
import '@/sfs/styles/sfs-partner.css'

/** /partner-with-us: the public collaboration page and organisation registration. */
export default function PartnerCollaboration() {
  const [type, setType] = useState('')
  const [interest, setInterest] = useState('')
  usePageMeta({
    title: 'Partner With Us | STEM for Society',
    description:
      'Educational institutions, startups, companies and innovation centres: partner with STEM for Society to create learning opportunities and empower the next generation.',
  })

  return (
    <SfsPage>
      <div className="relative isolate bg-surface">
        <GridLines />
        <PartnerHero />
        <PartnerCategories onChoose={setType} />
        <WaysToCollaborate onChoose={setInterest} />
        <RegisterSection type={type} onTypeChange={setType} interest={interest} onInterestChange={setInterest} />
        <TrustedPartners />
      </div>
    </SfsPage>
  )
}
