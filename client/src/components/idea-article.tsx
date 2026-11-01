import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RokitSiteHeader } from "@/components/rokit-site-header";
import { RokitSiteFooter } from "@/components/rokit-site-footer";
import { ideaArticles, type IdeaArticle as Article, type EditorialBlock } from "@/lib/ideas-content";
import { servicePaths, publicProjects } from "@/lib/work-projects";

function ArticleBlock({ block }: { block: EditorialBlock }) {
  switch (block.type) {
    case "section": return <section><h2 className="section-label !text-night/65">{block.heading}</h2>{block.paragraphs.map(paragraph => <p key={paragraph} className="mt-5 text-lg leading-relaxed">{paragraph}</p>)}</section>;
    case "image": return <figure><img src={block.src} alt={block.alt} loading="lazy" className="h-auto w-full" />{block.caption && <figcaption className="mt-3 text-xs text-night/65">{block.caption}</figcaption>}</figure>;
    case "quote": return <blockquote className="border-l-2 border-signal pl-6"><p className="font-display text-2xl leading-relaxed">{block.text}</p>{block.attribution && <footer className="mt-4 text-sm text-night/65">{block.attribution}</footer>}</blockquote>;
    case "diagram": return <section><h2 className="section-label !text-night/65">{block.title}</h2><ol className="mt-5 grid gap-3">{block.steps.map((step, index) => <li key={step} className="border-l-2 border-signal py-2 pl-4"><span className="mr-4 text-xs">0{index + 1}</span>{step}</li>)}</ol></section>;
    case "media": return <figure>{block.kind === "video" ? <video controls preload="none" src={block.src} aria-label={block.title} className="w-full" /> : <audio controls preload="none" src={block.src} aria-label={block.title} className="w-full" />}<figcaption className="mt-3 text-xs">{block.title}</figcaption></figure>;
  }
}

export function IdeaArticle({ article }: { article: Article }) {
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState(false);
  const reading = ideaArticles.filter(item => item.slug !== article.slug && (article.relatedSlugs?.includes(item.slug) || item.topic === article.topic)).slice(0, 3);
  const projects = publicProjects.filter(project => article.relatedProjects?.includes(project.slug));
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setShareError(false); }
    catch { setShareError(true); }
  };
  return <div className="min-h-dvh bg-paper font-body text-night"><RokitSiteHeader /><main><article>
    <header className="mx-auto max-w-site px-gutter pb-16 pt-section"><Link to="/ideas" className="action-link min-h-11 text-night hover:text-signal">← Ideas</Link><p className="section-label mt-10 !text-night/65">{article.topic} · {article.format}</p><h1 className="mt-8 max-w-[15ch] font-display text-4xl leading-tight md:text-7xl">{article.title}</h1><p className="mt-7 max-w-[35ch] font-display text-2xl italic">{article.deck}</p>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-night/65">{article.author && <span>{article.author}</span>}{article.publishedAt && <time dateTime={article.publishedAt}>{article.publishedAt}</time>}{article.updatedAt && <span>Updated <time dateTime={article.updatedAt}>{article.updatedAt}</time></span>}<Button variant="ghost" onClick={() => void copyLink()} className="min-h-11 rounded-none px-0 text-night hover:bg-transparent hover:text-signal">{copied ? <Check aria-hidden="true" /> : <Link2 aria-hidden="true" />}{copied ? "Link copied" : "Copy link"}</Button><span role="status">{shareError ? "Copy the address from your browser to share." : ""}</span></div>
    </header>
    {article.answer && <div className="bg-night text-paper"><div className="mx-auto grid max-w-site gap-12 px-gutter py-section md:grid-cols-[minmax(0,.4fr)_minmax(0,1fr)]"><h2 className="section-label">The short answer</h2><p className="max-w-[45ch] font-display text-2xl leading-relaxed md:text-3xl">{article.answer}</p></div></div>}
    <div className="mx-auto max-w-site px-gutter py-section"><div className="max-w-[46rem] space-y-14 md:ml-auto">{article.body.map((block, index) => <ArticleBlock key={index} block={block} />)}
      <section className="border-t border-night/20 pt-8"><h2 className="section-label !text-night/65">Take it into the work</h2><div className="mt-5 grid gap-4">{article.relatedService && <><Link to={servicePaths[article.relatedService]} className="action-link min-h-11 justify-start text-night hover:text-signal">Explore {article.relatedService}<ArrowRight aria-hidden="true" /></Link><Link to="/work" search={{ discipline: article.relatedService }} className="action-link min-h-11 justify-start text-night hover:text-signal">See related work<ArrowRight aria-hidden="true" /></Link></>}{projects.map(project => <Link key={project.slug} to="/work/$slug" params={{ slug: project.slug }} className="action-link min-h-11 justify-start">{project.name}<ArrowRight aria-hidden="true" /></Link>)}{article.relatedTool === "brief" && <Link to="/start-a-project" search={{ route: "build-my-brief" }} className="action-link min-h-11 justify-start">Build Your Brief<ArrowRight aria-hidden="true" /></Link>}</div></section>
      {reading.length > 0 && <section className="border-t border-night/20 pt-8"><h2 className="section-label !text-night/65">Continue reading</h2>{reading.map(item => <Link key={item.slug} to="/ideas/$slug" params={{ slug: item.slug }} className="mt-5 block font-display text-xl hover:text-signal">{item.title}</Link>)}</section>}
      <Link to="/ideas" className="action-link min-h-11 text-night hover:text-signal">All Ideas<ArrowRight aria-hidden="true" /></Link>
    </div></div>
  </article></main><RokitSiteFooter /></div>;
}