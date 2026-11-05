import { mutationErrorHandler, toastError } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components1/ui/input";
import { PhoneInput } from "@/components1/ui/phone-input";
import { PasswordInput } from "@/components1/ui/password-input";
import { Checkbox } from "@/components1/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { api, queryClient, clearAuthStorage } from "../lib/api";
import { GenericError, GenericResponse } from "../lib/types";
import { signInWithGoogle } from "../lib/supabaseAuth";
import { AuthDivider, AuthField, AuthShell, GoogleMark } from "@/sfs/components/auth/AuthShell";

type SignUpForm = {
  firstName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  accept: boolean;
};

// backend API hook
function useSignUp(navigate: ReturnType<typeof useNavigate>) {
  return useMutation<
    GenericResponse,
    AxiosError<GenericError>,
    SignUpForm,
    unknown
  >({
    mutationFn: async (data) => {
      const res = await api().post("/auth/register", data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/login");
    },
    // Was a local copy of the shared handler; it surfaced raw `error.message`
    // (e.g. "Request failed with status code 500") straight to the visitor.
    onError: (error) => mutationErrorHandler(error),
  });
}

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpForm>({
    firstName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    accept: false,
  });

  const [isGoogleSigningUp, setIsGoogleSigningUp] = useState(false);

  const signUpMutation = useSignUp(navigate);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      accept: checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    /**
     * Check the text inputs only. The previous version ran every key of
     * formData - including the `accept` checkbox - through a truthiness test,
     * so leaving the terms box unticked reported "Please fill in all fields"
     * even when every field was filled, and the accurate message below could
     * never be reached.
     */
    const requiredFields: (keyof SignUpForm)[] = [
      "firstName",
      "email",
      "mobile",
      "password",
      "confirmPassword",
    ];
    if (requiredFields.some((field) => !String(formData[field]).trim())) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!formData.accept) {
      toast.warn("Accept terms and conditions to continue");
      return;
    }

    // Start the new registration from a clean session, without discarding
    // unrelated keys other parts of the site own.
    queryClient.clear();
    clearAuthStorage();

    signUpMutation.mutate(formData);
  };

  // Google sign-up function - redirects to OAuth flow
  const handleGoogleSignup = async () => {
    try {
      // Disable all background activities
      setIsGoogleSigningUp(true);
      await signInWithGoogle("signup");
    } catch (error: any) {
      console.error('Google sign-up error:', error);
      toastError(error, "Failed to sign up with Google");
      setIsGoogleSigningUp(false);
    }
  };

  // Determine if any loading state is active
  const isAnyLoading = signUpMutation.isPending || isGoogleSigningUp;

  return (
    <AuthShell
      title="Create an account"
      description="Enter your details to get started."
      brandTitle="Join the community"
      brandText="Join us to Innovate, Incubate and Impact the world together!"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-deep underline-offset-4 hover:underline">
            Login
          </Link>
        </>
      }
    >
      {/* Global loading overlay for Google sign-up */}
      {isGoogleSigningUp && (
        <div role="alertdialog" aria-modal="true" aria-label="Signing up with Google" className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 backdrop-blur-sm">
          <div className="flex max-w-sm flex-col items-center rounded-card bg-white p-8 text-center shadow-overlay">
            <div className="login-spinner size-10 rounded-full border-[3px] border-tint border-t-deep" aria-hidden="true" />
            <p className="t-heading mt-5">Signing up with Google...</p>
            <p className="t-small mt-2 text-ink/70">Please complete the sign-up process in the popup window</p>
            <button type="button" onClick={() => setIsGoogleSigningUp(false)} className="t-small mt-5 text-deep underline underline-offset-4">
              Cancel
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-4">
        <AuthField label="Name" htmlFor="signup-name">
          <Input
            id="signup-name"
            name="firstName"
            type="text"
            placeholder="Enter your name"
            value={formData.firstName}
            onChange={handleChange}
            required
            disabled={isAnyLoading}
          />
        </AuthField>
        <AuthField label="Email" htmlFor="signup-email">
          <Input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect="off"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isAnyLoading}
          />
        </AuthField>
        <AuthField label="Phone" htmlFor="signup-phone">
          <PhoneInput
            id="signup-phone"
            name="mobile"
            value={formData.mobile}
            onChange={(mobile) => setFormData((prev) => ({ ...prev, mobile }))}
            required
            disabled={isAnyLoading}
          />
        </AuthField>
        <div className="grid gap-4">
          <AuthField label="Password" htmlFor="signup-password">
            <PasswordInput
              id="signup-password"
              autoComplete="new-password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isAnyLoading}
            />
          </AuthField>
          <AuthField label="Confirm Password" htmlFor="signup-confirm">
            <PasswordInput
              id="signup-confirm"
              autoComplete="new-password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isAnyLoading}
            />
          </AuthField>
        </div>

        <div className="flex items-center gap-3 py-1">
          <Checkbox
            id="terms"
            checked={formData.accept}
            onCheckedChange={handleCheckboxChange}
            disabled={isAnyLoading}
            className="size-5 rounded border-tint bg-white data-[state=checked]:border-deep data-[state=checked]:bg-deep data-[state=checked]:text-white"
          />
          <label htmlFor="terms" className="t-small text-ink/70">
            I accept the terms and conditions
          </label>
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={isAnyLoading}>
          {signUpMutation.isPending ? "Please wait..." : "Sign Up"}
        </button>
      </form>

      <AuthDivider label="or sign up with" />

      <button type="button" onClick={handleGoogleSignup} disabled={isAnyLoading} className="btn btn-secondary w-full !border-tint !text-ink hover:!bg-surface">
        <GoogleMark />
        {isGoogleSigningUp ? "Signing up..." : "Sign up with Google"}
      </button>
    </AuthShell>
  );
};

export default Signup;
