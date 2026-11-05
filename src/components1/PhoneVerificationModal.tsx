import { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Phone } from "@phosphor-icons/react";
import { PhoneInput } from "@/components1/ui/phone-input";

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (phoneNumber: string) => void;
  userEmail: string;
}

const PhoneVerificationModal = ({ 
  isOpen,  
  onSuccess,
}: PhoneVerificationModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState(""); // 10 digits only
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePhoneNumber = (phone: string): boolean => {
    // Must be exactly 10 digits starting with 6-9 (Indian mobile)
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error("Please enter a valid 10-digit mobile number starting with 6-9");
      return;
    }

    setIsSubmitting(true);

    try {
      // Pass the phone number back to parent component
      onSuccess(phoneNumber);
    } catch (error: any) {
      console.error("Error submitting phone number:", error);
      toast.error("Failed to add phone number. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="sfs-ui sfs-skin fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 backdrop-blur-sm">
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="phone-modal-title"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md rounded-panel bg-white p-8 shadow-overlay"
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-surface text-brand">
            <Phone size={30} aria-hidden="true" />
          </div>
          <h2 id="phone-modal-title" className="t-title">Add Your Phone Number</h2>
          <p className="t-small mt-2 text-ink/70">
            We need your mobile number for booking sessions and notifications
          </p>
        </div>

        {/* Form */}
        <div className="grid gap-4">
          <div>
            <label htmlFor="phone" className="t-label mb-2 block">
              Mobile Number
            </label>
            <PhoneInput
              id="phone"
              value={phoneNumber}
              onChange={setPhoneNumber}
              placeholder="9876543210"
              disabled={isSubmitting}
            />
            <p className="t-small mt-1.5 text-ink/60">
              Enter your 10-digit mobile number (without +91)
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || phoneNumber.length !== 10}
            className="btn btn-primary w-full"
          >
            {isSubmitting ? (
              <>
                <span className="login-spinner size-4 rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                Adding Phone Number...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 rounded-card bg-surface p-4">
          <p className="t-small text-ink/80">
            <span className="font-semibold">Why we need this?</span> Your phone number helps us:
          </p>
          <ul className="t-small mt-2 ml-4 list-disc space-y-1 text-ink/70">
            <li>Send booking confirmations via SMS</li>
            <li>Enable emergency communication</li>
            <li>Provide better support</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default PhoneVerificationModal;
