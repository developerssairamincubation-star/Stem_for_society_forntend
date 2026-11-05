import { toastError } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api, queryClient } from "../lib/api";
import { supabase } from "../lib/supabase";
import PhoneVerificationModal from "@/components1/PhoneVerificationModal";

/**
 * Completes a Google sign-in.
 *
 * The whole exchange is one call to /auth/google carrying the Supabase access
 * token. The server verifies that token with Supabase and decides whether this
 * is a sign-in or a first-time sign-up.
 *
 * This replaces a scheme that derived a password from the Supabase user id
 * ("Google" + six characters of the uuid + "123!") and drove /auth/register and
 * /auth/sign-in with it. Besides making every Google account's password
 * guessable from a public identifier, it could not sign in an address that
 * already had a password account, it broke on names shorter than three
 * characters, and it matched on backend error strings that no longer existed -
 * so a user who had not signed up was told "Invalid email or password".
 */

type GoogleAuthResponse = {
  data: {
    token: string;
    user: Record<string, unknown>;
  };
};

const AuthCallback = () => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  /** Guards against the effect running twice under React 18 strict mode. */
  const startedRef = useRef(false);

  /** Stores the session this app issues, and sends the visitor on their way. */
  const completeSignIn = useCallback(
    (payload: GoogleAuthResponse) => {
      queryClient.setQueryData(["auth"], payload.data);
      localStorage.setItem(
        "studentAuth",
        JSON.stringify({ ...payload.data, timestamp: Date.now() }),
      );
      toast.success("Signed in successfully.");

      /**
       * Return the visitor to whatever sent them to sign in. The Google button
       * preserves it across the OAuth round trip in sessionStorage, because the
       * redirect back from Google cannot carry app state in the URL.
       */
      let returnTo = "/";
      try {
        returnTo = sessionStorage.getItem("postLoginRedirect") || "/";
        sessionStorage.removeItem("postLoginRedirect");
      } catch {
        /* storage unavailable; the default is fine */
      }
      navigate(returnTo, { replace: true });
    },
    [navigate],
  );

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let isMounted = true;

    const finishAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        // Surface Google's own refusal rather than reporting "no session".
        const oauthError = params.get("error_description") || params.get("error");
        if (oauthError) {
          throw new Error(oauthError);
        }

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        let session = sessionData.session;

        // Implicit-flow fallback: the tokens arrive in the URL fragment.
        if (!session && window.location.hash.includes("access_token")) {
          const hashParams = new URLSearchParams(window.location.hash.slice(1));
          const access_token = hashParams.get("access_token");
          const refresh_token = hashParams.get("refresh_token");
          if (access_token && refresh_token) {
            const { data, error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (error) throw error;
            session = data.session ?? null;
          }
        }

        if (sessionError || !session?.access_token) {
          throw new Error(
            sessionError?.message || "Google did not return a session.",
          );
        }

        if (!isMounted) return;
        setAccessToken(session.access_token);

        try {
          const response = await api().post<GoogleAuthResponse>("/auth/google", {
            accessToken: session.access_token,
          });
          if (isMounted) completeSignIn(response.data);
        } catch (error: any) {
          /**
           * The one expected failure: there is no account yet and the server
           * needs a mobile number before it can create one. Everything else is
           * a real error.
           */
          if (error?.response?.data?.code === "PHONE_REQUIRED") {
            if (isMounted) {
              setPendingEmail(session.user?.email ?? "");
              setShowPhoneVerification(true);
            }
            return;
          }
          throw error;
        }
      } catch (error: any) {
        console.error("Google sign-in failed:", error);
        toastError(error, "Google sign-in failed");
        if (isMounted) navigate("/login", { replace: true });
      }
    };

    void finishAuth();
    return () => {
      isMounted = false;
    };
  }, [navigate, completeSignIn]);

  const handlePhoneVerificationSuccess = async (mobile: string) => {
    if (!accessToken) {
      toast.error("Your Google session expired. Please try again.");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const response = await api().post<GoogleAuthResponse>("/auth/google", {
        accessToken,
        mobile,
      });
      setShowPhoneVerification(false);
      completeSignIn(response.data);
    } catch (error: any) {
      console.error("Google sign-up failed:", error);
      // Kept open so a duplicate mobile number can be corrected in place
      // instead of restarting the whole OAuth round trip.
      toastError(error, "Could not finish creating your account");
    }
  };

  return (
    <div className="sfs-ui sfs-skin flex min-h-screen items-center justify-center bg-surface px-4">
      <PhoneVerificationModal
        isOpen={showPhoneVerification}
        onClose={() => {
          setShowPhoneVerification(false);
          navigate("/login", { replace: true });
        }}
        onSuccess={handlePhoneVerificationSuccess}
        userEmail={pendingEmail}
      />
      {!showPhoneVerification && (
        <div role="status" aria-live="polite" className="card flex flex-col items-center px-10 py-10 text-center shadow-raised">
          <img src="/images/brand/sfs-logo.png" alt="" width={56} height={56} className="mb-6 size-14 object-contain" />
          <div className="login-spinner size-9 rounded-full border-[3px] border-tint border-t-deep" aria-hidden="true" />
          <p className="t-body mt-5 font-medium">Completing sign-in...</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
