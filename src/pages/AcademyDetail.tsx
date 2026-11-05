import { clientSafeText } from "@/lib/errors";
import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { Input } from "@/components1/ui/input";
import { PhoneInput } from "@/components1/ui/phone-input";
import { CalendarBlank, Clock, CheckCircle, Users, BookOpen, Certificate, ArrowSquareOut, MapPin } from "@phosphor-icons/react";
import { PageFrame, PageHero } from "@/sfs/components/page/PageFrame";
import { PageLoading } from "@/sfs/components/page/PageStatus";
import { Reveal } from "@/sfs/components/ui/Reveal";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api, queryClient } from "@/lib/api";
import {
  GenericError,
  GenericResponse,
  RazorpayOrderOptions,
} from "@/lib/types";
import {
  calculateDurationForEmail,
  calculateDuration,
  formatDate,
  mutationErrorHandler,
  initializeRazorpay,
} from "@/lib/utils";
import Errorbox from "@/components/Errorbox";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useUser } from "@/lib/hooks";
import EnrolmentConfirmDialog from "@/components1/EnrolmentConfirmDialog";
import { RZPY_KEYID } from "@/Constants";
import { Rating, Textarea } from "@mantine/core";
import { FaLinkedin } from "react-icons/fa";
import { formatCourseLocation } from "@/lib/course";

dayjs.extend(utc);

