/** Faint dashed vertical lines framing the page column: four equal columns, drawn behind the content. Decorative. */
export function GridLines() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="container-x relative h-full">
        {['left-0', 'left-1/4 max-md:hidden', 'left-1/2 max-md:hidden', 'left-3/4 max-md:hidden', 'right-0'].map((pos) => (
          <span key={pos} className={`absolute inset-y-0 border-l border-dashed border-tint/80 ${pos}`} />
        ))}
      </div>
    </div>
  )
}
