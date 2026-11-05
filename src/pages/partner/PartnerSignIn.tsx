import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useId, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthField, AuthShell } from "@/sfs/components/auth/AuthShell";
import { usePartner } from "../../lib/hooks";

type PartnerSignInForm = {
  email: string;
  password: string;
};

export default function PartnerSignIn() {
  const { user } = usePartner();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from || "/partner";

  const [formData, setFormData] = useState<PartnerSignInForm>({
    email: "",
    password: "",
  });

  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, isSigningIn } = usePartner({
    extraOnSuccess: () => navigate(from, { replace: true }),
  });

  const handleSubmit = () => {
    signIn(formData);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (user) return <Navigate to={from} replace />;

  return (
    <AuthShell
      title="Partner Login"
      description="Enter your credentials to access your dashboard"
      brandTitle="Innovate, Incubate and Impact"
      brandText="Partner with us to transform education."
      footer={
        <>
          Want to partner with us?{" "}
          <Link to="/partner/signup" className="font-medium text-deep underline-offset-4 hover:underline">
            Sign up now
          </Link>
        </>
      }
    >
      <form
        className="grid gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <AuthField label="Email Address" htmlFor={`${id}-email`}>
          <input
            id={`${id}-email`}
            placeholder="Enter your email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleInputChange}
          />
        </AuthField>
        <AuthField label="Password" htmlFor={`${id}-password`}>
          <div className="relative">
            <input
              id={`${id}-password`}
              placeholder="Enter your password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="!pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-control text-ink/60 transition-colors duration-200 hover:text-deep"
            >
              {showPassword ? <EyeSlash size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
            </button>
          </div>
        </AuthField>
        <button disabled={isSigningIn} type="submit" className="btn btn-primary w-full">
          {isSigningIn ? "Signing in..." : "Login"}
        </button>
      </form>
    </AuthShell>
  );
}
