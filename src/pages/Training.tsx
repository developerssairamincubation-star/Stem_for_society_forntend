import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { CaretLeft, Funnel, MagnifyingGlass } from "@phosphor-icons/react";
import { parseAsBoolean, useQueryState } from "nuqs";
import React, { useMemo, useState } from "react";
import Errorbox from "../components/Errorbox";
import EventCard from "../components/EventCard";
import { api } from "../lib/api";
import { withDevPreview } from "@/preview/devPreview";
import { courseCategories } from "../lib/data";
import { GenericError, GenericResponse } from "../lib/types";
import { formatDate } from "../lib/utils";
import { PageFrame, PageHero } from "@/sfs/components/page/PageFrame";
import { PageLoading } from "@/sfs/components/page/PageStatus";

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

function useTrainings() {
  return useQuery<
    { [key: string]: StudentTraining[] } | object,
    AxiosError<GenericError>
  >({
    queryKey: ["trainings"],
    queryFn: async () => {
      const raw = (
        await withDevPreview(() => api().get<GenericResponse<StudentTraining[]>>("/trainings"), "trainings")
      ).data;
      if (!raw || !raw.data || !(raw.data.length > 0)) return {};

      /**
       * Chronological, earliest first. The API returns newest-first and this
       * only grouped by month, so the catalogue read backwards. Sorted here so
       * the page stays right regardless of how the endpoint is ordered.
       */
      const undated: StudentTraining[] = [];
      const dated: StudentTraining[] = [];

      for (const tra of raw.data) {
        const start = dayjs(tra.startDate);
        (tra.startDate && start.isValid() ? dated : undated).push(tra);
      }

      dated.sort(
        (a, b) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf(),
      );

      const arranged = dated.reduce(
        (acc, tra) => {
          const date = dayjs(tra.startDate).format("MMMM YYYY");
          if (!acc[date]) acc[date] = [];
          acc[date].push(tra);
          return acc;
        },
        {} as { [key: string]: StudentTraining[] },
      );

      // A missing date previously produced a heading of "Invalid Date".
      if (undated.length > 0) {
        arranged["Date to be announced"] = undated;
      }

      return arranged;
    },
    staleTime: 1000 * 60 * 10,
  });
}

const Training: React.FC = () => {
  const { data: trainings, isLoading, error } = useTrainings();
  const [trainingFilter, setTrainingFilter] = useQueryState<string[] | null>(
    "filter",
    {
      defaultValue: null,
      parse(value) {
        return Array.isArray(value) ? value : value ? [value] : null;
      },
      clearOnDefault: true,
    },
  );
  const [filterByMe, setFilterByMe] = useQueryState<boolean>(
    "me",
    parseAsBoolean,
  );

  /** For searching and filtering training data */
  const [search, setSearch] = useState<string>("");

  const filteredTrainings = useMemo(() => {
    if (!trainings) return {};
    return Object.keys(trainings).reduce(
      (acc, key) => {
        const filtered = (
          trainings[key as keyof typeof trainings] as StudentTraining[]
        ).filter(
          (tra) =>
            tra.title.toLowerCase().includes(search.toLowerCase()) &&
            (trainingFilter &&
            Array.isArray(trainingFilter) &&
            trainingFilter.length > 0
              ? trainingFilter.includes(tra.category ?? "")
              : true) &&
            (filterByMe
              ? tra.enrolments.some(
                  (enr) =>
                    enr.transactions &&
                    enr.transactions.filter((tr) => tr.status === "success")
                      .length > 0,
                )
              : true),
        );
        if (filtered.length > 0) acc[key] = filtered;
        return acc;
      },
      {} as { [key: string]: StudentTraining[] },
    );
  }, [search, trainings, trainingFilter, filterByMe]);

  if (isLoading) {
    return <PageLoading label="Loading seminars…" />;
  }

  if (error) {
    return (
      <PageFrame tone="surface">
        <div className="container-x pt-32 pb-16">
          <Errorbox message={error.message} />
        </div>
      </PageFrame>
    );
  }

  const chipBase =
    "t-small inline-flex min-h-9 items-center rounded-full border px-4 py-1.5 font-medium transition-colors duration-200";

  return (
    <PageFrame tone="surface">
      <PageHero title="Upcoming Seminars & Webinars" />

      <section className="section" aria-label="Seminars and webinars">
        <div className="container-x">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {!filterByMe ? (
              <div role="group" aria-label="Filter by category" className="flex flex-wrap items-center gap-2">
                <Funnel size={20} className="mr-1 text-ink/50" aria-hidden="true" />
                {courseCategories.map((category) => {
                  const active = !!trainingFilter?.includes(category);
                  return (
                    <button
                      type="button"
                      key={category}
                      aria-pressed={active}
                      className={`${chipBase} ${
                        active ? "border-deep bg-deep text-white" : "border-tint bg-white text-deep hover:border-brand"
                      }`}
                      onClick={() =>
                        setTrainingFilter((prev) =>
                          !prev
                            ? [category]
                            : prev.includes(category)
                              ? prev.filter((x) => x !== category)
                              : [...prev, category],
                        )
                      }
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            ) : (
              <button type="button" className="btn btn-secondary nudge self-start" onClick={() => setFilterByMe(null)}>
                <CaretLeft size={16} aria-hidden="true" />
                Show all
              </button>
            )}
            <div className="relative w-full lg:w-80">
              <label htmlFor="training-search" className="sr-only">
                Search for training
              </label>
              <MagnifyingGlass size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink/50" aria-hidden="true" />
              <input
                id="training-search"
                type="search"
                className="!pl-10"
                placeholder="Search for training..."
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
              />
            </div>
          </div>

          <div className="grid gap-12">
            {!filteredTrainings ? (
              <Errorbox message="Something went wrong!" />
            ) : Object.keys(filteredTrainings).length === 0 ? (
              <p className="card mx-auto max-w-xl px-6 py-14 text-center t-lead text-ink/70">No search results found!</p>
            ) : (
              Object.keys(filteredTrainings).map((month) => (
                <section key={month} aria-label={month} className="grid gap-6">
                  <div className="flex items-center gap-5">
                    <h2 className="t-title shrink-0">{month}</h2>
                    <span aria-hidden="true" className="h-px flex-1 bg-tint" />
                    <span className="t-small shrink-0 text-ink/60">
                      {(filteredTrainings[month as keyof typeof filteredTrainings] as StudentTraining[]).length} session
                      {(filteredTrainings[month as keyof typeof filteredTrainings] as StudentTraining[]).length === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="grid gap-5">
                    {(filteredTrainings[month as keyof typeof filteredTrainings] as StudentTraining[]).map((event) => (
                      <EventCard
                        key={event.id}
                        id={event.id}
                        title={event.title}
                        date={formatDate(event.startDate)}
                        startIso={event.startDate}
                        endIso={event.endDate}
                        mode={event.type}
                        description={event.description}
                        location={event.location}
                        posterUrl={event.coverImg}
                        price={event.cost}
                        category={event.category}
                        isEnrolled={event.enrolments.some(
                          (enr) =>
                            enr.transactions &&
                            enr.transactions.filter((tr) => tr.status === "success").length > 0,
                        )}
                      />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      </section>
    </PageFrame>
  );
};

export default Training;
