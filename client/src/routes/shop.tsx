import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { shopProducts, type ShopIntent } from "@/lib/shop-products";
import { RokitSiteHeader } from "@/components/rokit-site-header";
import { RokitSiteFooter } from "@/components/rokit-site-footer";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — rOKIt" },
      { name: "description", content: "Browse drinkware, apparel, bags, stationery and displays. Buy plain or customise with rOKIt; specifications and pricing are confirmed before ordering." },
      { property: "og:title", content: "Shop — rOKIt" },
      { property: "og:description", content: "Buy plain, customise, or make something with rOKIt. Explore the right starting point for physical work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const [category, setCategory] = useState("All");
  const [intent, setIntent] = useState<ShopIntent>("customise");
  const products = shopProducts.filter(product => category === "All" || product.category === category);
  return <div className="min-h-dvh bg-night font-body text-paper"><RokitSiteHeader /><main>
    <section className="mx-auto grid max-w-site content-center px-gutter pb-10 pt-section">
      <p className="section-label">Shop</p>
      <h1 className="mt-7 max-w-[16ch] font-display text-5xl leading-tight md:text-7xl">Buy plain. Customise. Make something.</h1>
      <p className="mt-7 max-w-[55ch] text-base leading-relaxed text-neutral">Start with the object. We’ll work out the specification, quantity and finish with you.</p>
      <div className="mt-8 flex flex-wrap items-center gap-2" role="group" aria-label="How would you like to begin?">
        <Button variant="ghost" aria-pressed={intent === "buy-plain"} onClick={() => setIntent("buy-plain")} className="min-h-12 rounded-none border-b border-paper/30 text-paper hover:bg-surface hover:text-signal aria-pressed:border-signal aria-pressed:text-signal">Buy plain</Button>
        <Button variant="ghost" aria-pressed={intent === "customise"} onClick={() => setIntent("customise")} className="min-h-12 rounded-none border-b border-paper/30 text-paper hover:bg-surface hover:text-signal aria-pressed:border-signal aria-pressed:text-signal">Customise</Button>
        <Link to="/start-a-project" className="action-link min-h-12 px-4 text-paper hover:text-signal">Make something <ArrowRight aria-hidden="true" /></Link>
      </div>
      <p className="mt-5 max-w-[65ch] text-xs leading-relaxed text-neutral">Product representations, not completed client work. Options, availability and current pricing are confirmed before any order.</p>
    </section>
    <section className="bg-paper text-night"><div className="mx-auto max-w-site px-gutter py-section">
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-y border-night/20 py-3" role="group" aria-label="Product categories">{["All", "Drinkware", "Apparel & bags", "Office & display", "Print & packaging"].map(item => <Button key={item} variant="ghost" aria-pressed={category === item} onClick={() => setCategory(item)} className="min-h-11 rounded-none px-0 text-night hover:bg-transparent hover:text-signal aria-pressed:underline">{item}</Button>)}</div>
      <p className="sr-only" role="status">{products.length} product categories shown.</p>
      <div className="shop-editorial-grid mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{products.map((product, index) => <article key={product.slug} className="min-w-0 border-b border-night/20 pb-6">
        <img src={product.image} alt={`Unbranded ${product.name.toLowerCase()} product representation`} width={384} height={512} loading={index === 0 ? "eager" : "lazy"} className="aspect-[4/5] w-full object-cover" />
        <p className="mt-4 text-xs uppercase text-night/65">{product.category}</p><h2 className="mt-2 font-display text-2xl">{product.name}</h2>
        <details className="mt-3"><summary className="min-h-11 cursor-pointer py-3 text-xs text-night/75">Details & options</summary><p className="text-sm leading-relaxed text-night/75">{product.description}</p><p className="mt-3 text-xs leading-relaxed text-night/65">{product.options}</p></details>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-night/20 pt-3"><span className="text-sm">Price on request</span><Link to="/start-a-project" search={{ route: "know-what-i-need", product: product.slug, intent }} className="action-link min-h-11 text-night hover:text-signal">{intent === "customise" ? "Customise / enquire" : "Enquire about plain"}<ArrowRight aria-hidden="true" /></Link></div>
      </article>)}</div>
      <div className="mt-16 flex flex-wrap justify-between gap-5 border-t border-night/20 pt-6"><p className="max-w-[42ch] font-display text-xl">The object is only the starting point.</p><Link to="/services/physical-production" className="action-link min-h-11 text-night hover:text-signal">How we make it properly <ArrowRight aria-hidden="true" /></Link></div>
    </div></section>
  </main><RokitSiteFooter /></div>;
}