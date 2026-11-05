import { ArrowRight, CalendarBlank, MapPin } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";
import { COURSE_IMAGE_FALLBACK, handleCourseImageError } from "@/lib/courseImage";

interface EventCardProps {
  title: string;
  date: string;
  location?: string;
  id: string;
  posterUrl: string;
  price: string;
  isEnrolled: boolean;
  isExpired?: boolean;
  category?: string;
}

/** Seminar / webinar row in the SFS style. Same props and the same two links as before. */
const EventCard: React.FC<EventCardProps> = ({ title, date, location, id, posterUrl, price, isEnrolled, isExpired, category }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="card group flex w-full flex-col overflow-hidden transition-[box-shadow,border-color] duration-300 hover:border-brand hover:shadow-raised lg:flex-row"
    >
      <div className="aspect-video w-full shrink-0 overflow-hidden bg-surface lg:w-80">
        <img
          src={posterUrl || COURSE_IMAGE_FALLBACK}
          alt={title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={handleCourseImageError}
        />
      </div>

      <div className="flex w-full flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <h3 className="t-heading line-clamp-2">{title}</h3>
          <span className="chip shrink-0 self-start text-deep">{category || "Uncategorized"}</span>
        </div>

        <dl className="t-small grid gap-2">
          <div className="flex items-center gap-2.5">
            <CalendarBlank size={20} className="text-brand" aria-hidden="true" />
            <dt className="text-ink/60">Date:</dt>
            <dd className="font-medium">{date}</dd>
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin size={20} className="text-brand" aria-hidden="true" />
            <dt className="text-ink/60">Mode:</dt>
            <dd className="font-medium">{location ? "Offline" : "Online"}</dd>
          </div>
          {location && (
            <div className="flex gap-2.5 pl-[30px]">
              <dt className="text-ink/60">Location:</dt>
              <dd className="line-clamp-2 font-medium">{location}</dd>
            </div>
          )}
        </dl>

        <div className="mt-auto flex flex-col gap-4 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-heading">₹ {price}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {!isEnrolled && !isExpired ? (
              <Link to={`/training/${id}`} className="btn btn-primary">
                Register now
              </Link>
            ) : (
              <button type="button" className="btn btn-primary" disabled>
                Already Registered
              </button>
            )}
            <Link to={`/training/${id}`} className="btn btn-secondary nudge">
              View details
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default EventCard;
