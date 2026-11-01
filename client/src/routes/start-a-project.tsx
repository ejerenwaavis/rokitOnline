import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { RouteShell } from "@/components/route-shell";
import { StartProjectExperience } from "@/components/start-project-experience";
import { shopProducts, productEnquiryText } from "@/lib/shop-products";

export const Route = createFileRoute("/start-a-project")({
  validateSearch: z.object({ route: z.enum(["know-what-i-need", "build-my-brief", "send-my-brief"]).optional().catch(undefined), product: z.string().max(60).optional().catch(undefined), intent: z.enum(["buy-plain", "customise"]).optional().catch(undefined) }),
   head: () => ({ meta: [{ title: "Start a Project — rOKIt" }, { name: "description", content: "Start with what you have. Tell rOKIt what you are trying to make happen, think it through with rOKIt Discovery, or send your brief privately." }, { property: "og:title", content: "Start With What You Have. — rOKIt" }, { property: "og:description", content: "Three ways to start a project with rOKIt." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: StartProjectPage,
});

function StartProjectPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/start-a-project" });
  const product = shopProducts.find(item => item.slug === search.product);
  return <RouteShell eyebrow="Start a Project" title="Start With What You Have." intro="We’ll help work out what it needs next.">
    <StartProjectExperience selected={search.route ?? null} initialDetails={product ? productEnquiryText(product, search.intent) : ""} onSelect={(route) => void navigate({ search: (previous) => ({ ...previous, route }), resetScroll: false })} />
    <div className="mt-16 border-t border-paper/15 pt-8"><p className="text-xs uppercase text-signal">What happens next</p><p className="mt-4 font-display text-xl leading-relaxed">Review → Clarify if necessary → Recommend next step → Proceed when scope is clear</p></div>
  </RouteShell>;
}
