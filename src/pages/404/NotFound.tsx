import { Link } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import { ArrowLeft, Compass, House, MagnifyingGlass } from "@phosphor-icons/react";
import { PageFrame } from "@/sfs/components/page/PageFrame";
import logo from "@/assets/logo.webp";

/**
 * Where a lost visitor most likely meant to go.
 *
 * Deliberately short: a wall of links is its own kind of dead end. These are
 * the four destinations that cover almost every mistyped or stale URL on the
 * site.
 */
const SUGGESTIONS = [
  { to: "/courses", label: "Courses", hint: "Browse every programme on offer" },
  { to: "/training", label: "Trainings", hint: "Live and upcoming sessions" },
  { to: "/blogs", label: "Blog", hint: "Articles from our community" },
  { to: "/skill-development", label: "Get started", hint: "Explore our programs" },
];

type NotFoundProps = {
  /**
   * "bare" drops the public header and footer.
   *
   * The admin and partner areas have their own chrome and their own sign-in
   * state, so dropping a marketing header into the middle of them would be
   * disorienting rather than helpful.
   */
  variant?: "site" | "bare";
};

const ease = [0.16, 1, 0.3, 1] as const;
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
});

export function NotFound({ variant = "site" }: NotFoundProps) {
  const bare = variant === "bare";

  const content = (
    <div className="container-x flex min-h-[80vh] items-center justify-center pt-36 pb-16 sm:pb-24">
      <div className="w-full max-w-2xl text-center">
        {bare && (
          <Link to="/" className="mb-10 inline-block">
            <img src={logo} alt="STEM for Society" className="mx-auto h-12 w-auto" />
          </Link>
        )}

        {/* The 404 itself, in the site's heading face and brand blue. */}
        <motion.p {...rise(0)} className="select-none text-[6rem] leading-none font-semibold tracking-tight text-deep sm:text-[8rem] md:text-[10rem]" aria-hidden="true">
          4<span className="text-brand">0</span>4
        </motion.p>

        <motion.h1 {...rise(0.08)} className="t-title mt-2">
          We couldn&apos;t find that page
        </motion.h1>

        <motion.p {...rise(0.16)} className="t-lead mx-auto mt-4 max-w-md text-ink/70">
          The link may be out of date, or the address might have a typo in it. Nothing is broken on your end.
        </motion.p>

        <motion.div {...rise(0.24)} className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="btn btn-primary">
            <House size={18} aria-hidden="true" />
            Go to homepage
          </Link>
          <button type="button" onClick={() => window.history.back()} className="btn btn-secondary nudge">
            <ArrowLeft size={18} aria-hidden="true" />
            Go back
          </button>
        </motion.div>

        {!bare && (
          <motion.div {...rise(0.32)} className="mt-14 text-left">
            <div className="mb-5 flex items-center justify-center gap-2 text-ink/60">
              <Compass size={18} aria-hidden="true" />
              <span className="t-small font-medium">Or try one of these</span>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {SUGGESTIONS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="card group block p-4 transition-colors duration-200 hover:border-brand hover:bg-surface"
                  >
                    <span className="t-label block group-hover:text-deep">{item.label}</span>
                    <span className="t-small mt-0.5 block text-ink/60">{item.hint}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {bare && (
          <p className="t-small mt-10 text-ink/60">
            <MagnifyingGlass size={16} className="mr-1 -mt-0.5 inline" aria-hidden="true" />
            If you reached this from a menu link, it may point somewhere that no longer exists.
          </p>
        )}
      </div>
    </div>
  );

  if (bare) {
    return (
      <MotionConfig reducedMotion="user">
        <div className="sfs-ui sfs-skin min-h-screen bg-surface">
          <main>{content}</main>
        </div>
      </MotionConfig>
    );
  }

  return <PageFrame tone="surface">{content}</PageFrame>;
}

export default NotFound;
