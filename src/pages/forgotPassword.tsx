import { useState, useEffect } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../lib/hooks";
import { API_URL } from "../Constants";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeSlash, ArrowLeft } from "@phosphor-icons/react";
import { AuthShell } from "@/sfs/components/auth/AuthShell";
import { GenericResponse, GenericError } from "@/lib/types";
import { AxiosError } from "axios";
import { mutationErrorHandler } from "@/lib/utils";

type ForgotPasswordStep = "email" | "otp" | "password";

interface ForgotPasswordFormData {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
  otpSent: boolean;
  otpVerified: boolean;
  /** Issued by /email/verifyOTP; /auth/reset-password rejects the reset without it. */
  resetToken: string;
}

// Inline ForgotPasswordForm Component
interface ForgotPasswordFormProps {
  currentStep: "email" | "otp" | "password";
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendOTP: () => void;
  onVerifyOTP: () => void;
  onResetPassword: () => void;
  onResendOTP: () => void;
  onBackToEmail: () => void;
  onBackToOTP: () => void;
  isLoading: boolean;
}

// API Response Types
type SendOTPResponse = {
  message: string;
  email: string;
};

type VerifyOTPResponse = {
  message: string;
  otp: string;
  email: string;
  resetToken?: string;
};

type ResetPasswordResponse = {
  message: string;
  email: string;
  newPassword: string;
};

