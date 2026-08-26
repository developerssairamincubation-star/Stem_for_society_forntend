import { Modal } from "@mantine/core";
import { Button } from "@/components1/ui/button";
import { Calendar, Mail, Phone, User as UserIcon } from "lucide-react";
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
      <Icon className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm text-gray-900 break-words">{value}</div>
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

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      radius="lg"
      title={
        <span className="text-lg font-semibold text-gray-900">
          {user ? "Confirm your enrolment" : "Sign in to enrol"}
        </span>
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 p-4">
          <div className="text-xs text-gray-500 mb-1">Course</div>
          <div className="font-medium text-gray-900">{courseTitle}</div>

          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-sm text-gray-500">
              {isFree ? "Price" : "Amount payable"}
            </span>
            <span className="text-xl font-semibold text-gray-900">
              {isFree ? "Free" : `₹${amount.toLocaleString()}`}
            </span>
          </div>

          {startDate && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              Starts {startDate}
            </div>
          )}
        </div>

        {user ? (
          <>
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Enrolling as
              </div>
              {fullName && <DetailRow icon={UserIcon} label="Name" value={fullName} />}
              {user.email && <DetailRow icon={Mail} label="Email" value={user.email} />}
              {user.mobile && <DetailRow icon={Phone} label="Mobile" value={user.mobile} />}
            </div>

            <p className="text-xs text-gray-500">
              {isFree
                ? "You will be enrolled immediately and can find this course under My Courses."
                : "You will be taken to a secure payment page. Once payment succeeds you will find this course under My Courses."}
            </p>

            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isProcessing}
                className="flex-1 rounded-xl bg-[#0D9488] text-white hover:bg-teal-600"
              >
                {isProcessing
                  ? "Processing..."
                  : isFree
                    ? "Confirm enrolment"
                    : "Proceed to payment"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              You need an account before enrolling, so we can keep this course
              in your list and send your confirmation.
            </p>
            <div className="flex gap-3 pt-1">
              <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">
                Cancel
              </Button>
              <Link to={loginUrl} className="flex-1">
                <Button className="w-full rounded-xl bg-[#0D9488] text-white hover:bg-teal-600">
                  Sign in
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
