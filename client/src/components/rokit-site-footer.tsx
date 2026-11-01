import { Link } from "@tanstack/react-router";
import { FooterWordmark } from "@/components/rokit-interactive-sections";

export function RokitSiteFooter() {
  return <footer className="overflow-hidden border-t border-paper/15 bg-night text-paper">
    <div className="mx-auto grid max-w-site grid-cols-2 gap-8 px-gutter py-10 text-xs text-neutral md:grid-cols-4">
      <div><p className="mb-3 uppercase text-paper">Start something</p><Link to="/start-a-project" className="block min-h-11 hover:text-signal">Start a Project</Link><Link to="/start-a-project" search={{ route: "build-my-brief" }} className="block min-h-11 hover:text-signal">Build Your Brief</Link><Link to="/start-a-project" search={{ route: "send-my-brief" }} className="block min-h-11 hover:text-signal">Send Brief / Spec / ToR</Link><Link to="/shop" className="block min-h-11 hover:text-signal">Customise something</Link></div>
       <div><p className="mb-3 uppercase text-paper">Explore</p><Link to="/work" className="block min-h-11 hover:text-signal">Made by rOKIt</Link><Link to="/what-we-do" className="block min-h-11 hover:text-signal">Services</Link><Link to="/shop" className="block min-h-11 hover:text-signal">Shop</Link><Link to="/ideas" className="block min-h-11 hover:text-signal">Ideas</Link><Link to="/about" className="block min-h-11 hover:text-signal">About</Link></div>
      <div><p className="mb-3 uppercase text-paper">Ideas & knowledge</p><Link to="/ideas" className="block min-h-11 hover:text-signal">Latest Ideas</Link><Link to="/ideas" search={{ format: "Framework" }} className="block min-h-11 hover:text-signal">Frameworks</Link><Link to="/tools" className="block min-h-11 hover:text-signal">Tools</Link><Link to="/lab" className="block min-h-11 hover:text-signal">Lab / Experiments</Link></div>
      <div><p className="mb-3 uppercase text-paper">We Make Ideas RocK.</p><p className="max-w-40 leading-relaxed">Founded by Okorite Isokariari. Built across disciplines.</p></div>
    </div>
    <FooterWordmark />
    <div className="border-t border-paper/15"><div className="mx-auto flex max-w-site flex-wrap justify-between gap-3 px-gutter py-5 text-[10px] uppercase text-neutral"><span className="normal-case">rOKIt</span><span>We Make Ideas RocK.</span></div></div>
  </footer>;
}
