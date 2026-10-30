import brandIdentity from "../assets/redesign/rokit-brand-identity.jpg";
import digital from "../assets/redesign/rokit-digital.jpg";
import editorial from "../assets/redesign/rokit-editorial.jpg";
import implementation from "../assets/redesign/rokit-implementation.jpg";
import madeReal from "../assets/redesign/rokit-made-real.jpg";
import materialProof from "../assets/redesign/rokit-material-proof.jpg";

export const disciplines = [
  "Brand & Identity",
  "Websites & Digital Solutions",
  "Marketing & Growth",
  "Communication & Content",
  "Physical Brand & Production",
];

export const workProjects = [
  {
    slug: "afriteach",
    name: "AfriTeach",
    format: "deep",
    homepage: true,
    disciplines: [
      "Brand & Identity",
      "Websites & Digital Solutions",
      "Communication & Content",
      "Physical Brand & Production",
    ],
    sector: "Education",
    hook: "From an Education Idea to a Brand Built to Travel.",
    principle: "Build the system, not just the logo.",
    story: {
      situation: "An educational venture needed a brand identity, platform, and physical presence designed to expand across regions without losing visual integrity.",
      observation: "Educational brands often start with a loose logo that fractures the moment publications, signage, digital portals, and certificates are required.",
      process: "rOKIt developed a modular design system connecting digital interfaces, curriculum publications, and event production.",
      result: "A cohesive brand operating across print, web, and physical learning environments.",
      lesson: "Design the farthest application first.",
    },
    image: brandIdentity,
    imageAlt: "Editorial study of large letterforms on an interior wall",
  },
  {
    slug: "abebi-foods",
    name: "Abebi Foods",
    format: "deep",
    homepage: true,
    disciplines: ["Brand & Identity", "Physical Brand & Production"],
    sector: "Food",
    hook: "Built at the Beginning. Still Growing.",
    contribution: "rOKIt developed the early identity and its packaging applications.",
    story: {
      situation: "A growing food brand needed an authentic identity and robust packaging specifications.",
      observation: "Food packaging must withstand handling, humidity, and production constraints while remaining instantly recognizable on shelves.",
      process: "Defined color palettes, typography, and material packaging guidelines.",
      result: "A distinctive identity recognized across retail and direct delivery channels.",
    },
    image: madeReal,
    imageAlt: "Editorial study of printed stationery and material samples",
  },
  {
    slug: "dr-kehinde-nwani",
    name: "Dr Kehinde Nwani",
    format: "deep",
    homepage: true,
    disciplines: ["Websites & Digital Solutions"],
    hook: "A Digital Home for a Life of Work.",
    principle: "A website should reduce complexity without reducing the person.",
    story: {
      situation: "A prominent education leader needed an authoritative digital platform unifying thought leadership, initiatives, and publications.",
      observation: "Multi-hyphenate leaders often end up with fragmented web pages that confuse visitors rather than guiding them.",
      process: "Built an intuitive digital architecture with streamlined navigation, media archives, and speaking engagement requests.",
      result: "An authoritative digital home that communicates decades of impact clearly.",
    },
    image: digital,
    imageAlt: "Editorial study of a digital interface on a monitor",
  },
  {
    slug: "windows",
    name: "winDOWS",
    format: "deep",
    homepage: true,
    disciplines: [
      "Brand & Identity",
      "Marketing & Growth",
      "Communication & Content",
      "Physical Brand & Production",
    ],
    hook: "One Identity. Several Years. Hundreds of Touchpoints.",
    image: implementation,
    imageAlt: "Editorial study of dark panels in a concrete interior",
  },
  {
    slug: "ncdmb",
    name: "NCDMB",
    format: "compact",
    homepage: true,
    disciplines: ["Physical Brand & Production"],
    hook: "When the Object Becomes Part of the Idea.",
    image: materialProof,
    imageAlt: "Editorial study of a white printed piece against a dark background",
  },
  {
    slug: "abu-photos",
    name: "ABU Photos",
    format: "compact",
    homepage: true,
    disciplines: ["Communication & Content"],
    hook: "Nobody Cares About Your Logo.",
    secondary: "They care about what they came for.",
    image: editorial,
    imageAlt: "Editorial study of a white publication against a dark background",
  },
  {
    slug: "creditframes-africa",
    name: "CreditFrames Africa",
    format: "compact",
    disciplines: ["Brand & Identity", "Physical Brand & Production"],
    hook: "CreditFrames Africa",
    contribution: "rOKIt created the logo and branding from scratch, then extended it physically.",
    image: brandIdentity,
    imageAlt: "Editorial study of large letterforms on an interior wall",
  },
  {
    slug: "ngj-logistics",
    name: "NGJ Logistics",
    format: "compact",
    disciplines: ["Websites & Digital Solutions"],
    hook: "Logistics Is Complex. The Website Didn’t Need to Be.",
    image: digital,
    imageAlt: "Editorial study of a digital interface on a monitor",
  },
  {
    slug: "finger-lickings",
    name: "Finger Lickings",
    format: "compact",
    disciplines: ["Marketing & Growth", "Communication & Content", "Physical Brand & Production"],
    hook: "A Campaign Is Not One Design in Ten Sizes.",
    image: implementation,
    imageAlt: "Editorial study of dark panels in a concrete interior",
  },
  {
    slug: "memorial-publications",
    name: "Memorial Publications",
    format: "compact",
    disciplines: ["Communication & Content", "Physical Brand & Production"],
    hook: "A Publication Is a System Disguised as Pages.",
    contribution: "rOKIt’s contribution centred on the editorial and production system.",
    image: editorial,
    imageAlt: "Editorial study of a white publication against a dark background",
  },
  {
    slug: "aruba",
    name: "Aruba",
    format: "compact",
    disciplines: ["Brand & Identity", "Physical Brand & Production"],
    hook: "When the Brand Leaves the Page.",
    image: madeReal,
    imageAlt: "Editorial study of printed stationery and material samples",
  },
];

export const publicProjects = workProjects;
export const homepageProjects = publicProjects.filter((project) => project.homepage);

export const servicePaths = {
  "Brand & Identity": "/services/brand-identity",
  "Websites & Digital Solutions": "/services/websites-digital",
  "Marketing & Growth": "/services/marketing-growth",
  "Communication & Content": "/services/communication-content",
  "Physical Brand & Production": "/services/physical-production",
};

export const workNeeds = [
  { id: "recognition", label: "Be recognised", projects: ["afriteach", "abebi-foods", "windows", "creditframes-africa", "aruba"] },
  { id: "digital", label: "Work online", projects: ["afriteach", "dr-kehinde-nwani", "ngj-logistics"] },
  { id: "attention", label: "Reach people", projects: ["afriteach", "windows", "finger-lickings", "abu-photos"] },
  { id: "understanding", label: "Be understood", projects: ["afriteach", "dr-kehinde-nwani", "windows", "abu-photos", "memorial-publications", "ngj-logistics"] },
  { id: "physical", label: "Make something physical", projects: ["afriteach", "abebi-foods", "windows", "ncdmb", "creditframes-africa", "finger-lickings", "memorial-publications", "aruba"] },
];

export function projectsForNeed(projects, needId) {
  const need = workNeeds.find((item) => item.id === needId);
  return need ? projects.filter((project) => need.projects.includes(project.slug)) : projects;
}

export function findProject(slugOrId) {
  return publicProjects.find((p) => p.slug === slugOrId || p.slug === slugOrId?.toLowerCase());
}
