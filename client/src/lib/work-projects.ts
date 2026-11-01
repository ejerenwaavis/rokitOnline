import brandIdentity from "@/assets/rokit-brand-identity.jpg";
import digital from "@/assets/rokit-digital.jpg";
import editorial from "@/assets/rokit-editorial.jpg";
import implementation from "@/assets/rokit-implementation.jpg";
import madeReal from "@/assets/rokit-made-real.jpg";
import materialProof from "@/assets/rokit-material-proof.jpg";

export const disciplines = ["Brand & Identity", "Websites & Digital Solutions", "Marketing & Growth", "Communication & Content", "Physical Brand & Production"] as const;
export type Discipline = typeof disciplines[number];
export type WorkProject = {
  slug: string;
  name: string;
  format: "deep" | "compact";
  homepage?: boolean;
  disciplines: readonly Discipline[];
  sector?: string;
  hook: string;
  secondary?: string;
  principle?: string;
  contribution?: string;
  /** Publish only verified case material. Missing modules stay absent. */
  story?: {
    situation?: string;
    audience?: string;
    observation?: string;
    process?: string;
    result?: string;
    lesson?: string;
    relatedIdea?: string;
  };
  evidence?: readonly { src: string; alt: string; caption: string }[];
  image: string;
  imageAlt: string;
  publicationStatus?: "public" | "verify-before-publication";
  truthLabel?: "Archive" | "Presentation recreation" | "Concept" | "Current live work";
};

// Images are discipline-matched editorial placeholders, not documentary project evidence.
export const workProjects: readonly WorkProject[] = [
  { slug: "afriteach", name: "AfriTeach", format: "deep", homepage: true, disciplines: ["Brand & Identity", "Websites & Digital Solutions", "Communication & Content", "Physical Brand & Production"], sector: "Education", hook: "From an Education Idea to a Brand Built to Travel.", principle: "Build the system, not just the logo.", image: brandIdentity, imageAlt: "Editorial study of large letterforms on an interior wall; not project documentation" },
  { slug: "abebi-foods", name: "Abebi Foods", format: "deep", homepage: true, disciplines: ["Brand & Identity", "Physical Brand & Production"], sector: "Food", hook: "Built at the Beginning. Still Growing.", contribution: "rOKIt developed the early identity and its applications.", image: madeReal, imageAlt: "Editorial study of printed stationery and material samples; not project documentation" },
  { slug: "dr-kehinde-nwani", name: "Dr Kehinde Nwani", format: "deep", homepage: true, disciplines: ["Websites & Digital Solutions"], hook: "A Digital Home for a Life of Work.", principle: "A website should reduce complexity without reducing the person.", image: digital, imageAlt: "Editorial study of a digital interface on a monitor; not project documentation" },
  { slug: "windows", name: "winDOWS", format: "deep", homepage: true, disciplines: ["Brand & Identity", "Marketing & Growth", "Communication & Content", "Physical Brand & Production"], hook: "One Identity. Several Years. Hundreds of Touchpoints.", image: implementation, imageAlt: "Editorial study of dark panels in a concrete interior; not project documentation" },
  { slug: "ncdmb", name: "NCDMB", format: "compact", homepage: true, disciplines: ["Physical Brand & Production"], hook: "When the Object Becomes Part of the Idea.", image: materialProof, imageAlt: "Editorial study of a white printed piece against a dark background; not project documentation" },
  { slug: "abu-photos", name: "ABU Photos", format: "compact", homepage: true, disciplines: ["Communication & Content"], hook: "Nobody Cares About Your Logo.", secondary: "They care about what they came for.", image: editorial, imageAlt: "Editorial study of a white publication against a dark background; not project documentation" },
  { slug: "creditframes-africa", name: "CreditFrames Africa", format: "compact", disciplines: ["Brand & Identity", "Physical Brand & Production"], hook: "CreditFrames Africa", contribution: "rOKIt created the logo and branding from scratch, then extended it physically.", image: brandIdentity, imageAlt: "Editorial study of large letterforms on an interior wall; not project documentation" },
  { slug: "ngj-logistics", name: "NGJ Logistics", format: "compact", disciplines: ["Websites & Digital Solutions"], hook: "Logistics Is Complex. The Website Didn’t Need to Be.", image: digital, imageAlt: "Editorial study of a digital interface on a monitor; not project documentation" },
  { slug: "tsp-christ-amplified", publicationStatus: "verify-before-publication", name: "TSP / Christ Amplified", format: "compact", disciplines: ["Physical Brand & Production", "Communication & Content"], hook: "TSP / Christ Amplified", image: implementation, imageAlt: "Editorial study of dark panels in a concrete interior; not project documentation" },
  { slug: "finger-lickings", name: "Finger Lickings", format: "compact", disciplines: ["Marketing & Growth", "Communication & Content", "Physical Brand & Production"], hook: "A Campaign Is Not One Design in Ten Sizes.", image: implementation, imageAlt: "Editorial study of dark panels in a concrete interior; not project documentation" },
  { slug: "memorial-publications", name: "Memorial Publications", format: "compact", disciplines: ["Communication & Content", "Physical Brand & Production"], hook: "A Publication Is a System Disguised as Pages.", contribution: "rOKIt’s contribution centred on the editorial and production system.", image: editorial, imageAlt: "Editorial study of a white publication against a dark background; not project documentation" },
  { slug: "aruba", name: "Aruba", format: "compact", disciplines: ["Brand & Identity", "Physical Brand & Production"], hook: "When the Brand Leaves the Page.", image: madeReal, imageAlt: "Editorial study of printed stationery and material samples; not project documentation" },
];

export const publicProjects = workProjects.filter(project => project.publicationStatus !== "verify-before-publication");
export const homepageProjects = publicProjects.filter((project) => project.homepage);
export const servicePaths: Record<Discipline, "/services/brand-identity" | "/services/websites-digital" | "/services/marketing-growth" | "/services/communication-content" | "/services/physical-production"> = {
  "Brand & Identity": "/services/brand-identity",
  "Websites & Digital Solutions": "/services/websites-digital",
  "Marketing & Growth": "/services/marketing-growth",
  "Communication & Content": "/services/communication-content",
  "Physical Brand & Production": "/services/physical-production",
};

// Editorial browsing relationships, not claims of achieved outcomes. Jobs can span capabilities.
export const workNeeds = [
  { id: "recognition", label: "Be recognised", projects: ["afriteach", "abebi-foods", "windows", "creditframes-africa", "aruba"] },
  { id: "digital", label: "Work online", projects: ["afriteach", "dr-kehinde-nwani", "ngj-logistics"] },
  { id: "attention", label: "Reach people", projects: ["afriteach", "windows", "finger-lickings", "abu-photos"] },
  { id: "understanding", label: "Be understood", projects: ["afriteach", "dr-kehinde-nwani", "windows", "abu-photos", "memorial-publications", "ngj-logistics"] },
  { id: "physical", label: "Make something physical", projects: ["afriteach", "abebi-foods", "windows", "ncdmb", "creditframes-africa", "finger-lickings", "memorial-publications", "aruba"] },
] as const;

export function projectsForNeed(projects: readonly WorkProject[], needId?: string) {
  const need = workNeeds.find(item => item.id === needId);
  return need ? projects.filter(project => (need.projects as readonly string[]).includes(project.slug)) : projects;
}
export function capabilitiesForProjects(projects: readonly WorkProject[]) {
  return disciplines.filter(discipline => projects.some(project => project.disciplines.includes(discipline)));
}
