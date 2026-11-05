import React, { useState } from 'react';
import { PhoneInput } from "@/components1/ui/phone-input";
import { PageFrame, PageHero } from '@/sfs/components/page/PageFrame';
import { Input } from '@/components1/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components1/ui/select';
import { ArrowLeft, Warning, CheckCircle, Check } from '@phosphor-icons/react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { api } from "../lib/api";
import { mutationErrorHandler } from "../lib/utils";
import { GenericError, GenericResponse } from "../lib/types";
import { 
  validateCampusAmbassadorStep 
} from '../lib/validation';

// Backend types from CampusAmbassador.tsx
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

// Frontend form data type (includes UI-only fields not sent to backend)
interface FormData {
  // Backend fields (matching CaForm)
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  eduType: EduType;
  department: string;
  collegeName: string;
  yearInCollege?: number;
  collegeCity: string;
  dob: Date | null;
  linkedin: string;
  
  // Frontend-only fields (not sent to backend)
  educationLevel: string; // Maps to eduType
  dateOfBirth: string; // Maps to dob (Date object)
  currentYear: string; // Maps to yearInCollege
  linkedinProfile: string; // Maps to linkedin
  country: string;
  mobileNumber: string; // Maps to mobile
  otp: string;
  institutionName: string; // Maps to collegeName
  manualInstitutionName: string; // Maps to collegeName
  addressLine1: string;
  addressLine2: string;
  city: string; // Maps to collegeCity
  state: string;
}

// Custom hook for campus ambassador signup (from CampusAmbassador.tsx)
function useCampusAmbSignUp() {
  const navigate = useNavigate();
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
      setTimeout(() => {
        navigate("/");
      }, 1000);
    },
    onError: (err) => mutationErrorHandler(err),
  });
}

