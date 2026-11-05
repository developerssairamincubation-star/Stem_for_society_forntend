import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";
import { Input } from "@/components1/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components1/ui/select";
import { ArrowLeft, Upload, Warning } from "@phosphor-icons/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PageFrame, PageHero } from "@/sfs/components/page/PageFrame";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { api, queryClient } from "../lib/api";
import { GenericError, GenericResponse } from "../lib/types";
import { mutationErrorHandler } from "../lib/utils";
import { useUser } from "../lib/hooks";
import RichTextEditorNew from "../components/RichTextEditorNew.client";

// Type definitions matching your existing structure
export type AuthorDetails = {
  name: string;
  phoneNumber: string;
  emailAddress: string;
  linkedInProfileUrl: string;
  designation: string;

  //Only For Frontend.. Not sends to backend
  educationLevel: string;
  department: string;
  fieldExperience?: string;
};

export type BlogContentType = {
  references?: string[];
  title: string;
  content: string;
  category: string; // Add category field
};

type BlogDetailsForm = BlogContentType & AuthorDetails & { coverImage: File };

interface FormData extends AuthorDetails, BlogContentType {
  coverPhoto: File | null;
}

// Context for Blog Stepper
interface BlogStepperContextType {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  setActive: (step: number) => void;
}

const BlogStepperContext = createContext<BlogStepperContextType | undefined>(
  undefined,
);

const FIRST_STEP = 1;
const LAST_STEP = 4;

/**
 * The wizard step lives in the URL (?step=2).
 *
 * It used to be component state, so moving forward changed nothing the browser
 * could see: pressing Back did not return to the previous step, it left the
 * article flow altogether and discarded everything typed. Each forward move now
 * pushes a history entry, which is what makes the browser's own Back button
 * step backwards through the form.
 */
const BlogStepperProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const requested = Number(searchParams.get("step"));
  const currentStep =
    Number.isInteger(requested) &&
    requested >= FIRST_STEP &&
    requested <= LAST_STEP
      ? requested
      : FIRST_STEP;

  /**
   * How many entries this wizard has pushed. BACK pops history when it can, so
   * the in-page button and the browser button stay in agreement; when the count
   * is spent - someone deep-linked to a later step - it rewrites the URL
   * instead, so BACK can never walk off the page.
   */
  const pushed = useRef(0);

  useEffect(() => {
    const onPop = () => {
      pushed.current = Math.max(0, pushed.current - 1);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /**
   * A step is only reachable once the steps before it have been filled in.
   *
   * The form itself lives in memory, so opening ?step=3 in a fresh tab - or
   * simply reloading on that step - used to render the later screens with
   * every field blank and no hint of why. Checked once on mount: during normal
   * use each step writes its answers to the cache before advancing, and this
   * must not second-guess the visitor mid-flow.
   */
  useEffect(() => {
    const hasAuthorDetails = Boolean(
      queryClient.getQueryData(["blog", "authorDetails"]),
    );
    const hasContent = Boolean(queryClient.getQueryData(["blog", "content"]));
    const furthestAllowed = !hasAuthorDetails ? 1 : !hasContent ? 2 : 3;

    if (currentStep > furthestAllowed) {
      const params = new URLSearchParams(window.location.search);
      params.set("step", String(furthestAllowed));
      setSearchParams(params, { replace: true });
    }
    // Mount only: see the note above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToStep = (step: number, push: boolean) => {
    const target = Math.min(Math.max(step, FIRST_STEP), LAST_STEP);
    const params = new URLSearchParams(searchParams);
    params.set("step", String(target));
    setSearchParams(params, { replace: !push });
    if (push) pushed.current += 1;
  };

  const nextStep = () => goToStep(currentStep + 1, true);

  const prevStep = () => {
    if (pushed.current > 0) {
      pushed.current -= 1;
      navigate(-1);
      return;
    }
    goToStep(currentStep - 1, false);
  };

  const setActive = (step: number) => {
    goToStep(step + 1, true); // Convert 0-based to 1-based indexing
  };

  return (
    <BlogStepperContext.Provider
      value={{ currentStep, nextStep, prevStep, setActive }}
    >
      {children}
    </BlogStepperContext.Provider>
  );
};

const useBlogStepper = () => {
  const context = useContext(BlogStepperContext);
  if (context === undefined) {
    throw new Error("useBlogStepper must be used within a BlogStepperProvider");
  }
  return context;
};

// Custom hook for creating blog (matching your existing API structure)
function useCreateBlog() {
  const navigate = useNavigate();
  return useMutation<
    GenericResponse,
    AxiosError<GenericError>,
    BlogDetailsForm,
    unknown
  >({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("authorName", data.name);
      formData.append("authorMobile", data.phoneNumber);
      formData.append("authorEmail", data.emailAddress);
      formData.append("authorLinkedin", data.linkedInProfileUrl);
      formData.append("authorDesignation", data.designation);
      formData.append("coverImage", data.coverImage);
      formData.append("content", data.content);
      formData.append("references", JSON.stringify(data.references ?? []));
      formData.append("title", data.title);
      formData.append("category", data.category);

      const response = await api().post("/blogs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        toast.error(
          "You need to be signed in to publish an article. Sign in and your details will still be here.",
          { autoClose: false },
        );
        return;
      }
      mutationErrorHandler(error);
    },
    onSuccess: () => {
      toast.success("Blog creation successful");
      navigate("/blog");
    },
  });
}

const BlogCreateContent = () => {
  const { currentStep, nextStep, prevStep, setActive } = useBlogStepper();
  const { mutate: createBlog, isPending } = useCreateBlog();

  // Query existing data from cache (matching your structure)
  const { data: blogAuthorDetails } = useQuery<AuthorDetails | undefined>({
    queryKey: ["blog", "authorDetails"],
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { data: blogContent } = useQuery<BlogContentType | undefined>({
    queryKey: ["blog", "content"],
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Publishing requires an account; the banner below says so up front.
  const { user } = useUser();

  const [formData, setFormData] = useState<FormData>({
    // Author Details
    name: blogAuthorDetails?.name || "",
    phoneNumber: blogAuthorDetails?.phoneNumber || "",
    emailAddress: blogAuthorDetails?.emailAddress || "",
    linkedInProfileUrl: blogAuthorDetails?.linkedInProfileUrl || "",
    designation: blogAuthorDetails?.designation || "",
    fieldExperience: "",
    educationLevel: blogAuthorDetails?.educationLevel || "",
    department: blogAuthorDetails?.department || "",
    // Blog Content
    title: blogContent?.title || "",
    content: blogContent?.content || "",
    references: blogContent?.references || [],
    category: blogContent?.category || "", // Add category field
    // Blog Details
    coverPhoto: null,
  });

  const steps = [
    { number: 1, title: "Author Information", active: currentStep === 1 },
    { number: 2, title: "Article Content", active: currentStep === 2 },
    { number: 3, title: "Preview & Upload", active: currentStep === 3 },
  ];

  const handleInputChange = (
    field: string,
    value: string | File | null | string[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, coverPhoto: file }));
    }
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      // Validate author details
      const missing = (
        [
          ["Full name", formData.name],
          ["Phone number", formData.phoneNumber],
          ["Email address", formData.emailAddress],
          ["LinkedIn profile URL", formData.linkedInProfileUrl],
          ["Designation", formData.designation],
          ["Education level", formData.educationLevel],
          ["Department", formData.department],
          ["Field experience", formData.fieldExperience],
        ] as [string, string][]
      )
        .filter(([, value]) => !String(value ?? "").trim())
        .map(([label]) => label);

      if (missing.length > 0) {
        toast.error(
          missing.length === 1
            ? `${missing[0]} is required.`
            : `Still needed: ${missing.join(", ")}.`,
        );
        return;
      }
      if (formData.name.trim().length < 5) {
        toast.error("AuthorName: Name must be at least 5 characters long");
        return;
      }
      if (formData.name.trim().length > 50) {
        toast.error("AuthorName: Name must be at most 50 characters long");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
        toast.error("AuthorEmail: Invalid email");
        return;
      }
      if (formData.phoneNumber.replace(/\D/g, "").length < 10) {
        toast.error("AuthorMobile: Mobile number is invalid");
        return;
      }
      try {
        const url = new URL(formData.linkedInProfileUrl);
        if (!url.hostname.includes("linkedin.com")) {
          toast.error("AuthorLinkedin: Only valid linkedin links are allowed");
          return;
        }
      } catch (e) {
        toast.error("AuthorLinkedin: Invalid URI");
        return;
      }

      // Save author details to cache and proceed
      const authorDetails: AuthorDetails = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        emailAddress: formData.emailAddress,
        linkedInProfileUrl: formData.linkedInProfileUrl,
        designation: formData.designation,
        educationLevel: formData.educationLevel,
        department: formData.department,
      };
      queryClient.setQueryData(["blog", "authorDetails"], authorDetails);
      nextStep();
    } else if (currentStep === 2) {
      // Validate blog content
      if (
        !formData.title ||
        !formData.content ||
        !formData.category ||
        (formData.content.replace(/<(.|\n)*?>/g, "").trim() === "" &&
          !formData.content.includes("<img"))
      ) {
        toast.error("Please provide title, category, and content");
        return;
      }

      // Save blog content to cache and proceed
      const blogContentData: BlogContentType = {
        title: formData.title,
        content: formData.content,
        references: formData.references,
        category: formData.category, // Include category
      };
      queryClient.setQueryData(["blog", "content"], blogContentData);
      nextStep();
    } else if (currentStep === 3) {
      // Submit the blog
      handleSubmit();
    } else if (currentStep < 4) {
      nextStep();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      prevStep();
    }
  };

  const handleSubmit = async () => {
    if (!formData.coverPhoto) {
      toast.error("Cover Image is required");
      return;
    }

    const blogData: BlogDetailsForm = {
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      emailAddress: formData.emailAddress,
      linkedInProfileUrl: formData.linkedInProfileUrl,
      designation: formData.designation,
      educationLevel: formData.educationLevel,
      department: formData.department,
      title: formData.title,
      content: formData.content,
      references: formData.references,
      category: formData.category, // Include category
      coverImage: formData.coverPhoto,
    };

    createBlog(blogData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                aria-label="Full name"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <Input
                aria-label="Phone number"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                aria-label="Email address"
                placeholder="Email Address"
                type="email"
                value={formData.emailAddress}
                onChange={(e) =>
                  handleInputChange("emailAddress", e.target.value)
                }
              />
              <Input
                aria-label="LinkedIn profile URL"
                placeholder="LinkedIn Profile URL"
                type="url"
                value={formData.linkedInProfileUrl}
                onChange={(e) =>
                  handleInputChange("linkedInProfileUrl", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                onValueChange={(value) =>
                  handleInputChange("educationLevel", value)
                }
                value={formData.educationLevel}
              >
                <SelectTrigger className="h-11 rounded-control border-tint bg-white">
                  <SelectValue placeholder="Education Level" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    zIndex: 50,
                    position: "relative",
                    backgroundColor: "white",
                  }}
                >
                  <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                  <SelectItem value="masters">Master's Degree</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                  <SelectItem value="postdoc">Post-Doc</SelectItem>
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) =>
                  handleInputChange("department", value)
                }
              >
                <SelectTrigger className="h-11 rounded-control border-tint bg-white">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    zIndex: 50,
                    position: "relative",
                    backgroundColor: "white",
                  }} // Add this style
                >
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                onValueChange={(value) =>
                  handleInputChange("designation", value)
                }
                value={formData.designation}
              >
                <SelectTrigger className="h-11 rounded-control border-tint bg-white">
                  <SelectValue placeholder="Designation" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    zIndex: 50,
                    position: "relative",
                    backgroundColor: "white",
                  }}
                >
                  <SelectItem value="Software Engineer">
                    Software Engineer
                  </SelectItem>
                  <SelectItem value="Research Scientist">
                    Research Scientist
                  </SelectItem>
                  <SelectItem value="Professor">Professor</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Industry Professional">
                    Industry Professional
                  </SelectItem>
                </SelectContent>
              </Select>

              <Input
                aria-label="Field experience"
                placeholder="Field Experience"
                value={formData.fieldExperience}
                onChange={(e) =>
                  handleInputChange("fieldExperience", e.target.value)
                }
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Article Content</h3>
              <p className="text-ink/75">
                Add your article content, title, category, and abstract
              </p>
            </div>
            <div className="space-y-4">
              <Input
                placeholder="Article Title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />

              <Select
                onValueChange={(value) => handleInputChange("category", value)}
                value={formData.category}
              >
                <SelectTrigger className="h-11 rounded-control border-tint bg-white">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    zIndex: 50,
                    position: "relative",
                    backgroundColor: "white",
                  }}
                >
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Research">Research</SelectItem>
                  <SelectItem value="Innovation">Innovation</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Career">Career</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>

              <div className="min-h-[300px] rounded-control border border-tint bg-white p-4">
                <RichTextEditorNew
                  value={formData.content}
                  onChange={(val) => handleInputChange("content", val)}
                />
              </div>
              <textarea
                placeholder="Add references (one per line)"
                value={formData.references?.join("\n") || ""}
                onChange={(e) =>
                  handleInputChange(
                    "references",
                    e.target.value.split("\n").filter((ref) => ref.trim()),
                  )
                }
                className="h-32 resize-none"
              />
              <p className="text-red-600 text-sm">
                *Do not upload any copyrighted images, as they will be taken
                down due to legal repercussions.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">Upload Cover Image</h3>
              <p className="text-ink/75">
                Choose an eye-catching cover photo for your article.
              </p>
            </div>

            <div className="space-y-6">
              <label
                htmlFor="cover-upload"
                className="block border-2 border-dashed border-tint hover:border-brand rounded-control p-10 text-center bg-surface cursor-pointer transition-colors"
              >
                <div className="mb-4 pointer-events-none">
                  <div className="w-16 h-16 mx-auto bg-tint rounded-full flex items-center justify-center mb-4">
                    <Upload size={32} className="text-brand" aria-hidden="true" />
                  </div>
                  <p className="text-ink/75 font-medium text-lg mb-1">
                    {formData.coverPhoto
                      ? formData.coverPhoto.name
                      : "Click or drag image to upload"}
                  </p>
                  <p className="text-ink/60 text-sm">
                    SVG, PNG, JPG or GIF (max. 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="cover-upload"
                />
              </label>

              {formData.coverPhoto && (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(formData.coverPhoto)}
                    alt="Cover Preview"
                    className="w-full h-64 object-cover rounded-control shadow-sm"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary mt-4 !border-red-200 !text-red-600 hover:!bg-red-50"
                    onClick={(e) => {
                      e.preventDefault();
                      handleInputChange("coverPhoto", null);
                    }}
                  >
                    Remove Image
                  </button>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-control p-4 flex items-start space-x-3">
                <Warning size={20} className="mt-0.5 shrink-0 text-yellow-600" aria-hidden="true" />
                <div className="text-sm">
                  <p className="text-yellow-800 font-medium">
                    Copyright Notice
                  </p>
                  <p className="text-yellow-700">
                    Do not upload any copyrighted images, as they will be taken
                    down due to legal repercussions.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-tint rounded-control p-4 flex items-center space-x-3 mt-6">
              <span className="text-2xl">ℹ️</span>
              <p className="text-sm text-deep">
                Your article will be reviewed and published within 48 hours
                after submission.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">✓</span>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-ink">
              Article Submitted Successfully!
            </h3>
            <p className="text-ink/75 max-w-md mx-auto">
              Your article has been submitted for review. Our team will review
              it and publish within 48 hours.
            </p>
            <button type="button" className="btn btn-primary" onClick={() => (window.location.href = "/blogs")}>
              View My Articles
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PageFrame tone="surface">
      <PageHero
        kicker={
          <Link to="/" className="nudge inline-flex items-center gap-2 text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white">
            <ArrowLeft size={16} aria-hidden="true" />
            Back
          </Link>
        }
        title={
          <>
            Create your <span className="text-tint">Article!</span>
          </>
        }
        description={
          <>
            <p>Scientific communication</p>
            {/* Publishing requires an account. Saying so here avoids letting
                someone complete every step only to be refused at the end. */}
            {!user && (
              <p role="status" className="t-small mt-4 max-w-xl rounded-control bg-white/10 px-4 py-3 text-white">
                You will need to{" "}
                <Link to="/login?returnTo=%2Fblog-article" className="font-medium underline">
                  sign in
                </Link>{" "}
                before you can publish this article.
              </p>
            )}
          </>
        }
      />

      <section className="section">
        <div className="container-x">
          {/* Progress Steps */}
          <ol className="mb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3" aria-label="Progress">
            {steps.map((step, index) => (
              <li key={step.number} aria-current={step.active ? "step" : undefined} className="flex items-center gap-3">
                <span
                  className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300 ${
                    step.active
                      ? "bg-deep text-white"
                      : currentStep > step.number
                        ? "bg-brand text-white"
                        : "bg-tint text-deep"
                  }`}
                >
                  {currentStep > step.number ? "✓" : step.number}
                </span>
                {step.active && <span className="t-label text-deep">{step.title}</span>}
                {index < steps.length - 1 && <span aria-hidden="true" className="hidden h-px w-10 bg-tint sm:block" />}
              </li>
            ))}
          </ol>

          {/* Form Content */}
          <div className="mx-auto max-w-4xl">
            <div className="card mb-8 p-6 sm:p-8">{renderStepContent()}</div>

            {/* Action Buttons - Updated layout with Back and Continue buttons */}
            <div className="flex items-center justify-between">
              {/* Back Button - Only show from step 2 onwards */}
              {currentStep > 1 && currentStep < 4 && (
                <button type="button" onClick={handleBack} className="btn btn-secondary" disabled={isPending}>
                  BACK
                </button>
              )}

              {/* Empty div to maintain space when back button is not shown */}
              {(currentStep === 1 || currentStep === 4) && <div></div>}

              {/* Continue/Publish Button */}
              {currentStep === 3 ? (
                <button type="button" onClick={handleContinue} className="btn btn-primary" disabled={isPending}>
                  {isPending ? "PUBLISHING..." : "PUBLISH"}
                </button>
              ) : currentStep < 4 ? (
                <button type="button" onClick={handleContinue} className="btn btn-primary">
                  CONTINUE
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </PageFrame>
  );
};

const BlogCreateNew = () => {
  return (
    <BlogStepperProvider>
      <BlogCreateContent />
    </BlogStepperProvider>
  );
};

export default BlogCreateNew;
