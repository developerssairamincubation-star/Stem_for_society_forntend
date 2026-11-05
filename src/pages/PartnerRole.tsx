import { Link } from "react-router-dom";
import { ArrowUpRight } from "@phosphor-icons/react";
import { AuthShell } from "@/sfs/components/auth/AuthShell";

const PartnerRole = () => {
  return (
    <AuthShell
      title="Select your Role"
      description="Log in as a partner institution."
      brandTitle="Innovate, Incubate and Impact"
      brandText="Let's Innovate, Incubate and Impact the world together!"
      footer={
        <Link to="/" className="font-medium text-deep underline decoration-tint decoration-2 underline-offset-4 hover:decoration-deep">
          Back to Home
        </Link>
      }
    >
      <div className="grid gap-4">
        {/* Partner - Institution */}
        <Link
          to="/partner-institution-signup"
          className="card group relative block p-6 transition-colors duration-200 hover:border-brand hover:bg-surface"
        >
          <span
            aria-hidden="true"
            className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-surface text-brand transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          >
            <ArrowUpRight size={18} />
          </span>
          <div className="pr-12">
            <h2 className="t-heading">Partner Institution Portal</h2>
            <p className="t-body mt-2 text-ink/70">
              Manage collaborations, propose training programs, and access institutional insights for your students' academic and career growth.
            </p>
          </div>
        </Link>
      </div>
    </AuthShell>
  );
};

export default PartnerRole;
