import React, { useState } from 'react';
import { PasswordInput } from "@/components1/ui/password-input";
import { usePartner } from '@/lib/hooks';
import { Input } from '@/components1/ui/input';
import { Checkbox } from '@/components1/ui/checkbox';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthField, AuthShell } from '@/sfs/components/auth/AuthShell';


type PartnerSignInForm = {
  email: string;
  password: string;
};

const CampusAmbassadorSignup = () => {
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
    //signIn(formData);
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
      title="Partner with us to transform education!"
      description="Sign in to continue."
      brandTitle="Innovate, Incubate and Impact"
      brandText="Join us to Innovate, Incubate and Impact!"
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/campus-ambassador" className="font-medium text-deep underline-offset-4 hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <AuthField label="Email" htmlFor="ca-email">
          <Input
            id="ca-email"
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

        <AuthField label="Password" htmlFor="ca-password">
          <PasswordInput
            id="ca-password"
            autoComplete="new-password"
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
              Remember Password
            </label>
          </div>
          <button type="button" className="t-small font-medium text-deep underline-offset-4 hover:underline">
            Forget Password?
          </button>
        </div>

        <button className="btn btn-primary w-full" disabled={isSigningIn} type="submit">
          LOGIN
        </button>
      </form>
    </AuthShell>
  );
};

export default CampusAmbassadorSignup;
