/** Left panel: moving blue gradient, a few soft shapes and a faint network, with the logo and welcome copy. */
export function BrandPanel() {
  return (
    <section
      aria-label="Welcome to STEM for Society"
      className="login-gradient relative flex flex-col overflow-hidden rounded-[1.5rem] p-6 text-white sm:p-8 lg:p-10"
    >
      {/* Decorative layer: shapes, glow and a faint network of nodes */}
      <div aria-hidden="true" className="login-decor pointer-events-none absolute inset-0">
        <span className="login-float absolute -top-16 -right-10 size-56 rounded-full bg-white/10" />
        <span className="login-float absolute bottom-24 -left-16 size-44 rounded-full bg-white/10 [animation-delay:-4s]" />
        <span className="login-glow absolute top-1/3 right-1/4 size-64 rounded-full bg-cyan-300/30 blur-3xl" />
        <svg className="login-glow absolute inset-0 h-full w-full" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" fill="none">
          <g stroke="white" strokeOpacity="0.5" strokeWidth="1">
            <path d="M60 120 L170 80 L260 150 L340 90" />
            <path d="M170 80 L200 210 L260 150" />
            <path d="M200 210 L120 290 L60 120" />
            <path d="M260 150 L330 260 L200 210" />
          </g>
          <g fill="white">
            {[
              [60, 120],
              [170, 80],
              [260, 150],
              [340, 90],
              [200, 210],
              [120, 290],
              [330, 260],
            ].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" />
            ))}
          </g>
        </svg>
      </div>

      <div className="relative z-10 flex flex-1 flex-col">
        <img
          src="/images/brand/sfs-logo.png"
          alt="STEM for Society"
          width={64}
          height={64}
          className="size-14 object-contain brightness-0 invert sm:size-16"
        />

        {/* Welcome copy sits at the bottom of the panel */}
        <div className="mt-10 lg:mt-auto lg:pt-16">
          <h1 className="t-display !text-white">Start Your Journey</h1>
          <p className="t-lead mt-4 max-w-md text-white/85">Explore, innovate, and connect with the STEM community</p>
        </div>

      </div>
    </section>
  )
}
