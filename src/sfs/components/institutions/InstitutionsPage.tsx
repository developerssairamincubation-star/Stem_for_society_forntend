import { AnimatePresence } from 'framer-motion'
import { useCallback, useState } from 'react'
import { useModalLifecycle } from '../../hooks/useModalLifecycle'
import { cardLayoutId } from '../../lib/layoutIds'
import { ModalOverlay } from '../ui/Modal'
import { CustomSolution } from './CustomSolution'
import { EnquiryModal, type EnquiryRequest } from './EnquiryModal'
import { FaqSection } from './FaqSection'
import { InstitutionHero } from './InstitutionHero'
import { TrainingPlansSection } from './TrainingPlansSection'

type View = { type: 'enquiry'; request: EnquiryRequest } | null

export function InstitutionsPage() {
  const [view, setView] = useState<View>(null)
  const close = useCallback(() => setView(null), [])
  useModalLifecycle(view !== null, close)

  const openEnquiry = (request: EnquiryRequest) => setView({ type: 'enquiry', request })

  return (
    <>
      <InstitutionHero onPartner={() => openEnquiry({ mode: 'partner' })} />
      <TrainingPlansSection
        onEnquire={(plan) => openEnquiry({ mode: 'partner', area: plan.title, layoutId: cardLayoutId(plan.id) })}
        onRequestCurriculum={() => openEnquiry({ mode: 'partner' })}
      />
      <FaqSection />
      <CustomSolution onCustom={() => openEnquiry({ mode: 'custom' })} />

      <AnimatePresence>
        {view && <ModalOverlay key="overlay" />}
        {view?.type === 'enquiry' && <EnquiryModal key="enquiry" request={view.request} onClose={close} />}
      </AnimatePresence>
    </>
  )
}
