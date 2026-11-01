import { AnimatePresence } from 'framer-motion'
import { useCallback, useState } from 'react'
import type { InstitutionProgramme } from '../../data/institutions'
import { useModalLifecycle } from '../../hooks/useModalLifecycle'
import { cardLayoutId } from '../../lib/layoutIds'
import { ModalOverlay } from '../ui/Modal'
import { CustomSolution } from './CustomSolution'
import { EnquiryModal, type EnquiryRequest } from './EnquiryModal'
import { FaqSection } from './FaqSection'
import { InstitutionHero } from './InstitutionHero'
import { ProgrammeModal } from './ProgrammeModal'
import { ProgrammesSection } from './ProgrammesSection'

type View = { type: 'detail'; programme: InstitutionProgramme } | { type: 'enquiry'; request: EnquiryRequest } | null

export function InstitutionsPage() {
  const [view, setView] = useState<View>(null)
  const close = useCallback(() => setView(null), [])
  useModalLifecycle(view !== null, close)

  const openEnquiry = (request: EnquiryRequest) => setView({ type: 'enquiry', request })

  return (
    <>
      <InstitutionHero onPartner={() => openEnquiry({ mode: 'partner' })} />
      <ProgrammesSection onOpen={(programme) => setView({ type: 'detail', programme })} />
      <FaqSection />
      <CustomSolution onCustom={() => openEnquiry({ mode: 'custom' })} />

      <AnimatePresence>
        {view && <ModalOverlay key="overlay" />}
        {view?.type === 'detail' && (
          <ProgrammeModal
            key="detail"
            programme={view.programme}
            onClose={close}
            onInquire={() =>
              openEnquiry({
                mode: 'partner',
                area: view.programme.title,
                layoutId: cardLayoutId(view.programme.id),
              })
            }
          />
        )}
        {view?.type === 'enquiry' && <EnquiryModal key="enquiry" request={view.request} onClose={close} />}
      </AnimatePresence>
    </>
  )
}