const CampusAmbassadorBooking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // Backend fields
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    eduType: 'UG',
    department: '',
    collegeName: '',
    yearInCollege: undefined,
    collegeCity: '',
    dob: null,
    linkedin: '',
    
    // Frontend-only fields
    educationLevel: '',
    dateOfBirth: '',
    currentYear: '',
    linkedinProfile: '',
    country: '',
    mobileNumber: '',
    otp: '',
    institutionName: '',
    manualInstitutionName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: ''
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const { isPending, mutate } = useCampusAmbSignUp();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Map frontend fields to backend fields
      if (field === 'educationLevel') {
        updated.eduType = value as EduType;
      }
      if (field === 'linkedinProfile') {
        updated.linkedin = value;
      }
      if (field === 'mobileNumber') {
        updated.mobile = value;
      }
      // FIX: Map dateOfBirth to dob properly
      if (field === 'dateOfBirth') {
        updated.dob = value ? new Date(value) : null;
      }
      if (field === 'currentYear') {
        // Extract number from "1st Year", "2nd Year", etc.
        const yearMatch = value.match(/(\d+)/);
        updated.yearInCollege = yearMatch ? parseInt(yearMatch[1]) : undefined;
      }
      if (field === 'institutionName' && value !== 'other') {
        updated.collegeName = value;
      }
      if (field === 'manualInstitutionName') {
        updated.collegeName = value;
      }
      if (field === 'city') {
        updated.collegeCity = value;
      }
      
      return updated;
    });
  };

  const validateStep = (step: number) => {
    const errors = validateCampusAmbassadorStep(step, {
      ...formData,
      otpVerified,
    });

    if (errors.length > 0) {
      toast.error(errors[0]);
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = () => {
    // Prepare data for backend (only send fields that match CaForm)
    const backendData: CaForm = {
      firstName: formData.firstName,
      lastName: formData.lastName || undefined,
      email: formData.email,
      mobile: formData.mobile,
      eduType: formData.eduType,
      department: formData.department,
      collegeName: formData.collegeName,
      yearInCollege: formData.yearInCollege,
      collegeCity: formData.collegeCity,
      dob: formData.dob, // FIX: Use dob directly (already a Date object)
      linkedin: formData.linkedin,
    };

    console.log("🚀 ~ handleSubmit ~ backendData:", backendData);
    mutate(backendData);
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      await api().post("/email/sendOTP", {
        email: formData.email,
        mobile: formData.mobileNumber,
        institutionName:
          formData.institutionName ||
          formData.manualInstitutionName ||
          formData.collegeName,
      });
      setOtpSent(true);
      toast.success("OTP sent to your email address");
    } catch (err) {
      mutationErrorHandler(err as AxiosError<GenericError>);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      setIsVerifyingOtp(true);
      await api().post("/email/verifyOTP", {
        email: formData.email,
        otp: formData.otp,
      });
      setOtpVerified(true);
      toast.success("Email verified successfully");
    } catch (err) {
      mutationErrorHandler(err as AxiosError<GenericError>);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const stepTitles = [
    'Personal Information',
    'Contact Information', 
    'Institution Information'
  ];

  const renderStepIndicator = () => (
    <ol className="mb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3" aria-label="Progress">
      {[1, 2, 3].map((step) => (
        <li key={step} aria-current={step === currentStep ? 'step' : undefined} className="flex items-center gap-3">
          <span
            className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300 ${
              step === currentStep ? 'bg-deep text-white' : step < currentStep ? 'bg-brand text-white' : 'bg-tint text-deep'
            }`}
          >
            {step < currentStep ? <Check size={16} weight="bold" aria-hidden="true" /> : step}
          </span>
          {step === currentStep && <span className="t-label text-deep">{stepTitles[step - 1]}</span>}
          {step < 3 && <span aria-hidden="true" className="hidden h-px w-10 bg-tint sm:block" />}
        </li>
      ))}
    </ol>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="First Name *"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          required
        />
        <Input
          placeholder="Last Name *"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select onValueChange={(value) => handleInputChange('educationLevel', value)}>
          <SelectTrigger className="h-11 rounded-control border-tint bg-white text-ink/70">
            <SelectValue placeholder="Education Level *" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UG">Undergraduate (UG)</SelectItem>
            <SelectItem value="PG">Postgraduate (PG)</SelectItem>
            <SelectItem value="PhD">PhD</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleInputChange('department', value)}>
          <SelectTrigger className="h-11 rounded-control border-tint bg-white text-ink/70">
            <SelectValue placeholder="Department *" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Computer Science">Computer Science</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Biology">Biology</SelectItem>
            <SelectItem value="Chemistry">Chemistry</SelectItem>
            <SelectItem value="Physics">Physics</SelectItem>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="date"
          placeholder="Date of Birth *"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          required
        />

        <Select onValueChange={(value) => handleInputChange('currentYear', value)}>
          <SelectTrigger className="h-11 rounded-control border-tint bg-white text-ink/70">
            <SelectValue placeholder="Your Current Year *" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1st Year">1st Year</SelectItem>
            <SelectItem value="2nd Year">2nd Year</SelectItem>
            <SelectItem value="3rd Year">3rd Year</SelectItem>
            <SelectItem value="4th Year">4th Year</SelectItem>
            <SelectItem value="Graduate">Graduate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Input
          placeholder="LinkedIn Profile *"
          value={formData.linkedinProfile}
          onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="relative">
        <Input
          placeholder="Email *"
          type="email"
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
        />
        {otpVerified && (
          <CheckCircle size={20} weight="fill" className="absolute top-1/2 right-3 -translate-y-1/2 text-green-600" aria-hidden="true" />
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-control p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Warning size={20} className="shrink-0 text-yellow-600" aria-hidden="true" />
          <span className="text-yellow-800 text-sm">
            {otpVerified ? 'Email verified!' : 'Send an OTP to verify your email address.'}
          </span>
        </div>
        <button type="button" className="btn btn-primary shrink-0" onClick={handleSendOtp} disabled={otpSent}>
          {otpSent ? 'OTP Sent' : 'Send OTP'}
        </button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Enter Email OTP *"
          value={formData.otp}
          onChange={(e) => handleInputChange('otp', e.target.value)}
          className="flex-1"
          disabled={!otpSent}
        />
        <button
          type="button"
          className={`btn shrink-0 ${otpVerified ? 'bg-green-700 text-white' : 'btn-primary'}`}
          onClick={handleVerifyOtp}
          disabled={!otpSent || otpVerified || isVerifyingOtp}
        >
          {otpVerified ? 'Verified' : isVerifyingOtp ? 'Verifying...' : 'Verify'}
        </button>
      </div>

      <div>
        <PhoneInput
          placeholder="Mobile Number *"
          value={formData.mobileNumber}
          onChange={(mobile) => handleInputChange('mobileNumber', mobile)}
          required
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <Select onValueChange={(value) => handleInputChange('institutionName', value)}>
          <SelectTrigger className="h-11 w-full rounded-control border-tint bg-white text-ink/70">
            <SelectValue placeholder="Select Institution Name *" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MIT">MIT</SelectItem>
            <SelectItem value="Stanford University">Stanford University</SelectItem>
            <SelectItem value="Harvard University">Harvard University</SelectItem>
            <SelectItem value="IIT Delhi">IIT Delhi</SelectItem>
            <SelectItem value="IIT Bombay">IIT Bombay</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(formData.institutionName === 'other' || !formData.institutionName) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <Input
            placeholder="Enter the Institution Name *"
            value={formData.manualInstitutionName}
            onChange={(e) => handleInputChange('manualInstitutionName', e.target.value)}
          />
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-control p-3 flex items-center space-x-2">
            <Warning size={16} className="shrink-0 text-yellow-600" aria-hidden="true" />
            <span className="text-yellow-800 text-xs">
              Select your institution from list or enter manually if not listed.
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Address Line 1"
          value={formData.addressLine1}
          onChange={(e) => handleInputChange('addressLine1', e.target.value)}
        />
        <Input
          placeholder="Address Line 2"
          value={formData.addressLine2}
          onChange={(e) => handleInputChange('addressLine2', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select onValueChange={(value) => handleInputChange('city', value)}>
          <SelectTrigger className="h-11 rounded-control border-tint bg-white text-ink/70">
            <SelectValue placeholder="City *" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mumbai">Mumbai</SelectItem>
            <SelectItem value="Delhi">Delhi</SelectItem>
            <SelectItem value="Bangalore">Bangalore</SelectItem>
            <SelectItem value="Chennai">Chennai</SelectItem>
            <SelectItem value="Kolkata">Kolkata</SelectItem>
            <SelectItem value="Pune">Pune</SelectItem>
            <SelectItem value="Hyderabad">Hyderabad</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleInputChange('state', value)}>
          <SelectTrigger className="h-11 rounded-control border-tint bg-white text-ink/70">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
            <SelectItem value="Delhi">Delhi</SelectItem>
            <SelectItem value="Karnataka">Karnataka</SelectItem>
            <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
            <SelectItem value="West Bengal">West Bengal</SelectItem>
            <SelectItem value="Telangana">Telangana</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Section */}
      <div className="bg-surface border border-tint rounded-control p-6 mt-6">
        <h4 className="text-lg font-semibold text-ink mb-4">Application Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ink/75">Name:</span>
            <span className="font-medium">{formData.firstName} {formData.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/75">Education:</span>
            <span className="font-medium">{formData.eduType} - {formData.department}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/75">Institution:</span>
            <span className="font-medium">{formData.collegeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/75">Email:</span>
            <span className="font-medium">{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/75">Date of Birth:</span>
            <span className="font-medium">{formData.dob ? formData.dob.toLocaleDateString() : 'Not provided'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PageFrame tone="surface">
      <PageHero
        kicker={
          <Link to="/campus-ambassador" className="nudge inline-flex items-center gap-2 text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white">
            <ArrowLeft size={16} aria-hidden="true" />
            Back
          </Link>
        }
        title={<span className="text-tint">Campus Ambassador Program</span>}
        description="Apply for"
      />

      <section className="section" aria-label="Application">
        <div className="container-x">
          <div className="mx-auto max-w-4xl">
            {renderStepIndicator()}

            <div className="card min-h-96 p-6 sm:p-8">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                className="btn btn-secondary"
                disabled={currentStep === 1}
              >
                <ArrowLeft size={16} aria-hidden="true" />
                BACK
              </button>

              <button type="button" onClick={nextStep} className="btn btn-primary" disabled={isPending}>
                {currentStep === 3 ? (isPending ? 'SUBMITTING...' : 'SUBMIT APPLICATION') : 'CONTINUE'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageFrame>
  );
};

export default CampusAmbassadorBooking;
