import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { clientSafeText } from "@/lib/errors";
import { Alert, Rating, Textarea } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CalendarBlank, CaretLeft, MapPin, NotePencil, ShareNetwork, Certificate } from "@phosphor-icons/react";
import { PageFrame, PageHero } from "@/sfs/components/page/PageFrame";
import { PageLoading } from "@/sfs/components/page/PageStatus";
import { useCallback, useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useShare } from "@/hooks/useShare";
import { SharePopup } from "@/components1/ui/SharePopup";
import Errorbox from "../components/Errorbox";
import { RZPY_KEYID } from "../Constants";
import { api, queryClient } from "../lib/api";
import { useUser } from "../lib/hooks";
import EnrolmentConfirmDialog from "@/components1/EnrolmentConfirmDialog";
import RazorpayInstance, {
  GenericError,
  GenericResponse,
  RazorpayOrderOptions,
} from "../lib/types";
import {
  formatDate,
  initializeRazorpay,
  mutationErrorHandler,
} from "../lib/utils";
import { StudentTraining } from "./Training";
import ReactPlayer from "react-player";

function useTraining(id?: string) {
  return useQuery<GenericResponse<StudentTraining>, AxiosError<GenericError>>({
    queryKey: ["trainings", id],
    queryFn: async () => (await api().get(`/trainings/${id}`)).data,
    staleTime: 1000 * 60 * 10,
  });
}

export type CreatePaymentResponse = {
  amount: string;
  orderId: string;
};

type FeedbackResponse = {
  rating: number;
  feedback: string;
};

function useEnroll(id?: string) {
  const navigate = useNavigate();
  const location = useLocation();
  const loginUrl = `/login?returnTo=${encodeURIComponent(
    `${location.pathname}${location.search}${location.hash}`
  )}`;
  return useMutation<
    GenericResponse<CreatePaymentResponse>,
    AxiosError<GenericError>
  >({
    mutationFn: async () =>
      (await api().post(`/payments/create`, { trainingId: id })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainings"] });
    },
    onError: (err) => mutationErrorHandler(err, navigate, loginUrl),
  });
}

function useSubmitFeedback(id: string) {
  const navigate = useNavigate();
  const location = useLocation();
  const loginUrl = `/login?returnTo=${encodeURIComponent(
    `${location.pathname}${location.search}${location.hash}`
  )}`;
  return useMutation<
    GenericResponse,
    AxiosError<GenericError>,
    FeedbackResponse
  >({
    mutationFn: async ({ rating, feedback }: FeedbackResponse) => {
      const response = await api().post(`/trainings/${id}/feedback`, {
        rating,
        feedback,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["trainings", id] });
      toast.success(data.message);
    },
    onError: (err) => mutationErrorHandler(err, navigate, loginUrl),
  });
}

