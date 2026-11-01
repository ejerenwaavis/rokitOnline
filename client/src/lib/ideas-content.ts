import brandStudy from "@/assets/rokit-brand-identity.jpg";
import type { Discipline } from "@/lib/work-projects";

export const ideaTopics = ["Business & Work", "Brand & Communication", "People & Potential", "Digital & AI", "Making & Quality", "Life & Perspective"] as const;
export type IdeaTopic = typeof ideaTopics[number];
export type IdeaFormat = "Practical answer" | "Story & lesson" | "Perspective" | "Founder note" | "Framework";
export type EditorialBlock =
  | { type: "section"; heading: string; paragraphs: readonly string[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "diagram"; title: string; steps: readonly string[] }
  | { type: "media"; kind: "video" | "audio"; src: string; title: string };
export type IdeaArticle = {
  slug: string; title: string; deck: string; topic: IdeaTopic; format: IdeaFormat;
  publicationStatus: "public" | "verify-first" | "restricted";
  author?: string; publishedAt?: string; updatedAt?: string;
  answer?: string; featured?: boolean; cover?: { src: string; alt: string; caption: string };
  body: readonly EditorialBlock[];
  relatedSlugs?: readonly string[]; relatedProjects?: readonly string[]; relatedService?: Discipline;
  relatedTool?: "brief";
};

// Only supplied, publication-safe writing belongs here. Optional credits/dates remain absent until verified.
const editorialRegistry: readonly IdeaArticle[] = [{
  slug: "nobody-cares-about-your-logo", title: "Nobody Cares About Your Logo.", deck: "They care about what they came for.",
  publicationStatus: "public", topic: "Brand & Communication", format: "Practical answer", featured: true,
  answer: "A logo can help someone recognise a brand. It cannot, on its own, answer what that brand does for them.",
  cover: { src: brandStudy, alt: "Editorial study of large letterforms; not project documentation", caption: "Editorial study · Not project documentation" },
  body: [
    { type: "section", heading: "Explanation", paragraphs: ["Identity matters most when it helps people find, understand and remember something useful. A recognisable mark is part of that work, not the whole of it. The words, the experience and the way the brand shows up all have to carry the same direction."] },
    { type: "section", heading: "Practical application", paragraphs: ["Start with the person meeting the brand. What are they here to do? What should they understand? Then decide what the identity needs to make clearer or easier to remember."] },
  ], relatedService: "Brand & Identity",
}];
export const ideaArticles = editorialRegistry.filter(article => article.publicationStatus === "public");
export function findIdea(slug: string) { return ideaArticles.find(article => article.slug === slug); }