const ForgotPasswordForm = ({
  currentStep,
  email,
  otp,
  password,
  confirmPassword,
  onInputChange,
  onSendOTP,
  onVerifyOTP,
  onResetPassword,
  onResendOTP,
  onBackToEmail,
  onBackToOTP,
  isLoading,
}: ForgotPasswordFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Password validation functions
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasSpecialChar;

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const handleResendOTP = () => {
    onResendOTP();
    setCountdown(60); // 60 seconds countdown
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      if (currentStep === "email") onSendOTP();
      else if (currentStep === "otp") onVerifyOTP();
      else if (currentStep === "password") onResetPassword();
    }
  };

  const steps: ForgotPasswordStep[] = ["email", "otp", "password"];
  const stepIndex = steps.indexOf(currentStep);
  const primaryBtn = "btn btn-primary w-full";
  const backBtn =
    "nudge inline-flex w-full items-center justify-center gap-2 rounded-control py-3 text-sm font-medium text-ink/70 transition-colors duration-200 hover:bg-surface hover:text-deep disabled:opacity-50";
  const spinner = <span className="login-spinner size-4 rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />;

  return (
    <div className="grid gap-6">
      {/* Step indicator */}
      <ol className="flex items-center gap-2" aria-label="Progress">
        {steps.map((step, i) => (
          <li
            key={step}
            aria-current={step === currentStep ? "step" : undefined}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= stepIndex ? "bg-deep" : "bg-tint"}`}
          >
            <span className="sr-only">
              Step {i + 1} of 3{step === currentStep ? " (current)" : ""}
            </span>
          </li>
        ))}
      </ol>

      {/* Email Step */}
      {currentStep === "email" && (
        <div className="grid gap-5">
          <div>
            <label htmlFor="email" className="t-label mb-2 block">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              value={email}
              onChange={onInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your email address"
              disabled={isLoading}
            />
          </div>

          <button onClick={onSendOTP} disabled={isLoading || !email.trim()} className={primaryBtn}>
            {isLoading ? (
              <>
                {spinner}
                <span>Sending...</span>
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        </div>
      )}

      {/* OTP Step */}
      {currentStep === "otp" && (
        <div className="grid gap-5">
          <div>
            <label htmlFor="otp" className="t-label mb-2 block">
              Verification Code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={onInputChange}
              onKeyPress={handleKeyPress}
              placeholder="000000"
              maxLength={6}
              className="!text-center !text-2xl !tracking-[0.5em] !font-medium"
              disabled={isLoading}
            />
          </div>

          <button onClick={onVerifyOTP} disabled={isLoading || otp.length !== 6} className={primaryBtn}>
            {isLoading ? (
              <>
                {spinner}
                <span>Verifying...</span>
              </>
            ) : (
              "Verify OTP"
            )}
          </button>

          {/* Resend OTP Section */}
          <div className="text-center">
            <p className="t-small text-ink/70">Didn't receive the code?</p>
            {countdown > 0 ? (
              <p className="t-small mt-1 font-medium text-deep" role="status">
                Resend OTP in {countdown}s
              </p>
            ) : (
              <button
                onClick={handleResendOTP}
                disabled={isLoading}
                className="t-small mt-1 font-medium text-deep underline decoration-tint decoration-2 underline-offset-4 hover:decoration-deep"
              >
                Resend OTP
              </button>
            )}
          </div>

          <button onClick={onBackToEmail} disabled={isLoading} className={backBtn}>
            <ArrowLeft size={18} aria-hidden="true" />
            <span>Back to Email</span>
          </button>
        </div>
      )}

      {/* Password Step */}
      {currentStep === "password" && (
        <div className="grid gap-5">
          {/* New Password */}
          <div>
            <label htmlFor="password" className="t-label mb-2 block">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={onInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter new password"
                className="!pr-12"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-control text-ink/60 transition-colors duration-200 hover:text-deep"
              >
                {showPassword ? <EyeSlash size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="t-label mb-2 block">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={onInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Confirm new password"
                className="!pr-12"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                aria-pressed={showConfirmPassword}
                className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-control text-ink/60 transition-colors duration-200 hover:text-deep"
              >
                {showConfirmPassword ? <EyeSlash size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Password requirements */}
          <div className="rounded-card bg-surface p-4">
            <p className="t-small mb-3 font-medium text-deep">Password Requirements:</p>
            <ul className="grid gap-2">
              {[
                [hasMinLength, "At least 8 characters"],
                [hasUppercase, "One uppercase letter (A-Z)"],
                [hasLowercase, "One lowercase letter (a-z)"],
                [hasSpecialChar, "One special character (!@#$%^&*)"],
                [passwordsMatch, "Passwords match"],
              ].map(([met, label]) => (
                <li key={label as string} className="flex items-center gap-2.5 text-[0.8125rem]">
                  <span
                    aria-hidden="true"
                    className={`size-2 rounded-full transition-colors duration-200 ${met ? "bg-green-500" : "bg-tint"}`}
                  />
                  <span className={met ? "text-green-700" : "text-ink/60"}>{label as string}</span>
                </li>
              ))}
            </ul>

            {/* Password strength */}
            {password.length > 0 && (
              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[0.8125rem] font-medium text-deep">Password Strength:</span>
                  <span
                    className={`text-[0.8125rem] font-medium ${
                      isPasswordValid ? "text-green-700" : hasMinLength && (hasUppercase || hasLowercase) ? "text-yellow-700" : "text-red-600"
                    }`}
                  >
                    {isPasswordValid ? "Strong" : hasMinLength && (hasUppercase || hasLowercase) ? "Medium" : "Weak"}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-tint">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isPasswordValid
                        ? "w-full bg-green-500"
                        : hasMinLength && (hasUppercase || hasLowercase)
                          ? "w-2/3 bg-yellow-500"
                          : "w-1/3 bg-red-500"
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          <button onClick={onResetPassword} disabled={isLoading || !isPasswordValid || !passwordsMatch} className={primaryBtn}>
            {isLoading ? (
              <>
                {spinner}
                <span>Resetting...</span>
              </>
            ) : (
              "Reset Password"
            )}
          </button>

          <button onClick={onBackToOTP} disabled={isLoading} className={backBtn}>
            <ArrowLeft size={18} aria-hidden="true" />
            <span>Back to OTP</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Custom Hooks for API calls
function useSendEmailOTP() {
  return useMutation<
    SendOTPResponse,
    AxiosError<GenericError>,
    { email: string },
    unknown
  >({
    mutationFn: async (data) => {
      const response = await api().post("/email/resetOTP", data);
      return response.data;
    },
    onError: (err) => mutationErrorHandler(err),
  });
}

function useVerifyOTP() {
  return useMutation<
    VerifyOTPResponse,
    AxiosError<GenericError>,
    { email: string; otp: string },
    unknown
  >({
    mutationFn: async (data) => {
      const response = await api().post("/email/verifyOTP", data);
      return response.data;
    },
    onError: (err) => mutationErrorHandler(err),
  });
}

function useResetPassword() {
  return useMutation<
    ResetPasswordResponse,
    AxiosError<GenericError>,
    { email: string; newPassword: string; resetToken: string },
    unknown
  >({
    mutationFn: async (data) => {
      const response = await api().post("/auth/reset-password", data);
      return response.data;
    },
    onError: (err) => mutationErrorHandler(err),
  });
}

// Main ForgotPassword Component
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>("email");
  const { mutateAsync: sendOTP, isPending: isSendingOTP } = useSendEmailOTP();
  const { mutateAsync: verifyOTP, isPending: isVerifyingOTP } = useVerifyOTP();
  const { mutateAsync: resetPassword, isPending: isResettingPassword } = useResetPassword();

  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
    otpSent: false,
    otpVerified: false,
    resetToken: "",
  });

  const { user } = useUser();

  // Computed loading state
  const isLoading = isSendingOTP || isVerifyingOTP || isResettingPassword;

  // If user is already logged in, redirect to home
  if (user) return <Navigate to={"/"} />;

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation helper
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push("Password must be at least 8 characters long");
    if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter");
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push("Password must contain at least one special character");
    return errors;
  };

  // Handle sending OTP
  const handleSendOTP = async () => {
    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const response = await sendOTP({
        email: formData.email.trim(),
      });

      if (response?.message) {
        toast.success("OTP sent to your email address!");
        setFormData(prev => ({ ...prev, otpSent: true }));
        setCurrentStep("otp");
      } else {
        toast.error('Failed to send OTP');
      }
    } catch (error: any) {
      console.error("Send OTP error:", error);
      
      if (error?.response?.status === 429) {
        toast.error('Too many requests. Please try again later.');
      } else if (error?.response?.status === 400) {
        toast.error('Invalid email address');
      } else if (error?.response?.status === 404) {
        toast.error('Email address not found in our system');
      } else {
        toast.error('Failed to send OTP. Please try again.');
      }
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    if (!formData.otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }

    if (formData.otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    try {
      const response = await verifyOTP({
        email: formData.email.trim(),
        otp: formData.otp.trim(),
      });

      if (response?.message) {
        toast.success("OTP verified successfully!");
        setFormData(prev => ({
          ...prev,
          otpVerified: true,
          resetToken: response.resetToken ?? "",
        }));
        setCurrentStep("password");
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      
      if (error?.response?.status === 400) {
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message;
        if (errorMessage === 'OTP has expired') {
          toast.error('OTP has expired. Please request a new one.');
          setFormData(prev => ({ ...prev, otpSent: false, otp: '' }));
          setCurrentStep("email");
        } else if (errorMessage === 'Invalid OTP') {
          toast.error('Invalid OTP. Please check and try again.');
        } else {
          toast.error('Invalid or expired OTP. Please try again.');
        }
      } else {
        toast.error('OTP verification failed. Please try again.');
      }
    }
  };

  // Handle password reset
  const handleResetPassword = async () => {
    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Enhanced password validation
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      toast.error(passwordErrors[0]); // Show first error
      return;
    }

    // Security check: ensure OTP was verified
    if (!formData.otpVerified) {
      toast.error("Please verify OTP first");
      setCurrentStep("otp");
      return;
    }

    try {
      const response = await resetPassword({
        email: formData.email.trim(),
        newPassword: formData.password,
        resetToken: formData.resetToken,
      });

      if (response?.message) {
        toast.success("Password reset successfully!");
        
        // Clear form data for security
        setFormData({
          email: "",
          otp: "",
          password: "",
          confirmPassword: "",
          otpSent: false,
          otpVerified: false,
          resetToken: "",
        });
        
        // Long enough to register the success toast, short enough not to
        // feel stalled.
        setTimeout(() => {
          navigate("/login");
        }, 800);
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      
      if (error?.response?.status === 400) {
        toast.error('Invalid request. Please start the process again.');
        setCurrentStep("email");
      } else if (error?.response?.status === 404) {
        toast.error('Session expired. Please start again.');
        setCurrentStep("email");
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    }
  };

  // Handle resending OTP
  const handleResendOTP = async () => {
    try {
      await handleSendOTP();
    } catch (error) {
      console.error("Resend OTP error:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Input sanitization
    let sanitizedValue = value;
    if (name === "email") {
      sanitizedValue = value.trim().toLowerCase();
    } else if (name === "otp") {
      // Only allow numeric input for OTP
      sanitizedValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    }
    
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
  };

  const handleBackToEmail = () => {
    setCurrentStep("email");
    setFormData((prev) => ({ 
      ...prev, 
      otp: "", 
      password: "", 
      confirmPassword: "",
      otpSent: false,
      otpVerified: false 
    }));
  };

  const handleBackToOTP = () => {
    setCurrentStep("otp");
    setFormData((prev) => ({ 
      ...prev, 
      password: "", 
      confirmPassword: "",
      otpVerified: false 
    }));
  };

  const stepCopy: Record<ForgotPasswordStep, { title: string; description: string }> = {
    email: {
      title: "Reset Password",
      description: "Enter your email address and we'll send you an OTP to reset your password.",
    },
    otp: {
      title: "Verify OTP",
      description: `We've sent a verification code to ${formData.email}. Please enter it below.`,
    },
    password: {
      title: "New Password",
      description: "Enter your new password. Make sure it's strong and secure.",
    },
  };

  return (
    <AuthShell
      title={stepCopy[currentStep].title}
      description={stepCopy[currentStep].description}
      brandTitle="Reset your password and get back to innovating"
      brandText="A few steps and you are back in."
      footer={
        <>
          Remember your password?{" "}
          <Link to="/login" className="font-medium text-deep underline-offset-4 hover:underline">
            Sign In
          </Link>
        </>
      }
    >
      <div className={isLoading ? "pointer-events-none" : undefined} aria-busy={isLoading}>
        <ForgotPasswordForm
          currentStep={currentStep}
          email={formData.email}
          otp={formData.otp}
          password={formData.password}
          confirmPassword={formData.confirmPassword}
          onInputChange={handleInputChange}
          onSendOTP={handleSendOTP}
          onVerifyOTP={handleVerifyOTP}
          onResetPassword={handleResetPassword}
          onResendOTP={handleResendOTP}
          onBackToEmail={handleBackToEmail}
          onBackToOTP={handleBackToOTP}
          isLoading={isLoading}
        />
      </div>
    </AuthShell>
  );
};

export default ForgotPassword;