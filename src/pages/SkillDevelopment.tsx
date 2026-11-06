import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components1/ui/select";
import { PageFrame, PageHero } from "@/sfs/components/page/PageFrame";
import { PageLoading } from "@/sfs/components/page/PageStatus";
import { CatalogueEmpty, CatalogueFilters } from "@/sfs/components/page/Catalogue";
import FinishingSchoolCard from "@/components1/FinishingSchoolCard";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { withDevPreview } from "@/preview/devPreview";
import { GenericError, GenericResponse } from "@/lib/types";
import { calculateDuration, formatDate } from "@/lib/utils";
import Errorbox from "@/components/Errorbox";

// Student training data structure (imported from Courses.tsx pattern)
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

// Fetch only Skill Development courses
function useSkillDevelopmentCourses() {
  return useQuery<StudentTraining[], AxiosError<GenericError>>({
    queryKey: ["trainings", "skill-development"],
    queryFn: async () => {
      const response = await withDevPreview(() => api().get<GenericResponse<StudentTraining[]>>("/trainings/skill-developments"), "courses");
      console.log("🚀 Skill Development courses:", response.data);
      if (!response.data?.data?.length) return [];
      
      // Filter for Skill Development courses only

      
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

// Filter state interface
interface FilterState {
  category: string;
 
  mode: string;
  searchQuery: string;
}

const SkillDevelopment = () => {
  const navigate = useNavigate();
  const { data: courses, isLoading, error } = useSkillDevelopmentCourses();

  // The Our Academy menu opens this page with a topic (?category=...), which is chosen in the existing category filter.
  const [searchParams] = useSearchParams();
  const topic = searchParams.get("category") ?? "";

  const [filters, setFilters] = useState<FilterState>({
    category: topic,
 
    mode: "",
    searchQuery: "",
  });

  useEffect(() => {
    setFilters((prev) => (prev.category === topic ? prev : { ...prev, category: topic }));
  }, [topic]);

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      category: "",
     
      mode: "",
      searchQuery: "",
    });
  };

  // Filter courses based on selected filters
  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    
    return courses.filter((course) => {
      const searchTerm = filters.searchQuery.toLowerCase();
      const matchesSearch = !searchTerm || 
        course.title.toLowerCase().includes(searchTerm) ||
        course.description?.toLowerCase().includes(searchTerm) ||
        course.category?.toLowerCase().includes(searchTerm);
      
      const matchesCategory = !filters.category || filters.category === "all" ||
        course.category?.toLowerCase().includes(filters.category.toLowerCase());
      
      // For level, we can check category or add a level field if backend provides it
   
      
      const matchesMode = !filters.mode || filters.mode === "all" ||
        course.type?.toLowerCase() === filters.mode.toLowerCase();
      
      return matchesSearch && matchesCategory && matchesMode;
    });
  }, [courses, filters]);

  // Extract unique categories from courses
  const uniqueCategories = useMemo(() => {
    if (!courses) return [];
    const categories = courses
      .map(course => course.category)
      .filter((category): category is string => !!category);
    return Array.from(new Set(categories)).sort();
  }, [courses]);

  if (isLoading) return <PageLoading label="Loading courses…" />;
  if (error)
    return (
      <PageFrame tone="surface">
        <div className="container-x pt-32 pb-16">
          <Errorbox message={error.message} />
        </div>
      </PageFrame>
    );

  const trigger = "h-11 w-[170px] rounded-control border-tint bg-white font-medium text-ink";

  return (
    <PageFrame tone="surface">
      <PageHero
        title={
          <>
            Transform Your Career with <span className="text-tint">Industry-Ready Skills</span>
          </>
        }
      />

      <section className="section" aria-label="Course catalogue">
        <div className="container-x">
          <CatalogueFilters
            search={filters.searchQuery}
            onSearch={(value) => handleFilterChange("searchQuery", value)}
            onReset={handleResetFilters}
          >
            {/* Category Dropdown */}
            <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger className={trigger} aria-label="Category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Mode Dropdown */}
            <Select value={filters.mode} onValueChange={(value) => handleFilterChange("mode", value)}>
              <SelectTrigger className={trigger} aria-label="Mode">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </CatalogueFilters>

          {/* Results Count */}
          <p className="t-body mb-6 text-ink/70" aria-live="polite">
            Showing <span className="font-semibold text-ink">{filteredCourses.length}</span> courses
          </p>

          {/* Course Grid */}
          {filteredCourses.length > 0 ? (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredCourses.map((course) => (
                <li key={course.id}>
                  <FinishingSchoolCard
                    courseId={course.id}
                    image={course.coverImg}
                    universityLogo={undefined}
                    universityName={course.instructor?.institutionName || `${course.instructor?.firstName || ''} ${course.instructor?.lastName || ''}`.trim()}
                    badge={course.category || 'Course'}
                    title={course.title}
                    description={course.description}
                    duration={calculateDuration(course.startDate, course.endDate)}
                    mode={course.type}
                    modeDescription={course.type === "ONLINE" ? "Live Online Sessions" : course.type === "HYBRID" ? "Online + Offline" : "In-Person"}
                    startDate={formatDate(course.startDate)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <CatalogueEmpty onReset={handleResetFilters} />
          )}
        </div>
      </section>
    </PageFrame>
  );
};

export default SkillDevelopment;
