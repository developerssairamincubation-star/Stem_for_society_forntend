import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useId, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthField, AuthShell } from "@/sfs/components/auth/AuthShell";
import { useAdmin } from "../../lib/hooks";

type AdminSignInForm = {
  email: string;
  password: string;
};

export default function AdminSignIn() {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from || "/admin";

  const [formData, setFormData] = useState<AdminSignInForm>({
    email: "",
    password: "",
  });

  const { user, signIn, isSigningIn } = useAdmin({
    extraOnSuccess: () => navigate(from, { replace: true }),
  });

  const handleSubmit = (event: React.FormEvent) => {
    // Without this the browser would navigate away on submit.
    event.preventDefault();
    // Sign-in shares one rate limit bucket with every other auth endpoint, so
    // a submission that cannot possibly succeed must not spend an attempt.
    if (!formData.email.trim() || !formData.password) return;
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
      scene="admin"
      title="Admin login"
      description="Enter your credentials to access the admin panel."
      brandTitle="Innovate, Incubate and Impact"
      brandText="STEM for Society administration."
    >
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <AuthField label="Email Address" htmlFor={`${id}-email`}>
          <input
            id={`${id}-email`}
            placeholder="admin@example.com"
            type="email"
            autoComplete="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </AuthField>
        <AuthField label="Password" htmlFor={`${id}-password`}>
          <div className="relative">
            <input
              id={`${id}-password`}
              autoComplete="current-password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              name="password"
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
          {isSigningIn ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
