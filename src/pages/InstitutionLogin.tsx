import React, { useState } from 'react';
import { PasswordInput } from "@/components1/ui/password-input";
import { usePartner } from '@/lib/hooks';
import { Input } from '@/components1/ui/input';
import { Checkbox } from '@/components1/ui/checkbox';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthField, AuthShell } from '@/sfs/components/auth/AuthShell';

type PartnerSignInForm = {
  email: string;
  password: string;
};

const InstitutionLogin = () => {
  const { user } = usePartner();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<PartnerSignInForm>({
    email: '',
    password: '',
  });

  const { signIn, isSigningIn } = usePartner({
    extraOnSuccess: () => navigate('/partner'), // old design redirect
  });

  const [rememberPassword, setRememberPassword] = useState(false);

  const handleSubmit = (event?: React.FormEvent) => {
    if (event) event.preventDefault(); // prevent reload
    signIn(formData);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (user) return <Navigate to="/partner" />;

  return (
    <AuthShell
      scene="partner"
      title="Partner with us to transform education"
      description="Sign in to your partner account."
      brandTitle="Innovate, Incubate and Impact"
      brandText="Join us to innovate, incubate and impact."
    >
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <AuthField label="Email" htmlFor="partner-email">
          <Input
            id="partner-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect="off"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </AuthField>

        <AuthField label="Password" htmlFor="partner-password">
          <PasswordInput
            id="partner-password"
            autoComplete="current-password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </AuthField>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Checkbox
              id="remember"
              checked={rememberPassword}
              onCheckedChange={(checked) => setRememberPassword(checked as boolean)}
              className="size-5 rounded border-tint bg-white data-[state=checked]:border-deep data-[state=checked]:bg-deep data-[state=checked]:text-white"
            />
            <label htmlFor="remember" className="t-small text-ink/70">
              Remember password
            </label>
          </div>
          <button type="button" className="t-small font-medium text-deep underline-offset-4 hover:underline">
            Forgot password?
          </button>
        </div>

        <button className="btn btn-primary w-full" disabled={isSigningIn} type="submit">
          Log in
        </button>
      </form>
    </AuthShell>
  );
};

export default InstitutionLogin;