// Student training data structure
export type StudentTraining = {
  id: string;
  title: string;
  coverImg: string;
  startDate: string;
  endDate: string;
  description: string;
  createdAt: string;
  category?: string;
  course_type?: string;
  instructor: {
    firstName: string;
    lastName?: string;
    institutionName?: string;
  };
  link?: string;
  cost: string;
  location?: string;
  isEnrolled: boolean;
  displayFeedback: boolean;
  ratings: {
    feedback: string;
    rating: number;
    completedOn: string;
  }[];
  enrolments: {
    id: string;
    userId: string;
    trainingId: string;
    completedOn: string | null;
    createdAt: string;
    updatedAt?: string;
    certificateNo?: string;
    certificate?: string;
    transactions?: {
      amount: string;
      status: string;
    }[];
  }[];
  type: "ONLINE" | "OFFLINE" | "HYBRID";
  whoIsItFor?: string[];
  whatYouWillLearn?: string[];
};

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
  return useMutation<
    GenericResponse<CreatePaymentResponse>,
    AxiosError<GenericError>
  >({
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
      toast.success(data.message || "Feedback submitted successfully!");
    },
    onError: (err) => {
      console.error("Feedback submission error:", err.response?.data);

      // Only redirect to login if it's an auth error
      if (err.status === 401) {
        mutationErrorHandler(err, navigate, loginUrl);
      }
    },
  });
}

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
    data.ratings ? data.ratings[0]?.rating : 0,
  );
  const [feedback, setFeedback] = useState<string>(
    data.ratings ? data.ratings[0]?.feedback : "",
  );
  const mutation = useSubmitFeedback(id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ rating, feedback });
  };

  return (
    <div className="space-y-4">
      <h4 className="t-heading">Rate & Review</h4>
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
    </div>
  );
}
const AcademyDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user: userData } = useUser();
  const { data: trainingData, isLoading, error } = useTraining(courseId);
  const { mutateAsync, isPending } = useEnroll(courseId);

  const course = trainingData?.data;
  const returnTo = encodeURIComponent(
    `${location.pathname}${location.search}${location.hash}`
  );
  const loginUrl = `/login?returnTo=${returnTo}`;

  // Get mode text
  const getModeText = () => {
    if (!course?.type) return "Hybrid";
    return course.type.charAt(0) + course.type.slice(1).toLowerCase();
  };

  // Get formatted time range
  const getTimeRange = () => {
    // Never invent a schedule: this used to fall back to a hard-coded
    // "10:00 AM - 12:00 PM", which showed buyers a time the course did not have.
    if (!course?.startDate || !course?.endDate) return "Schedule to be announced";
    const start = dayjs(course.startDate);
    const end = dayjs(course.endDate);
    // A course running across two days rendered as "06:30 PM - 06:30 PM", which
    // reads as a mistake. When the range spans days, date-qualify both ends.
    if (start.isSame(end, "day")) {
      return `${start.format("hh:mm A")} - ${end.format("hh:mm A")}`;
    }
    return `${start.format("D MMM, hh:mm A")} - ${end.format("D MMM, hh:mm A")}`;
  };

  // Check if user is enrolled
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isEnrolled = () => {
    if (!course) return false;
    if (course.isEnrolled) return true;
    return course.enrolments?.some((enrollment) =>
      enrollment.transactions?.some(
        (transaction) => transaction.status === "success",
      ),
    );
  };

  // Default values for incase of missing data
  const whoIsItFor = course?.whoIsItFor || [
    "Fresh graduates looking to specialize",
    "Working professionals seeking career advancement",
    "Researchers wanting to advance their skills",
    "Students interested in the field",
  ];

  const whatYouLearn = course?.whatYouWillLearn || [
    "Foundation and fundamentals",
    "Advanced techniques and methodologies",
    "Practical tools and software",
    "Research methodologies and project management",
    "Industry best practices and case studies",
  ];

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
        description: course?.title || "Course Enrollment",
        image: `${window.location.origin}/logo-01.png`,
        order_id: order.orderId,
        prefill: {
          name: [userData?.user?.firstName, userData?.user?.lastName]
            .filter(Boolean)
            .join(" "),
          email: userData?.user?.email,
          contact: userData?.user?.mobile,
        },
        async handler(response) {
          try {
            if ("error" in response) {
              // @ts-expect-error error handling
              toast.error(clientSafeText(response.error.reason));
              queryClient.invalidateQueries({ queryKey: ["trainings"] });
              queryClient.invalidateQueries({
                queryKey: ["trainings", courseId],
              });
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
            // Straight to My Courses: that is where the purchase now lives.
            navigate("/courses");

            // Force immediate refresh
            await queryClient.invalidateQueries({ queryKey: ["trainings"] });
            await queryClient.invalidateQueries({
              queryKey: ["trainings", courseId],
            });
            await queryClient.refetchQueries({
              queryKey: ["trainings", courseId],
            });

            // Send course registration email
            try {
              await api().post("/email/send-course-registration", {
                userEmail: userData?.user?.email,
                userName: userData?.user?.firstName,
                courseName: course?.title || "Course",
                amount: Number(order.amount),
                currency: "INR",
                paymentId: response.razorpay_payment_id,
                courseDuration: calculateDurationForEmail(
                  course?.startDate || "",
                  course?.endDate || "",
                ),
                startDate: formatDate(course?.startDate || ""),
                phoneNumber: userData?.user?.mobile,
              });
            } catch (emailError) {
              console.error(
                "Failed to send course registration email:",
                emailError,
              );
            }
          } catch (error) {
            console.error("Payment handler error:", error);
            toast.error(
              "Payment was received but could not be confirmed. Please contact support with Order ID: " +
                order.orderId,
              { autoClose: false, closeOnClick: false },
            );
            await queryClient.invalidateQueries({ queryKey: ["trainings"] });
            await queryClient.invalidateQueries({
              queryKey: ["trainings", courseId],
            });
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
          "Please note Order ID: " +
            res.error.metadata.order_id +
            "\n Payment ID: " +
            res.error.metadata.payment_id,
          { autoClose: false, closeOnClick: false },
        );
        await queryClient.invalidateQueries({ queryKey: ["trainings"] });
        await queryClient.invalidateQueries({
          queryKey: ["trainings", courseId],
        });
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
  }, [mutateAsync, userData, courseId, course]);

  // Handle registration
  const handleContinue = async () => {
    // A signed-out visitor opens the same dialog, which asks them to sign in
    // rather than bouncing them away the moment they show interest.
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

    if (course?.cost === "0" || course?.cost === "free") {
      try {
        await api().post(`/trainings/${courseId}/enroll`);
        await queryClient.invalidateQueries({ queryKey: ["trainings", courseId] });
        toast.success("You are enrolled. Find it under My Courses.");
        navigate("/courses");
      } catch (err) {
        toast.error("Failed to enroll");
      }
      return;
    }

    await handlePayment();
  };

  const framed = (node: React.ReactNode) => (
    <PageFrame tone="surface">
      <div className="container-x pt-32 pb-16">{node}</div>
    </PageFrame>
  );
  if (isLoading) return <PageLoading label="Loading course…" />;
  if (error) return framed(<Errorbox message={error.message} />);

  if (!course) {
    return framed(
      <div className="card mx-auto max-w-xl px-6 py-14 text-center">
        <h2 className="t-title">Course not found</h2>
        <button type="button" className="btn btn-primary mt-6" onClick={() => navigate("/")}>
          Back to Courses
        </button>
      </div>,
    );
  }

  const dateText = `${formatDate(course.startDate)}${
    course.endDate && formatDate(course.startDate) !== formatDate(course.endDate) ? ` to ${formatDate(course.endDate)}` : ""
  }`;
  const chip = "inline-flex items-center gap-2 rounded-full border border-white/25 px-3.5 py-1.5 text-white/90";
  const panel = "card p-6 sm:p-7";
  const terms: { dot: string; items: [string, string][] } =
    course.type === "OFFLINE"
      ? {
          dot: "text-brand",
          items: [
            ["Attendance:", "Arrive at the venue 20 minutes early for check-in and material collection."],
            ["Fees:", "Registration fees and refunds are processed strictly as per the Refund Policy."],
            ["Property:", "Participants are liable for any damage caused to venue equipment or tools."],
            ["Privacy:", "Personal info shared with STEM for Society and providers for registration."],
            ["Safety:", "Must follow all onsite safety protocols and venue-specific guidelines."],
          ],
        }
      : course.type === "HYBRID"
        ? {
            dot: "text-brand",
            items: [
              ["Access:", "Class link and venue details will be shared prior to the session. Join or arrive early."],
              ["Requirements:", "Stable internet for online; follow onsite safety protocols for offline attendance."],
              ["Fees:", "Registration fees and refunds are processed strictly as per the Refund Policy."],
              ["Privacy:", "Data shared with STEM for Society and providers per data protection laws."],
              ["Conduct:", "Unauthorized recording or distribution of digital content is prohibited."],
            ],
          }
        : {
            dot: "text-brand",
            items: [
              ["Access:", "Link shared on session day; join 10 minutes early for tech checks."],
              ["Requirements:", "Stable internet connection and functional audio/video hardware required."],
              ["Fees:", "Registration fees and refunds are processed strictly as per the Refund Policy."],
              ["Privacy:", "Data shared with STEM for Society and providers per data protection laws."],
              ["Conduct:", "Unauthorized recording or distribution of digital content is prohibited."],
            ],
          };

  return (
    <PageFrame tone="surface">
      <PageHero
        title={course.title}
        description={
          <>
            <p>{course.category || "Professional Program"}</p>
            <ul className="t-small mt-5 flex flex-wrap gap-3" aria-label="Course details">
              <li className={chip}>
                <BookOpen size={18} aria-hidden="true" />
                English
              </li>
              <li className={chip}>
                <Certificate size={18} aria-hidden="true" />
                {getModeText()}
              </li>
              <li className={chip}>
                <Users size={18} aria-hidden="true" />
                Live
              </li>
            </ul>
          </>
        }
      />

      <section className="section" aria-label="Course information">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_24rem] lg:gap-12">
          <div className="grid content-start gap-6">
            {/* Session Overview */}
            <Reveal className={panel}>
              <h2 className="t-heading">Session Overview</h2>
              <p className="t-body mt-4 text-ink/75">{course.description}</p>
            </Reveal>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Who is it for? */}
              <Reveal className={panel}>
                <h3 className="t-heading">Who is it for?</h3>
                <ul className="mt-4 grid gap-3">
                  {whoIsItFor.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle size={22} weight="fill" className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                      <span className="t-body">{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              {/* What You'll Learn */}
              <Reveal delay={0.06} className={panel}>
                <h3 className="t-heading">What You'll Learn?</h3>
                <ul className="mt-4 grid gap-3">
                  {whatYouLearn.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle size={22} weight="fill" className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                      <span className="t-body">{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* Terms & Conditions */}
            <Reveal className={panel}>
              <h3 className="t-heading">Terms & Conditions</h3>
              <ul className="mt-5 grid gap-3">
                {terms.items.map(([name, text]) => (
                  <li key={name} className="flex items-start gap-3">
                    <span aria-hidden="true" className={`mt-2 size-1.5 shrink-0 rounded-full bg-brand`} />
                    <span className="t-body text-ink/75">
                      <strong className="font-semibold text-ink">{name}</strong> {text}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="t-small mt-6 text-ink/60">
                By continuing, you agree to share your info with STEM for Society & the course provider, as per data protection laws.
              </p>
            </Reveal>

            {/* Program Details */}
            <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                { Icon: BookOpen, label: "Duration", value: calculateDuration(course?.startDate, course?.endDate) },
                { Icon: CalendarBlank, label: "Date", value: dateText },
                { Icon: MapPin, label: "Location", value: formatCourseLocation(course.type, course.location) },
                { Icon: Certificate, label: "Certification", value: "Industry Recognized" },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="card p-5 text-center">
                  <Icon size={30} className="mx-auto text-brand" aria-hidden="true" />
                  <dt className="t-label mt-3">{label}</dt>
                  <dd className="t-small mt-1 text-ink/70">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right column: date, time, location and the enrolment panel */}
          <div className="grid content-start gap-5 max-lg:order-first lg:sticky lg:top-28 lg:self-start">
            <dl className="card grid gap-4 p-6">
              <div className="flex items-start gap-3">
                <CalendarBlank size={22} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                <div className="min-w-0">
                  <dt className="t-small text-ink/60">Date</dt>
                  <dd className="t-body font-medium">{dateText}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3 border-t border-tint pt-4">
                <Clock size={22} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                <div className="min-w-0">
                  <dt className="t-small text-ink/60">Time</dt>
                  <dd className="t-body font-medium">{getTimeRange()}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3 border-t border-tint pt-4">
                <MapPin size={22} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                <div className="min-w-0">
                  <dt className="t-small text-ink/60">Location</dt>
                  <dd className="t-body font-medium">{formatCourseLocation(course.type, course.location)}</dd>
                </div>
              </div>
            </dl>

            {!isEnrolled() ? (
              <div className="on-dark rounded-card bg-deep p-6 text-center text-white sm:p-7">
                <p className="t-heading !text-white">Interested in this course?</p>
                <p className="t-display mt-2 !text-white">
                  {Number(course.cost || 0) > 0 ? `₹${Number(course.cost || 0).toLocaleString()}` : "Free"}
                </p>

                {/* The personal-details form that used to sit here asked a
                    signed-in visitor to retype the name, email and phone the
                    account already holds, and none of it was ever sent - the
                    enrolment endpoints read the session. The confirmation
                    dialog shows those details instead. */}
                <button type="button" onClick={handleContinue} disabled={isPending} className="btn btn-inverse mt-6 w-full">
                  {isPending ? "Processing..." : "Enroll Now"}
                </button>
              </div>
            ) : (
              <div className="grid gap-5">
                {/* Already Enrolled Card */}
                <div className="rounded-card bg-green-700 p-6 text-center text-white sm:p-7">
                  <CheckCircle size={52} weight="fill" className="mx-auto mb-3" aria-hidden="true" />
                  <h3 className="t-heading !text-white">You're Enrolled!</h3>
                  <p className="t-small mt-1 text-white/85">You have successfully registered for this course</p>

                  {course.enrolments?.length > 0 && (
                    <div className="t-small mt-5 rounded-control bg-white/10 p-4 text-left">
                      <p>
                        Enrolled on: <span className="font-medium">{formatDate(course.enrolments[0]?.createdAt)}</span>
                      </p>
                      {course.link && (
                        <p className="mt-1">
                          Course Link:{" "}
                          <a href={course.link} target="_blank" rel="noopener noreferrer" className="font-medium underline">
                            Access Course
                          </a>
                        </p>
                      )}
                    </div>
                  )}

                  {course.link && (
                    <a href={course.link} target="_blank" rel="noopener noreferrer" className="btn btn-inverse mt-5 w-full !text-green-800">
                      <ArrowSquareOut size={18} aria-hidden="true" />
                      Access Course
                    </a>
                  )}
                </div>

                {/* Certificate Section */}
                {course.enrolments?.[0]?.certificate && (
                  <div className="card grid gap-4 border-green-600 p-6 text-center">
                    <Certificate size={44} className="mx-auto text-green-700" aria-hidden="true" />
                    <div>
                      <h4 className="t-heading text-green-800">Congratulations!</h4>
                      <p className="t-small mt-1 text-ink/70">You have successfully completed the training and earned a certificate!</p>
                    </div>
                    <div className="grid gap-3">
                      <Link target="_blank" to={course.enrolments[0].certificate} className="btn btn-primary">
                        <Certificate size={18} aria-hidden="true" />
                        Download Certificate
                      </Link>
                      <Link
                        target="_blank"
                        to={`https://www.linkedin.com/shareArticle?mini=true&url=${course.enrolments[0].certificate}&text=Hello connections! I have completed a course with STEM for society website and have earned a certificate on ${course.title}`}
                        className="btn btn-secondary"
                      >
                        <FaLinkedin size={16} aria-hidden="true" />
                        Share on LinkedIn
                      </Link>
                    </div>
                  </div>
                )}

                {/* Feedback Section */}
                {course.displayFeedback && (
                  <div className="card p-6">
                    <RatingAndFeedback data={course} id={courseId!} disabled={course.ratings?.length > 0} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <EnrolmentConfirmDialog
        opened={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmEnrolment}
        user={userData?.user ?? null}
        courseTitle={course.title}
        cost={course.cost}
        startDate={course.startDate ? formatDate(course.startDate) : null}
        isProcessing={isPending}
        loginUrl={loginUrl}
      />
    </PageFrame>
  );
};

export default AcademyDetail;
