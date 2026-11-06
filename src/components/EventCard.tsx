import { ArrowUpRight, Clock, CurrencyInr } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import { COURSE_IMAGE_FALLBACK, handleCourseImageError } from "@/lib/courseImage";
import { timeRange } from "@/lib/sessionTime";

interface EventCardProps {
  title: string;
  /** Formatted start date, used when the raw date is missing. */
  date: string;
  /** ISO start and end. When present they give the date badge and the time range. */
  startIso?: string;
  endIso?: string;
  location?: string;
  mode?: "ONLINE" | "OFFLINE" | "HYBRID";
  id: string;
  posterUrl: string;
  price: string;
  isEnrolled: boolean;
  isExpired?: boolean;
  category?: string;
  description?: string;
}

const MODE_LABEL = { ONLINE: "Online", OFFLINE: "Offline", HYBRID: "Hybrid" } as const;

/**
 * Session row for the seminars list: a date badge, the poster, the details and a round arrow into the session.
 * The whole row is one link to /training/:id (the same destination as the old Register and View details buttons).
 */
const EventCard: React.FC<EventCardProps> = ({ title, date, startIso, endIso, location, mode, id, posterUrl, price, isEnrolled, category, description }) => {
  const start = dayjs(startIso);
  const hasDate = !!startIso && start.isValid();
  const modeKey = mode ?? (location ? "OFFLINE" : "ONLINE");
  const time = timeRange(startIso, endIso);
  const free = !Number(price);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="card group relative flex flex-col gap-4 p-3 transition-[box-shadow,border-color] duration-300 hover:border-brand hover:shadow-raised sm:flex-row sm:items-stretch sm:gap-5 sm:p-4"
    >
      <div className="flex w-full shrink-0 items-center gap-4 sm:w-auto sm:items-stretch">
        <div
          className="grid h-20 w-20 shrink-0 place-content-center rounded-card bg-deep text-center text-white sm:h-auto sm:w-24"
          aria-hidden={!hasDate}
        >
          {hasDate ? (
            <>
              <span className="text-sm font-medium text-white/80">{start.format("MMM")}</span>
              <span className="text-3xl leading-none font-semibold sm:text-4xl">{start.format("D")}</span>
            </>
          ) : (
            <span className="px-2 text-xs font-medium text-white/80">Date to be announced</span>
          )}
        </div>
        <div className="aspect-[16/10] min-w-0 flex-1 overflow-hidden rounded-card bg-surface sm:w-60 sm:flex-none lg:w-72">
          <img
            src={posterUrl || COURSE_IMAGE_FALLBACK}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={handleCourseImageError}
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:py-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip text-deep">{category || "Uncategorized"}</span>
          <span className="chip text-ink/80">
            <span aria-hidden="true" className={`size-2 rounded-full ${modeKey === "OFFLINE" ? "bg-ink/40" : "bg-emerald-500"}`} />
            {MODE_LABEL[modeKey]}
          </span>
          {isEnrolled && <span className="chip !bg-emerald-50 text-emerald-800">Registered</span>}
        </div>

        <h3 className="t-heading line-clamp-2">
          <Link to={`/training/${id}`} className="outline-offset-4 after:absolute after:inset-0 after:content-['']">
            {title}
          </Link>
        </h3>

        <p className="t-small line-clamp-1 text-ink/70">{location || description || date}</p>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          <span className="chip !px-4 !py-2 text-sm text-ink">
            <CurrencyInr size={16} aria-hidden="true" />
            {free ? "Free" : Number(price).toLocaleString("en-IN")}
          </span>
          {time && (
            <span className="chip !px-4 !py-2 text-sm text-ink">
              <Clock size={16} aria-hidden="true" />
              {time}
            </span>
          )}
        </div>
      </div>

      <span
        aria-hidden="true"
        className="absolute top-4 right-4 grid size-11 shrink-0 place-items-center rounded-full bg-deep text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:static sm:size-14 sm:self-center motion-reduce:transition-none"
      >
        <ArrowUpRight size={22} />
      </span>
    </motion.article>
  );
};

export default EventCard;
