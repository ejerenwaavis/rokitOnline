type OrganisationMark = {
  name: string;
  image: string;
  /** Optional visual adjustment for unusually wide or narrow marks. */
  opticalClassName?: string;
};

/** Render only marks explicitly cleared for public use; an empty set remains empty. */
export function OrganisationMarks({ marks }: { marks: readonly OrganisationMark[] }) {
  if (marks.length === 0) return null;

  return <ul className="grid grid-cols-2 items-center gap-x-10 gap-y-8 border-t border-paper/15 pt-8 md:grid-cols-4" aria-label="Selected brands and organisations">
    {marks.map((mark) => <li key={mark.name} className="flex min-h-16 items-center justify-center">
      <img src={mark.image} alt={mark.name} loading="lazy" className={`max-h-14 w-auto max-w-full object-contain grayscale ${mark.opticalClassName ?? ""}`} />
    </li>)}
  </ul>;
}