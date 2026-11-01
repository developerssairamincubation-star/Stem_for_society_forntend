import { WhatsappLogo } from '@phosphor-icons/react'
import { community } from '../../config'
import { Reveal } from '../ui/Reveal'

/** QR on the left, invitation copy and CTA on the right; stacks on small screens. */
export function WhatsAppCard() {
  const ready = community.whatsappUrl !== ''

  return (
    <Reveal className="card mx-auto grid max-w-4xl items-center gap-8 p-6 shadow-raised sm:p-8 md:grid-cols-[auto_1fr] md:gap-12 md:p-10">
      <div className="mx-auto w-56 rounded-card border border-tint bg-white p-3 sm:w-64">
        <img
          src={community.whatsappQr}
          alt="QR code to join the STEM for Society WhatsApp community"
          width={1024}
          height={1024}
          decoding="async"
          className="aspect-square w-full"
        />
      </div>

      <div className="text-center md:text-left">
        <h2 className="t-title">Scan to Join</h2>
        <p className="t-lead mt-3 text-ink/70">Stay updated with the latest events, workshops and opportunities.</p>

        <div className="mt-8">
          {ready ? (
            <a
              href={community.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary group"
            >
              <WhatsappLogo size={20} weight="fill" aria-hidden="true" />
              Join WhatsApp Community
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : (
            <>
              <button type="button" disabled aria-describedby="whatsapp-pending" className="btn btn-primary">
                <WhatsappLogo size={20} weight="fill" aria-hidden="true" />
                Join WhatsApp Community
              </button>
              <p id="whatsapp-pending" className="t-small mt-3 text-ink/60">
                The invitation link is being set up. Scan the QR code to join in the meantime.
              </p>
            </>
          )}
        </div>
      </div>
    </Reveal>
  )
}
