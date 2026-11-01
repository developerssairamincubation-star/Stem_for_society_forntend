import { Reveal } from '../ui/Reveal'
import { Button } from '../ui/Button'

export function CustomSolution({ onCustom }: { onCustom: () => void }) {
  return (
    <section id="partner" aria-labelledby="custom-title" className="section bg-surface">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <h2 id="custom-title" className="t-title">
              Need a <span className="text-brand">Custom Solution?</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <Button onClick={onCustom}>Discuss Custom Needs</Button>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <img
            src="/illustrations/partnership.svg"
            alt="Two people shaking hands in an office"
            loading="lazy"
            width={720}
            height={540}
            className="mx-auto h-auto w-full max-w-md"
          />
        </Reveal>
      </div>
    </section>
  )
}
