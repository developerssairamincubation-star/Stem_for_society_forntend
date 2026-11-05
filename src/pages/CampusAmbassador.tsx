import { NumberInput, Select, TextInput } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, Megaphone } from "@phosphor-icons/react";
import { PageFrame, PageHero } from "@/sfs/components/page/PageFrame";
import { Reveal } from "@/sfs/components/ui/Reveal";
import { useState } from "react";
import { GenericError, GenericResponse } from "../lib/types";
import { AxiosError } from "axios";
import { api } from "../lib/api";
import { mutationErrorHandler } from "../lib/utils";
import { toast } from "react-toastify";
import { DateInput } from "@mantine/dates";

const WHY_JOIN_POINTS = [
  "Access to exclusive STEM for Society opportunities and a chance to win a Campus Ambassador Points",
  "Certificates of recognition for your contributions",
  "Opportunities to network with fellow participants and free access to Stem for Society Conference",
  "30% discount in all the program offered by Stem for Society",
];

type EduType = "UG" | "PG" | "PhD";

type CaForm = {
  firstName: string;
  lastName?: string;
  email: string;
  mobile: string;
  eduType: EduType;
  department: string;
  collegeName: string;
  yearInCollege?: number;
  collegeCity: string;
  dob: Date | null;
  linkedin: string;
};

function useCampusAmbSignUp() {
  return useMutation<
    GenericResponse,
    AxiosError<GenericError>,
    CaForm,
    unknown
  >({
    mutationFn: async (data) => {
      const response = await api().post("/enquiry/ca", data);
      return response.data;
    },
    onSuccess(data) {
      toast.success(data.message);
    },
    onError: (err) => mutationErrorHandler(err),
  });
}

export default function CampusAmbassador() {
  const [formData, setFormData] = useState<CaForm>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    eduType: "PG",
    department: "",
    collegeName: "",
    collegeCity: "",
    dob: null,
    linkedin: "",
  });
  const { isPending, mutate } = useCampusAmbSignUp();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("🚀 ~ handleSubmit ~ formData:", formData);
    mutate(formData);
  };

  return (
    <PageFrame tone="surface">
      <PageHero
        kicker={
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3.5 py-1.5">
            <Megaphone size={18} aria-hidden="true" />
            Stem for Society Campus Ambassador (CA) recruitment
          </span>
        }
        title="Join the Stem for Society Campus Ambassador Program!"
        description={
          <p>
            Embrace the role of a <span className="font-semibold text-white">Stem For Society</span> Campus Ambassador at your college or
            university and help us spread the excitement far and wide! As a Campus Ambassador, you will be instrumental in promoting the
            festival, engaging with fellow students, and infusing the spirit of Stem for Society into your campus community
          </p>
        }
      />

      <section className="section" aria-label="Campus Ambassador program">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="grid content-start gap-8">
            <Reveal>
              <h2 className="t-title">Why Join?</h2>
              <ul className="mt-6 grid gap-4">
                {WHY_JOIN_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle size={22} weight="fill" className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                    <span className="t-body text-ink/80">{point}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.08} className="on-dark rounded-card bg-deep p-6 sm:p-8">
              <h3 className="t-heading !text-white">Ready to apply?</h3>
              <p className="t-body mt-2 text-white/85">
                Sign up today to embark on this exciting journey. Let’s make Stem for Society unforgettable together!
              </p>
            </Reveal>
          </div>

          <Reveal className="card p-6 sm:p-8">
            <p className="t-body mb-6 text-ink/75">Please fill up the details and we will be in touch</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput
                label="First Name"
                placeholder="Enter your first name"
                size="sm"
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <TextInput
                label="Last Name"
                placeholder="Enter your last name"
                size="sm"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              <TextInput
                label="Email"
                placeholder="Enter your email"
                size="sm"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextInput
                label="Mobile No."
                placeholder="Enter your mobile number"
                size="sm"
                required
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
              <Select
                label="Education Type"
                placeholder="Select your education type"
                size="sm"
                required
                name="eduType"
                value={formData.eduType}
                onChange={(value) => setFormData((prev) => ({ ...prev, eduType: value as EduType }))}
                data={[
                  { value: "UG", label: "UG" },
                  { value: "PG", label: "PG" },
                  { value: "PhD", label: "PhD" },
                ]}
              />
              <TextInput
                label="Department"
                placeholder="Enter your department"
                size="sm"
                required
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
              <TextInput
                label="College Name"
                placeholder="Enter your college name"
                size="sm"
                className="sm:col-span-2"
                required
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
              />
              <NumberInput
                label="Year in College"
                placeholder="Enter your year in college"
                size="sm"
                name="yearInCollege"
                value={formData.yearInCollege}
                min={1}
                onChange={(value) => setFormData((prev) => ({ ...prev, yearInCollege: Number(value) }))}
              />
              <TextInput
                label="College City"
                placeholder="Enter your college city"
                size="sm"
                required
                name="collegeCity"
                value={formData.collegeCity}
                onChange={handleChange}
              />
              <DateInput
                label="Date of Birth"
                placeholder="Enter your date of birth"
                size="sm"
                required
                name="dob"
                value={formData.dob}
                onChange={(e) => setFormData((prev) => ({ ...prev, dob: e }))}
              />
              <TextInput
                label="LinkedIn Profile"
                placeholder="Enter your LinkedIn profile"
                size="sm"
                required
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
              />
              <button type="button" className="btn btn-primary w-full sm:col-span-2 sm:w-fit" disabled={isPending} onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </PageFrame>
  );
}
