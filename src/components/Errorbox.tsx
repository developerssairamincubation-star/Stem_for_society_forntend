import { messageError } from "../lib/errors";
import AppErrorFallback from "./error/AppErrorFallback";

type Props = {
  /** Optional: a network failure has no server message, and a missing one used to crash this panel. */
  message?: string;
  onRetry?: () => void;
};

/**
 * Inline error panel kept at its original call signature so existing pages do
 * not need changing. The message now passes through the safety filter, so a raw
 * server string can no longer surface internals to a visitor.
 *
 * New code should prefer `components/error/ErrorState`, which takes the error
 * object itself and can therefore classify it properly.
 */
export default function Errorbox({ message, onRetry }: Props) {
  return (
    <AppErrorFallback
      error={messageError(message ?? "We could not load this right now.")}
      onRetry={onRetry}
      variant="inline"
      showHome={false}
    />
  );
}
