import { ArrowRight, CalendarBlank, Clock, MapPin } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { COURSE_IMAGE_FALLBACK, handleCourseImageError } from "@/lib/courseImage";

interface FinishingSchoolCardProps {
  courseId: string;
  image: string;
  universityLogo?: string;
  universityName?: string;
  badge: string;
  title: string;
  description: string;
  duration: string;
  mode: string;
  modeDescription: string;
  startDate: string;
}

/** Programme card in the SFS style: 16:10 picture, category label, title, three facts and one action. */
const FinishingSchoolCard = ({
  courseId,
  image,
  universityLogo,
  universityName,
  badge,
  title,
  description,
  duration,
  mode,
  modeDescription,
  startDate,
}: FinishingSchoolCardProps) => {
  const navigate = useNavigate();

  const facts = [
    { Icon: Clock, label: "Duration", value: duration },
    { Icon: MapPin, label: mode, value: modeDescription },
    { Icon: CalendarBlank, label: "Starts", value: startDate },
  ];

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="card group flex h-full flex-col overflow-hidden transition-[box-shadow,border-color] duration-300 hover:border-brand hover:shadow-raised"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
        <img
          src={image || COURSE_IMAGE_FALLBACK}
          alt={title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={handleCourseImageError}
        />
        <span className="t-label absolute top-4 left-4 rounded-control bg-deep px-2.5 py-1 text-white">{badge}</span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {(universityLogo || universityName) && (
          <div className="mb-3 flex items-center gap-2">
            {universityLogo && <img src={universityLogo} alt="" className="h-7 w-auto object-contain" />}
            {universityName && <span className="t-small truncate font-medium text-ink/75">{universityName}</span>}
          </div>
        )}

        <h3 className="t-heading line-clamp-2">{title}</h3>
        <p className="t-body mt-2 line-clamp-3 text-ink/70">{description}</p>

        <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-tint pt-5 sm:grid-cols-3">
          {facts.map(({ Icon, label, value }) => (
            <div key={label} className="flex min-w-0 items-start gap-2.5">
              <Icon size={20} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
              <div className="min-w-0">
                <dt className="truncate text-xs text-ink/60">{label}</dt>
                <dd className="t-small font-medium">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="mt-auto pt-6">
          <button type="button" onClick={() => navigate(`/academy-detail/${courseId}`)} className="btn btn-primary nudge w-full sm:w-auto">
            Explore more
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default FinishingSchoolCard;
