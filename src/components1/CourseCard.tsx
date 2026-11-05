import { ArrowRight, CalendarBlank, MapPin, UserCircle } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { COURSE_IMAGE_FALLBACK, handleCourseImageError } from "@/lib/courseImage";

interface CourseCardProps {
  /** Cover image URL. Null/absent for courses that never got one. */
  image?: string | null;
  category: string;
  tags: string[];
  title: string;
  description: string;
  startDate: string;
  mode: string;
  instructor: string;
  instructorImage?: string;
  trainingId?: string;
  isEnrolled?: boolean;
  onRegister?: () => void;
  onMoreDetails?: () => void;
}

/** Course row card in the SFS style: picture on the left, details on the right, one primary action. */
const CourseCard = ({
  image,
  category,
  tags,
  title,
  description,
  startDate,
  mode,
  instructor,
  instructorImage,
  isEnrolled,
  onRegister,
  onMoreDetails,
}: CourseCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="card group flex flex-col overflow-hidden transition-[box-shadow,border-color] duration-300 hover:border-brand hover:shadow-raised md:flex-row"
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-surface md:aspect-auto md:w-80">
        <img
          src={image || COURSE_IMAGE_FALLBACK}
          alt={title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={handleCourseImageError}
        />
        <span className="t-label absolute top-4 left-4 rounded-control bg-deep px-2.5 py-1 text-white">{category}</span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <ul className="flex flex-wrap gap-2" aria-label="Tags">
          {tags.map((tag) => (
            <li key={tag} className="chip text-deep">
              {tag}
            </li>
          ))}
        </ul>

        <h3 className="t-heading mt-3">{title}</h3>
        <p className="t-body mt-2 line-clamp-2 text-ink/70">{description}</p>

        <dl className="mt-4 grid gap-4 border-t border-tint pt-4 sm:grid-cols-3">
          <div className="flex items-start gap-2.5">
            <CalendarBlank size={22} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
            <div>
              <dt className="text-xs text-ink/60">Starts</dt>
              <dd className="t-small font-medium">{startDate}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin size={22} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
            <div>
              <dt className="text-xs text-ink/60">Online plus In person</dt>
              <dd className="t-small font-medium">{mode}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            {instructorImage ? (
              <img src={instructorImage} alt="" className="mt-0.5 size-[22px] shrink-0 rounded-full object-cover" />
            ) : (
              <UserCircle size={22} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
            )}
            <div>
              <dt className="text-xs text-ink/60">In collaboration with</dt>
              <dd className="t-small font-medium">{instructor}</dd>
            </div>
          </div>
        </dl>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5">
          <button
            type="button"
            onClick={onMoreDetails}
            className="t-label nudge inline-flex items-center gap-1.5 text-deep underline decoration-tint decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-deep"
          >
            More Details
            <ArrowRight size={16} aria-hidden="true" />
          </button>

          <button type="button" className="btn btn-primary" onClick={isEnrolled ? onMoreDetails : onRegister}>
            {isEnrolled ? "View Course" : "Register Now"}
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default CourseCard;
