import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import { PageFrame, PageHero } from '@/sfs/components/page/PageFrame';
import { Reveal } from '@/sfs/components/ui/Reveal';

const ExploreProgramDashboard = () => {
  const services = [
    {
      category: "Students (UG/PG/PhD), Job Seekers",
      title: "Individual",
      description: "Expert guidance to help you build in-demand skills, strengthen your profile, and unlock your highest personal potential.",
      route: "/skill-development"
    },
    {
      category: "Students, Researchers, Young Professionals",
      title: "Institutional",
      description: "Holistic development solutions for edu institutions focusing on career readiness, well-being, and skill enhancement programs.",
      route: "/institutions"
    },
   
    {
      category: "College Students, Campus Leaders",
      title: "Skill Development ",
      description: "Bridging academic learning with industrial skills for impactful career readiness.",
      route: "/skill-development"
    }
  ];
  
  return (
    <PageFrame tone="surface">
      <PageHero title="Explore Our Programs & Services" />

      <section className="section" aria-labelledby="services-title">
        <div className="container-x">
          <h2 id="services-title" className="t-title section-head">
            Our Services
          </h2>

          <ul className="grid gap-6 md:grid-cols-3">
            {services.map((service, index) => (
              <Reveal as="li" key={index} delay={index * 0.06} className="h-full">
                <Link
                  to={service.route}
                  className="card group flex h-full flex-col p-6 transition-[box-shadow,border-color] duration-300 hover:border-brand hover:shadow-raised sm:p-7"
                >
                  <p className="t-small text-ink/60">{service.category}</p>
                  <h3 className="t-heading mt-3">{service.title}</h3>
                  <p className="t-body mt-2 text-ink/70">{service.description}</p>
                  <span className="t-label nudge mt-auto inline-flex items-center gap-1.5 pt-6 text-deep underline decoration-tint decoration-2 underline-offset-4 group-hover:decoration-deep">
                    Explore
                    <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </PageFrame>
  );
};

export default ExploreProgramDashboard;
