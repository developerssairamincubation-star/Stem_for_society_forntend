import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlass } from "@phosphor-icons/react";
import CourseCard from "@/components1/CourseCard";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { api } from "@/lib/api";
import { GenericError, GenericResponse } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { PageFrame, PageHero } from "@/sfs/components/page/PageFrame";
import { PageLoading } from "@/sfs/components/page/PageStatus";
import Errorbox from "@/components/Errorbox";

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
  lessons: {
    id: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    title: string;
    location: string | null;
    type: "ONLINE" | "OFFLINE";
    trainingId: string | null;
    content: string | null;
    video: string | null;
    lastDate: Date | null;
  }[];
};

// Filter state interface
interface FilterState {
  searchQuery: string;
}

function useTrainings() {
  return useQuery<
    { [key: string]: StudentTraining[] } | object,
    AxiosError<GenericError>
  >({
    queryKey: ["trainings"],
    queryFn: async () => {
      const response = await api().get<GenericResponse<StudentTraining[]>>("/trainings");
      
      if (!response.data?.data?.length) return {};

      /**
       * Chronological, earliest first.
       *
       * The API returns newest-first and this only grouped by month, so the
       * page inherited that order and read backwards. Sorting here rather than
       * relying on the API keeps the page correct regardless of how the
       * endpoint is ordered later.
       */
      const undated: StudentTraining[] = [];
      const dated: StudentTraining[] = [];

      for (const training of response.data.data) {
        const start = dayjs(training.startDate);
        (training.startDate && start.isValid() ? dated : undated).push(training);
      }

      dated.sort((a, b) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf());

      // Object keys keep insertion order for non-numeric strings, so building
      // the groups in sorted order is what makes the months read in sequence.
      const groupedByMonth = dated.reduce(
        (acc, training) => {
          const monthYear = dayjs(training.startDate).format("MMMM YYYY");
          if (!acc[monthYear]) acc[monthYear] = [];
          acc[monthYear].push(training);
          return acc;
        },
        {} as { [key: string]: StudentTraining[] },
      );

      // A missing date used to produce a group headed "Invalid Date"; keep
      // those together at the end under a heading that says what they are.
      if (undated.length > 0) {
        groupedByMonth["Date to be announced"] = undated;
      }

      return groupedByMonth;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}



const Courses = () => {
  const navigate = useNavigate();
  const { data: trainings, isLoading, error } = useTrainings();
  const [search, setSearch] = useState<string>("");

  const isUserEnrolled = (training: StudentTraining) => {
    if (training.isEnrolled) return true;
    return training.enrolments.some(enrollment =>
      enrollment.transactions?.some(transaction => 
        transaction.status === "success"
      )
    );
  };

  const filteredTrainings = useMemo(() => {
    if (!trainings) return {};
    
    return Object.keys(trainings).reduce((result, monthKey) => {
      const monthTrainings = trainings[monthKey as keyof typeof trainings] as StudentTraining[];
      
      const filtered = monthTrainings.filter((training) => {
        // Only show enrolled courses
        const isEnrolled = isUserEnrolled(training);
        if (!isEnrolled) return false;
        
        // Apply search filter
        const searchTerm = search.toLowerCase();
        return !searchTerm ? true : 
          training.title.toLowerCase().includes(searchTerm) ||
          training.description?.toLowerCase().includes(searchTerm) ||
          training.category?.toLowerCase().includes(searchTerm);
      });

      if (filtered.length > 0) {
        result[monthKey] = filtered;
      }
      return result;
    }, {} as { [key: string]: StudentTraining[] });
  }, [trainings, search]);

  if (isLoading) return <PageLoading label="Loading your courses…" />;
  if (error)
    return (
      <PageFrame tone="surface">
        <div className="container-x pt-32 pb-16">
          <Errorbox message={error.message} />
        </div>
      </PageFrame>
    );

  return (
    <PageFrame tone="surface">
      <PageHero title="My Courses" description="Your enrolled training programs and courses" />

      <section className="section" aria-label="Your courses">
        <div className="container-x">
          {/* Search Bar */}
          <div className="mb-10">
            <div className="relative max-w-md">
              <label htmlFor="course-search" className="sr-only">
                Search your courses
              </label>
              <MagnifyingGlass size={20} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink/50" aria-hidden="true" />
              <input
                id="course-search"
                type="text"
                placeholder="Search your courses..."
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                className="!pl-11"
              />
            </div>
          </div>

          {/* Course Listings by Month */}
          <div className="grid gap-12">
            {Object.keys(filteredTrainings).length > 0 ? (
              Object.entries(filteredTrainings).map(([monthKey, monthTrainings]) => (
                <section key={monthKey} aria-label={monthKey} className="grid gap-6">
                  <h2 className="t-title border-b-2 border-brand pb-4">{monthKey}</h2>

                  <div className="grid grid-cols-1 gap-5 md:gap-6">
                    {(monthTrainings as StudentTraining[]).map((training) => (
                      <CourseCard
                        key={training.id}
                        image={training.coverImg}
                        category={training.category || 'Course'}
                        tags={[training.category || 'Course', 'For Individuals']}
                        title={training.title}
                        description={training.description}
                        startDate={formatDate(training.startDate)}
                        mode={training.type}
                        instructor={`${training.instructor?.firstName || ''} ${training.instructor?.lastName || ''}`.trim() || 'Instructor'}
                        instructorImage={undefined}
                        trainingId={training.id}
                        isEnrolled={isUserEnrolled(training)}
                        onRegister={() => navigate(`/course-detail/${training.id}`)}
                        onMoreDetails={() => navigate(`/course-detail/${training.id}`)}
                      />
                    ))}
                  </div>
                </section>
              ))
            ) : (
              <div className="card mx-auto max-w-xl px-6 py-14 text-center">
                <p className="t-lead text-ink/70">No enrolled courses found. Explore available courses to get started.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageFrame>
  );
};

export default Courses;
