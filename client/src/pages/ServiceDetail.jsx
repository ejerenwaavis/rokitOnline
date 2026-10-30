import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ServiceDetailPage from "../components/ui/ServiceDetailPage";
import PhysicalProductionStory from "../components/ui/PhysicalProductionStory";

const serviceConfigs = {
  "brand-identity": {
    variant: "brand",
    index: "01",
    metaTitle: "Brand & Identity — rOKIt",
    metaDescription: "Clarify what your brand needs to mean, then build recognition consistently.",
    title: "Make it recognisable.",
    support:
      "A strong identity starts before the logo. Get clear on what the brand needs to mean, what people should remember and how that meaning should show up consistently.",
    sections: [
      "Before the logo, get clear on what the brand needs to mean.",
      "A good name has work to do.",
      "A logo is one part of a much bigger identity.",
      "Recognition is built through repetition.",
      "A brand should sound like itself too.",
      "Make the brand easier to use correctly.",
      "Know what to keep before deciding what to change.",
    ],
    discipline: "Brand & Identity",
    cta: "What should people remember about your brand?",
    quote: {
      text: "A logo is the visual representation of a company’s identity, direction and aspirations. It should be simple enough to remember and distinctive enough to recognise, while carrying layers of meaning — some immediate, some discovered over time — that can guide, inspire and connect the people behind the brand.",
      attribution: "Okorite Isokariari, Founder & CEO, rOKIt",
    },
  },
  "websites-digital": {
    variant: "digital",
    index: "02",
    metaTitle: "Websites & Digital Solutions — rOKIt",
    metaDescription: "Useful websites and digital systems built around what people need to do.",
    title: "Your website should have a job.",
    secondary: "Not just hold information.",
    support:
      "Start with what people need to do and what the business needs to achieve. Then build the website, system or workflow around that.",
    sections: [
      "Start with the job, not the pages.",
      "Build what the problem actually needs.",
      "Make the next move obvious.",
      "Being online is not the same as being findable.",
      "Traffic is only useful if something happens next.",
      "When the software starts fighting the work.",
      "Own what you paid for.",
      "Launch. Learn. Improve.",
    ],
    discipline: "Websites & Digital Solutions",
    capabilities: [
      "Websites",
      "Portals",
      "Dashboards",
      "Booking and application systems",
      "Internal tools",
      "Databases and workflows",
      "Integrations and automation",
      "CMS and analytics",
      "Search Console",
      "Technical SEO / AEO",
      "Handover and support",
    ],
    cta: "What should your digital presence be helping people do?",
  },
  "marketing-growth": {
    variant: "marketing",
    index: "03",
    metaTitle: "Marketing & Growth — rOKIt",
    metaDescription: "Make clearer customer, channel and marketing decisions.",
    title: "Not everyone is your customer.",
    support:
      "The clearer you are about who matters, the easier it becomes to decide what to say, where to show up and what deserves your marketing budget.",
    sections: [
      "Know your customer before you choose your channel.",
      "Every channel is not your channel.",
      "Attention is not enough. Say something worth noticing.",
      "Your last customer may help find your next one.",
      "Measure what helps you decide what to do next.",
    ],
    discipline: "Marketing & Growth",
    cta: "Who are you trying to reach?",
  },
  "communication-content": {
    variant: "communication",
    index: "04",
    metaTitle: "Communication & Content — rOKIt",
    metaDescription: "Shape messages and information so people understand what matters.",
    title: "Don’t just say it. Make it understood.",
    support:
      "Shape the message, build the argument and structure the information so the people who need it can understand what matters.",
    sections: [
      "Start with what needs to be understood.",
      "Don’t just show the slides. Build the argument.",
      "Complex information needs clear structure.",
      "Some stories need more than one page.",
      "One good message shouldn’t fall apart across ten channels.",
      "More content is not automatically better communication.",
      "Words and design should do the job together.",
    ],
    discipline: "Communication & Content",
    cta: "What needs to be understood?",
  },
  "physical-production": {
    variant: "physical",
    index: "05",
    metaTitle: "Physical Brand & Production — rOKIt",
    metaDescription: "Design, specifications and quality control that survive production.",
    title: "Good design has to survive production.",
    support:
      "What looks right on screen still has to survive material, size, colour, finishing, quantity, handling and delivery.",
    sections: [
      "Production starts before the machine starts.",
      "A good design can still become a bad final product.",
      "Material is part of the design.",
      "Size changes design.",
      "Screen approval is not physical approval.",
      "Approve the sample. Then protect it.",
      "Plan for production reality.",
      "Count good units, not just units.",
      "Packaging is part of quality.",
      "Quality should leave evidence.",
      "Institutional work needs control beyond production.",
    ],
    discipline: "Physical Brand & Production",
    process:
      "Brief/ToR → Specification → Quote → Proof/Sample → Approval → Production → Quality Check → Packaging → Delivery",
    cta: "What needs to be made properly?",
    hasFeature: true,
  },
};

// Aliases for legacy slugs
const slugAliases = {
  "branding": "brand-identity",
  "brand": "brand-identity",
  "web-design": "websites-digital",
  "digital": "websites-digital",
  "marketing": "marketing-growth",
  "content": "communication-content",
  "graphic-design": "communication-content",
  "idea-creation": "communication-content",
  "large-format": "physical-production",
  "roll-up-banners": "physical-production",
  "physical": "physical-production",
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const canonicalSlug = slugAliases[slug] || slug;
  const config = serviceConfigs[canonicalSlug];

  if (!config) {
    return <Navigate to="/services" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{config.metaTitle}</title>
        <meta name="description" content={config.metaDescription} />
        <meta property="og:title" content={config.metaTitle} />
        <meta property="og:description" content={config.title} />
        <meta property="og:type" content="website" />
      </Helmet>

      <ServiceDetailPage
        variant={config.variant}
        index={config.index}
        title={config.title}
        secondary={config.secondary}
        support={config.support}
        sections={config.sections}
        cta={config.cta}
        discipline={config.discipline}
        capabilities={config.capabilities}
        quote={config.quote}
        process={config.process}
        feature={config.hasFeature ? <PhysicalProductionStory /> : null}
      />
    </>
  );
}