function TrainingSpotlight() {
  const { id } = useParams();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { isShowing, handleShare } = useShare();
  const { data, isLoading, error } = useTraining(id);
  const { user } = useUser();
  const { mutateAsync, isPending } = useEnroll(id);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const loginUrl = `/login?returnTo=${encodeURIComponent(
    `${routerLocation.pathname}${routerLocation.search}${routerLocation.hash}`
  )}`;

  const handlePayment = useCallback(async () => {
    try {
      const rzrpyInit = await initializeRazorpay();
      if (!rzrpyInit) return toast.error("Unable to initialize payment!");
      const data = await mutateAsync();
      if (!data.data) {
        toast.error("Something went wrong in creating payment!");
        return;
      }
      const order = data.data;

      const options: RazorpayOrderOptions = {
        key: RZPY_KEYID,
        amount: Number(order.amount) * 100,
        currency: "INR",
        name: "Stem for Society",
        description: "Premium plan purchase",
        image: `${window.location.origin}/logo-01.png`,
        order_id: order.orderId,
        prefill: {
          name: user?.user.firstName,
          email: user?.user.email,
          contact: user?.user.mobile,
        },
        async handler(response) {
          try {
            if ("error" in response) {
              // @ts-expect-error smh
              toast.error(clientSafeText(response.error.reason));
              queryClient.invalidateQueries({ queryKey: ["trainings"] });
              return;
            }

            /**
             * Confirm the payment with our own server before claiming success.
             * This page previously only showed a toast: the checkout callback
             * is the one moment Razorpay hands us the signature, and
             * /payments/verify-client is what flips the transaction from
             * "pending" to "success". Without it, a course bought from here
             * depended entirely on the webhook - the same purchase made from
             * /course-detail worked, this one silently did not.
             */
            await api().post("/payments/verify-client", {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            toast.success("Payment successful - you are now enrolled.");

            await queryClient.invalidateQueries({ queryKey: ["trainings"] });
            await queryClient.invalidateQueries({ queryKey: ["trainings", id] });

            // Straight to My Courses: that is where the purchase now lives.
            navigate("/courses");
          } catch (error) {
            console.error("Payment verification failed:", error);
            toast.error(
              "Your payment went through but could not be confirmed automatically. " +
                "It will be reconciled shortly - please contact us if it does not appear.",
              { autoClose: false, closeOnClick: false },
            );
          }
        },
      };

      // @ts-expect-error dhe chi pae
      const rzp: RazorpayInstance = new Razorpay(options);

      rzp.on("payment.failed", (res) => {
        console.log("Failure:", res);
        toast.error("Payment failed! Reason:\n" + clientSafeText(res.error.description), {
          autoClose: false,
          closeOnClick: false,
        });
        toast.error(
          "Please note Order ID: " +
            res.error.metadata.order_id +
            "\n Payment ID: " +
            res.error.metadata.payment_id,
          { autoClose: false, closeOnClick: false },
        );
      });

      rzp.open();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status === 401) {
          toast.error("Please login again");
          return;
        }
      }
      console.error("Payment could not be started:", error);
      toast.error("Something went wrong starting the payment. Please try again.");
    }
    /**
     * `user` and `mutateAsync` are read inside this callback. With an empty
     * dependency array it closed over the values from the first render, so the
     * Razorpay prefill went out empty whenever the profile finished loading
     * after mount.
     */
  }, [user, mutateAsync, id]);

  if (isLoading) {
    return <PageLoading label="Loading event…" />;
  }

  const framed = (node: React.ReactNode) => (
    <PageFrame tone="surface">
      <div className="container-x pt-32 pb-16">{node}</div>
    </PageFrame>
  );

  if (error) {
    return framed(<Errorbox message={error.message} />);
  }

  const event = data?.data;

  if (!event) {
    return framed(<Errorbox message="Something went wrong!" />);
  }

  const detail = "grid gap-1 border-b border-tint py-4 sm:grid-cols-[10rem_1fr] sm:gap-6";
  const label = "t-small text-ink/60";

  return (
    <PageFrame tone="surface">
      <PageHero
        kicker={
          <Link to={"/courses"} className="nudge inline-flex items-center gap-2 text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white">
            <CaretLeft size={16} aria-hidden="true" />
            Back
          </Link>
        }
        title={event.title}
        description={event.description}
        actions={
          <button type="button" onClick={handleShare} className="btn btn-inverse">
            <ShareNetwork size={18} aria-hidden="true" />
            Share
          </button>
        }
      />

      <section className="section" aria-label="Event details">
        <div className="container-x grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="grid content-start gap-8">
            <img src={event.coverImg} alt={event.title} className="aspect-video w-full rounded-card bg-white object-contain" />

            {event.lessons && event.lessons.length > 0 && (
              <div className="grid gap-4">
                <h2 className="t-title">Course Content</h2>
                {event.lessons.map((l) => (
                  <div className="card p-5 sm:p-6" key={l.id}>
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="t-heading">{l.title}</h3>
                      <span className="chip shrink-0 text-deep">{l.type}</span>
                    </div>
                    {l.content && <div className="ql-snow" dangerouslySetInnerHTML={{ __html: sanitizeHtml(l.content) }}></div>}
                    <div className="mt-3 flex flex-col gap-3">
                      <span className="t-small inline-flex items-center gap-2 text-ink/70">
                        <CalendarBlank size={16} aria-hidden="true" />
                        {formatDate(l.lastDate)}
                      </span>
                      {l.type === "ONLINE" && l.video && (
                        <div className="relative overflow-hidden rounded-card pt-[56.25%]">
                          <ReactPlayer
                            url={l.video}
                            controls
                            height={"100%"}
                            width={"100%"}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                            }}
                          />
                        </div>
                      )}
                    </div>
                    {l.type === "OFFLINE" && l.location && (
                      <div className="t-small mt-3 inline-flex items-center gap-2 text-ink/70">
                        <MapPin size={16} aria-hidden="true" />
                        {l.location}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid content-start gap-6 max-lg:order-first lg:sticky lg:top-28 lg:self-start">
            <dl className="card px-6 py-2">
              <div className={detail}>
                <dt className={label}>Instructor</dt>
                <dd className="t-body font-medium">{event.instructor.firstName + " " + (event.instructor.lastName ?? "")}</dd>
              </div>
              {event.instructor.institutionName && (
                <div className={detail}>
                  <dt className={label}>Institution</dt>
                  <dd className="t-body font-medium">{event.instructor.institutionName}</dd>
                </div>
              )}
              {event.enrolments?.length === 1 && event.link && (
                <div className={detail}>
                  <dt className={label}>Enrolled On</dt>
                  <dd className="t-body font-medium">{formatDate(event.enrolments?.[0]?.createdAt)}</dd>
                </div>
              )}
              <div className={detail}>
                <dt className={label}>Dates</dt>
                <dd className="t-body font-medium">{formatDate(event.startDate) + " to " + formatDate(event.endDate)}</dd>
              </div>
              <div className={detail}>
                <dt className={label}>Mode</dt>
                <dd className="t-body font-medium">{event.type ?? (event.location ? "Offline" : "Online")}</dd>
              </div>
              {event.location && (
                <div className={detail}>
                  <dt className={label}>Location</dt>
                  <dd className="t-body font-medium">{event.location}</dd>
                </div>
              )}
              {event.isEnrolled && (
                <div className={detail}>
                  <dt className={label}>Event Link</dt>
                  <dd className="t-body break-all font-medium">
                    <a href={event.link} target="_blank" rel="noreferrer" className="text-deep underline decoration-tint decoration-2 underline-offset-4 hover:decoration-deep">
                      {event.link}
                    </a>
                  </dd>
                </div>
              )}
              <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <dt className={label}>Price</dt>
                <dd className="t-body font-medium">₹{event.cost}</dd>
              </div>
            </dl>

            <div className="grid gap-4">
              {!user ? (
                <Link to={loginUrl} className="btn btn-primary">
                  <NotePencil size={18} aria-hidden="true" />
                  Sign in to register
                </Link>
              ) : !event.isEnrolled ? (
                <button type="button" className="btn btn-primary" onClick={() => setConfirmOpen(true)} disabled={isPending}>
                  <NotePencil size={18} aria-hidden="true" />
                  {isPending ? "Please wait..." : "Enroll Now"}
                </button>
              ) : (
                <div className="grid gap-4">
                  <button type="button" className="btn btn-primary" disabled>
                    <NotePencil size={18} aria-hidden="true" />
                    You are already registered
                  </button>
                  {event.displayFeedback && (
                    <div className="card grid gap-3 p-5">
                      <RatingAndFeedback data={event} id={id!} disabled={event.ratings.length > 0} />
                    </div>
                  )}
                </div>
              )}
              <EnrolmentConfirmDialog
                opened={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => {
                  setConfirmOpen(false);
                  void handlePayment();
                }}
                user={user?.user ?? null}
                courseTitle={event.title}
                cost={event.cost}
                startDate={event.startDate ? formatDate(event.startDate) : null}
                isProcessing={isPending}
                loginUrl={loginUrl}
              />

              {event.enrolments?.[0]?.certificate && (
                <Alert color="green" radius="md">
                  <h3 className="t-heading text-green-700">Congratulations! You have successfully completed the training</h3>
                  <p className="t-body mt-1 text-green-800">You have earned a certificate and is now available for you to download!</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link target="_blank" to={event.enrolments?.[0]?.certificate} className="btn btn-primary">
                      <Certificate size={18} aria-hidden="true" />
                      Download now
                    </Link>
                    <Link
                      target="_blank"
                      className="btn btn-secondary"
                      to={`https://www.linkedin.com/shareArticle?mini=true&url=${event.enrolments?.[0]?.certificate}&text=Hello connections! I have completed a course with STEM for society website and have earned a certificate on ${event.title}`}
                    >
                      <FaLinkedin aria-hidden="true" /> Share
                    </Link>
                  </div>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </section>
      <SharePopup isVisible={isShowing} />
    </PageFrame>
  );
}

function RatingAndFeedback({
  id,
  data,
  disabled,
}: {
  id: string;
  data: StudentTraining;
  disabled?: boolean;
}) {
  const [rating, setRating] = useState<number>(
    data.ratings ? data.ratings[0]?.rating : 0,
  );
  const [feedback, setFeedback] = useState<string>(
    data.ratings ? data.ratings[0]?.feedback : "",
  );
  const mutation = useSubmitFeedback(id as string);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ rating, feedback });
  };

  return (
    <>
      <Rating
        value={rating}
        onChange={setRating}
        className={disabled ? "opacity-80 pointer-events-none" : ""}
      />
      <Textarea
        rows={5}
        value={feedback}
        className={disabled ? "opacity-80 pointer-events-none" : ""}
        onChange={(event) => setFeedback(event.currentTarget.value)}
        placeholder="Enter feedback to apply for certificate"
      />
      <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={data.ratings?.length > 0 || mutation.isPending}>
        {data.ratings?.length > 0 ? "Already submitted" : "Submit feedback"}
      </button>
    </>
  );
}

export default TrainingSpotlight;
