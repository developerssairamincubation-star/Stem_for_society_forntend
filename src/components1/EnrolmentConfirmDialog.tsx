import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { CalendarBlank, Envelope, Phone, User as UserIcon, X } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

/**
 * Confirmation step between "Enroll" and taking money.
 *
 * Enrolling used to jump straight from a single button into the Razorpay
 * sheet, so the first time anyone saw what they were buying, who it was being
 * bought for, or what it cost was the payment provider's own dialog. This shows
 * the course, the price and the details already held from the sign-in, and asks
 * once.
 *
 * When nobody is signed in it becomes the sign-in prompt instead, so the same
 * button behaves sensibly either way rather than silently redirecting.
 */

export type EnrolmentUser = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  mobile?: string | null;
};

type Props = {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  /** Null when nobody is signed in; the dialog then asks them to sign in. */
  user: EnrolmentUser | null;
  courseTitle: string;
  /** Rupees. 0 or "0" renders as free. */
  cost: string | number | null | undefined;
  startDate?: string | null;
  isProcessing?: boolean;
  /** Where the sign-in button should send them back to afterwards. */
  loginUrl: string;
};

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
      <div className="min-w-0">
        <div className="text-xs text-ink/60">{label}</div>
        <div className="text-sm text-ink break-words">{value}</div>
      </div>
    </div>
  );
}

export default function EnrolmentConfirmDialog({
  opened,
  onClose,
  onConfirm,
  user,
  courseTitle,
  cost,
  startDate,
  isProcessing = false,
  loginUrl,
}: Props) {
  const amount = Number(cost ?? 0);
  const isFree = !Number.isFinite(amount) || amount <= 0;
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();

  // Escape closes, and the page behind must not scroll while this is up.
  useEffect(() => {
    if (!opened) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [opened, onClose]);

  if (!opened) return null;

  /**
   * Rendered with createPortal over a fixed overlay, matching EnquiryPopup.
   * A Mantine <Modal> was tried first and mounted its root but never its
   * content on these pages, so this follows the pattern the app already proves.
   */
  return createPortal(
    <div className="sfs-ui sfs-skin fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={user ? "Confirm your enrolment" : "Sign in to enrol"}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-panel bg-white p-6 shadow-overlay"
      >
        <div className="flex items-start justify-between mb-4">
          <h2 className="t-heading">
            {user ? "Confirm your enrolment" : "Sign in to enrol"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 place-items-center rounded-full text-ink/60 transition-colors hover:bg-surface hover:text-deep"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4">
        <div className="rounded-card border border-tint p-4">
          <div className="text-xs text-ink/60 mb-1">Course</div>
          <div className="font-medium text-ink">{courseTitle}</div>

          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-sm text-ink/60">
              {isFree ? "Price" : "Amount payable"}
            </span>
            <span className="text-xl font-semibold text-ink">
              {isFree ? "Free" : `₹${amount.toLocaleString()}`}
            </span>
          </div>

          {startDate && (
            <div className="mt-2 flex items-center gap-2 text-sm text-ink/60">
              <CalendarBlank size={16} aria-hidden="true" />
              Starts {startDate}
            </div>
          )}
        </div>

        {user ? (
          <>
            <div className="rounded-card bg-surface p-4">
              <div className="text-xs font-medium text-ink/60 uppercase tracking-wide mb-1">
                Enrolling as
              </div>
              {fullName && <DetailRow icon={UserIcon} label="Name" value={fullName} />}
              {user.email && <DetailRow icon={Envelope} label="Email" value={user.email} />}
              {user.mobile && <DetailRow icon={Phone} label="Mobile" value={user.mobile} />}
            </div>

            <p className="text-xs text-ink/60">
              {isFree
                ? "You will be enrolled immediately and can find this course under My Courses."
                : "You will be taken to a secure payment page. Once payment succeeds you will find this course under My Courses."}
            </p>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} disabled={isProcessing} className="btn btn-secondary flex-1">
                Cancel
              </button>
              <button type="button" onClick={onConfirm} disabled={isProcessing} className="btn btn-primary flex-1">
                {isProcessing
                  ? "Processing..."
                  : isFree
                    ? "Confirm enrolment"
                    : "Proceed to payment"}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-ink/75">
              You need an account before enrolling, so we can keep this course
              in your list and send your confirmation.
            </p>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
                Cancel
              </button>
              <Link to={loginUrl} className="btn btn-primary flex-1">
                Sign in
              </Link>
            </div>
          </>
        )}
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
