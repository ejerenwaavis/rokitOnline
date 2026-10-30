import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function ProjectGrid({ projects, compact = false }) {
  return (
    <div className={`grid gap-x-6 gap-y-12 ${compact ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"}`}>
      {projects.map((project, index) => (
        <figure key={project.slug} className={`min-w-0 ${!compact && index % 4 === 1 ? "md:pt-16" : ""}`}>
          <Link to={`/gallery`} className="group block focus-visible:outline-signal">
            <div className="overflow-hidden bg-surface">
              <div className="evidence-slot aspect-[4/3] flex items-center justify-center border border-paper/15 text-xs text-paper/60 font-mono" role="img" aria-label="MEDIA REQUIRED">
                MEDIA REQUIRED
              </div>
            </div>
            <figcaption className="mt-4 border-t border-paper/20 pt-4">
              <span className="text-xs uppercase tracking-wider text-signal">{project.disciplines[0]}</span>
              <div className="mt-2 flex items-start justify-between gap-4">
                <h3 className="font-v4-display text-2xl leading-snug text-paper group-hover:text-signal transition-colors">{project.name}</h3>
                <ArrowRight className="mt-1 size-5 shrink-0 text-signal" aria-hidden="true" />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-neutral">{project.hook}</p>
            </figcaption>
          </Link>
        </figure>
      ))}
    </div>
  );
}
