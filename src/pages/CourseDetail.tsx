import { clientSafeText } from "@/lib/errors";
import { useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle, Certificate, ArrowSquareOut, CalendarBlank, MapPin, UserCircle } from "@phosphor-icons/react";
import { PageFrame, PageHero } from "@/sfs/components/page/PageFrame";
import { PageLoading } from "@/sfs/components/page/PageStatus";
import { Reveal } from "@/sfs/components/ui/Reveal";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { api, queryClient } from "@/lib/api";
import { GenericError, GenericResponse, RazorpayOrderOptions } from "@/lib/types";
import {
  calculateDuration,
  calculateDurationForEmail,
  formatDate,
  mutationErrorHandler,
  initializeRazorpay,
} from "@/lib/utils";
import Errorbox from "@/components/Errorbox";
import { useUser } from "@/lib/hooks";
import { Rating, Textarea } from "@mantine/core";
import { RZPY_KEYID } from "@/Constants";
import type { StudentTraining } from "./Courses";
import EnrolmentConfirmDialog from "@/components1/EnrolmentConfirmDialog";
import { FaLinkedin } from "react-icons/fa";

// Hook to fetch single training
function useTraining(id?: string) {
  return useQuery<GenericResponse<StudentTraining>, AxiosError<GenericError>>({
    queryKey: ["trainings", id],
    queryFn: async () => {
      const response = await api().get(`/trainings/${id}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}

// Payment types
type CreatePaymentResponse = {
  amount: string;
  orderId: string;
};

function useEnroll(id?: string) {
  const nav = useNavigate();
  const location = useLocation();
  const loginUrl = `/login?returnTo=${encodeURIComponent(
    `${location.pathname}${location.search}${location.hash}`
  )}`;
  return useMutation<GenericResponse<CreatePaymentResponse>, AxiosError<GenericError>>({
    mutationFn: async () => {
      return (await api().post("/payments/create", { trainingId: id })).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainings"] });
      queryClient.invalidateQueries({ queryKey: ["trainings", id] });
    },
    onError: (err) => mutationErrorHandler(err, nav, loginUrl),
  });
}

// Feedback submission hook
function useSubmitFeedback(id: string) {
  const navigate = useNavigate();
  const location = useLocation();
  const loginUrl = `/login?returnTo=${encodeURIComponent(
    `${location.pathname}${location.search}${location.hash}`
  )}`;
  return useMutation<
    GenericResponse,
    AxiosError<GenericError>,
    { rating: number; feedback: string }
  >({
    mutationFn: async ({ rating, feedback }) => {
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

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user: userData } = useUser();
  
  const { data: trainingData, isLoading, error } = useTraining(id);
  const { mutateAsync, isPending } = useEnroll(id);
  const [confirmOpen, setConfirmOpen] = useState(false);
  
  const training = trainingData?.data;
  const loginUrl = `/login?returnTo=${encodeURIComponent(
    `${location.pathname}${location.search}${location.hash}`
  )}`;

  // Rating and Feedback Component
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
    data.ratings ? data.ratings[0]?.rating : 0
  );
  const [feedback, setFeedback] = useState<string>(
    data.ratings ? data.ratings[0]?.feedback : ""
  );
  const mutation = useSubmitFeedback(id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5 stars.");
      return;
    }
    if (!feedback || feedback.trim().length < 3) {
      toast.error("Feedback must be at least 3 characters.");
      return;
    }
    if (feedback.trim().length > 200) {
      toast.error("Feedback cannot exceed 200 characters.");
      return;
    }
    mutation.mutate({ rating, feedback });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-900">Rate & Review</h4>
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
        minLength={10}
      />
      <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={data.ratings?.length > 0 || mutation.isPending}>
        {data.ratings?.length > 0 ? "Already submitted" : "Submit feedback"}
      </button>
    </div>
  );
}

  // Get mode text
  const getModeText = () => {
    if (!training?.type) return "Online";
    switch (training.type) {
      case "ONLINE": return "Online";
      case "OFFLINE": return "Offline";
      case "HYBRID": return "Hybrid(Online + Inperson)";
      default: return "Online";
    }
  };

  // Check if user is enrolled
  const isEnrolled = () => {
    if (!training) return false;
    if (training.isEnrolled) return true;
    return training.enrolments?.some(enrollment =>
      enrollment.transactions?.some(transaction => transaction.status === "success")
    );
  };


  // Handle payment with full error handling and email
  const handlePayment = useCallback(async () => {
    try {
      const rzrpyInit = await initializeRazorpay();
      if (!rzrpyInit) return toast.error("Unable to initialize payment!");
      
      const paymentData = await mutateAsync();
      if (!paymentData.data) {
        toast.error("Something went wrong in creating payment!");
        return;
      }
      
      const order = paymentData.data;

      const options: RazorpayOrderOptions = {
        key: RZPY_KEYID,
        amount: Number(order.amount) * 100,
        currency: "INR",
        name: "STEM For Society",
        description: training?.title || "Course Enrollment",
        image: `${window.location.origin}/logo-01.png`,
        order_id: order.orderId,
        prefill: {
          name: userData?.user?.firstName + " " + (userData?.user?.lastName || ""),
          email: userData?.user?.email,
          contact: userData?.user?.mobile,
        },
        async handler(response) {
          try {
            if ("error" in response) {
              // @ts-expect-error error handling
              toast.error(clientSafeText(response.error.reason));
              queryClient.invalidateQueries({ queryKey: ["trainings"] });
              queryClient.invalidateQueries({ queryKey: ["trainings", id] });
              return;
            }
            
            /**
             * Confirm the payment with our own server before claiming success.
             * The checkout callback is the only moment Razorpay hands us the
             * signature, and /payments/verify-client is what flips the
             * transaction from "pending" to "success" and stores the payment
             * id. Without this call the money is taken but the enrolment never
             * shows up under My Courses. The webhook is a backstop for the
             * closed-tab case, not a substitute for this.
             */
            await api().post("/payments/verify-client", {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            toast.success("Payment successful - you are now enrolled.");

            // Force immediate refresh
            await queryClient.invalidateQueries({ queryKey: ["trainings"] });
            await queryClient.invalidateQueries({ queryKey: ["trainings", id] });
            await queryClient.refetchQueries({ queryKey: ["trainings", id] });

            // Straight to My Courses: that is where the purchase now lives.
            navigate("/courses");
            
            // Send course registration email
            try {
              await api().post('/email/send-course-registration', {
                userEmail: userData?.user?.email,
                userName: userData?.user?.firstName,
                courseName: training?.title || 'Course',
                amount: Number(order.amount),
                currency: 'INR',
                paymentId: response.razorpay_payment_id,
                courseDuration: calculateDurationForEmail(
                  training?.startDate || "",
                  training?.endDate || "",
                ),
                startDate: formatDate(training?.startDate || ''),
                phoneNumber: userData?.user?.mobile
              });
            } catch (emailError) {
              console.error('Failed to send course registration email:', emailError);
            }
            
          } catch (error) {
            console.error("Payment handler error:", error);
            toast.error(
              "Payment was received but could not be confirmed. Please contact support with Order ID: " +
                order.orderId,
              { autoClose: false, closeOnClick: false },
            );
            await queryClient.invalidateQueries({ queryKey: ["trainings"] });
            await queryClient.invalidateQueries({ queryKey: ["trainings", id] });
          }
        },
      };

      // @ts-expect-error Razorpay global
      const rzp = new Razorpay(options);

      rzp.on("payment.failed", async (res: any) => {
        console.error("Payment Failure:", res);
        toast.error("Payment failed! Reason:\n" + clientSafeText(res.error.description), {
          autoClose: false,
          closeOnClick: false,
        });
        toast.error(
          "Please note Order ID: " + res.error.metadata.order_id +
          "\n Payment ID: " + res.error.metadata.payment_id,
          { autoClose: false, closeOnClick: false }
        );
        await queryClient.invalidateQueries({ queryKey: ["trainings"] });
        await queryClient.invalidateQueries({ queryKey: ["trainings", id] });
      });

      rzp.open();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status === 401) {
          toast.error("Please login again");
          return;
        }
      }
      console.error("Payment error:", error);
      toast.error("Something went wrong in the payment process");
    }
  }, [mutateAsync, userData, id, training]);

  // Handle registration
  const handleRegister = async () => {
    /**
     * A signed-out visitor opens the same dialog, which asks them to sign in
     * rather than bouncing them to /login the instant they show interest. They
     * get to see the course and price first, and land back here afterwards.
     */
    if (!userData) {
      setConfirmOpen(true);
      return;
    }

    if (isEnrolled()) {
      toast.info("You are already enrolled in this course");
      return;
    }

    // Nothing is charged or created until the dialog is confirmed.
    setConfirmOpen(true);
  };

  /** Runs only after the visitor confirms in the dialog. */
  const handleConfirmEnrolment = async () => {
    setConfirmOpen(false);

    if (training?.cost === "0" || training?.cost === "free") {
      try {
        await api().post(`/trainings/${id}/enroll`);
        await queryClient.invalidateQueries({ queryKey: ["trainings", id] });
        toast.success("You are enrolled. Find it under My Courses.");
        navigate("/courses");
      } catch (err) {
        toast.error("Failed to enroll");
      }
      return;
    }

    handlePayment();
  };

  // Get course tags
  const getCourseTags = (): string[] => {
    const tags: string[] = [];
    if (training?.category) {
      tags.push(training.category);
    } else {
      tags.push("Certificate Program");
    }

      tags.push("For Individuals");

    return tags;
  };

  const framed = (node: React.ReactNode) => (
    <PageFrame tone="surface">
      <div className="container-x pt-32 pb-16">{node}</div>
    </PageFrame>
  );
  if (isLoading) return <PageLoading label="Loading course…" />;
  if (error) return framed(<Errorbox message={error.message} />);
  if (!training) return framed(<Errorbox message="Course not found" />);

  const instructorName = `${training.instructor?.firstName || ""} ${training.instructor?.lastName || ""}`.trim() || "Instructor";
  const institutionName = training.instructor?.institutionName || "Institution";
  const courseTags = getCourseTags();

  const chip = "inline-flex items-center gap-2 rounded-full border border-white/25 px-3.5 py-1.5 text-white/90";
  const panel = "card p-6 sm:p-7";

  return (
    <PageFrame tone="surface">
      <PageHero
        kicker={
          <button type="button" onClick={() => navigate(-1)} className="nudge inline-flex items-center gap-2 text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white">
            <ArrowLeft size={16} aria-hidden="true" />
            Back
          </button>
        }
        title={training.title}
        description={
          <>
            <p>{training.category || "Professional Program"}</p>
            <ul className="t-small mt-5 flex flex-wrap gap-3" aria-label="Course details">
              <li className={chip}>
                <CalendarBlank size={18} aria-hidden="true" />
                {formatDate(training.startDate)}
              </li>
              <li className={chip}>
                <MapPin size={18} aria-hidden="true" />
                {getModeText()}
              </li>
              <li className={chip}>
                <UserCircle size={18} aria-hidden="true" />
                {instructorName}
              </li>
            </ul>
          </>
        }
        image={{ src: training.coverImg || "/course-images/default.jpg", alt: training.title }}
      />

      <section className="section" aria-label="Course information">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-12">
          {/* Main Content */}
          <div className="grid content-start gap-6">
            <Reveal className={panel}>
              <h2 className="t-heading">About</h2>
              <p className="t-body mt-4 text-ink/75">{training.description}</p>
            </Reveal>

            {training.lessons && training.lessons.length > 0 && (
              <Reveal className={panel}>
                <h2 className="t-heading">Topics Covered</h2>
                <ul className="mt-5 grid gap-3">
                  {training.lessons.map((lesson, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle size={22} weight="fill" className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                      <span className="t-body">{lesson.title}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Reveal className="card bg-white p-6">
                <h3 className="t-small text-ink/60">Instructor</h3>
                <p className="t-heading mt-1 break-words">{instructorName}</p>
              </Reveal>
              <Reveal delay={0.06} className="card bg-white p-6">
                <h3 className="t-small text-ink/60">Institution</h3>
                <p className="t-heading mt-1 break-words">{institutionName}</p>
              </Reveal>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="grid content-start gap-5 max-lg:order-first lg:sticky lg:top-28 lg:self-start">
            {!isEnrolled() ? (
              <div className="on-dark rounded-card bg-deep p-6 text-white sm:p-7">
                <p className="t-heading !text-white">Interested in this course?</p>
                <p className="t-lead mt-2 text-white/80">
                  {Number(training.cost || 0) > 0 ? `₹${Number(training.cost || 0).toLocaleString()}` : "Free to join"}
                </p>
                <button type="button" onClick={handleRegister} disabled={isPending} className="btn btn-inverse mt-6 w-full">
                  {isPending ? "Processing..." : "Enroll Now"}
                </button>
              </div>
            ) : (
              <div className={`${panel} grid gap-4`}>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle size={22} weight="fill" aria-hidden="true" />
                  <span className="t-label">Already Enrolled</span>
                </div>

                {training.link && (
                  <button type="button" onClick={() => window.open(training.link, "_blank")} className="btn btn-primary w-full">
                    <ArrowSquareOut size={18} aria-hidden="true" />
                    Access Course
                  </button>
                )}

                {training.enrolments?.[0]?.certificate && (
                  <>
                    <button type="button" onClick={() => window.open(training.enrolments?.[0]?.certificate, "_blank")} className="btn btn-primary w-full">
                      <Certificate size={18} aria-hidden="true" />
                      Download Certificate
                    </button>
                    <button
                      type="button"
                      onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${training.enrolments?.[0]?.certificate}&text=I completed ${training.title} on STEM for Society!`, "_blank")}
                      className="btn btn-secondary w-full"
                    >
                      <FaLinkedin size={16} aria-hidden="true" />
                      Share on LinkedIn
                    </button>
                  </>
                )}
                {training.displayFeedback && (
                  <div className="rounded-card border border-tint bg-surface p-4">
                    <RatingAndFeedback data={training} id={id!} disabled={training.ratings?.length > 0} />
                  </div>
                )}
              </div>
            )}

            {/* Course Info */}
            <dl className="card grid gap-4 p-6">
              <div>
                <dt className="t-small text-ink/60">Duration</dt>
                <dd className="t-body mt-1 font-medium">{calculateDuration(training?.startDate, training?.endDate)}</dd>
              </div>
              <div className="border-t border-tint pt-4">
                <dt className="t-small text-ink/60">Mode</dt>
                <dd className="t-body mt-1 font-medium">{getModeText()}</dd>
              </div>
              <div className="border-t border-tint pt-4">
                <dt className="t-small text-ink/60">Certificate</dt>
                <dd className="t-body mt-1 font-medium">Yes, Upon Completion</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <EnrolmentConfirmDialog
        opened={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmEnrolment}
        user={userData?.user ?? null}
        courseTitle={training.title}
        cost={training.cost}
        startDate={training.startDate ? formatDate(training.startDate) : null}
        isProcessing={isPending}
        loginUrl={loginUrl}
      />
    </PageFrame>
  );
};

export default CourseDetails;
