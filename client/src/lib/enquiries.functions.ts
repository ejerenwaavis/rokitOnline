import { z } from "zod";

const enquirySchema = z.object({
  route: z.enum(["know-what-i-need", "build-my-brief", "send-my-brief"]),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  organisation: z.string().trim().max(160).optional(),
  projectDetails: z.string().trim().max(5000).optional(),
  discovery: z.object({
    problem: z.string().trim().min(10).max(1500),
    people: z.string().trim().min(3).max(1000),
    change: z.string().trim().min(10).max(1500),
    existing: z.string().trim().max(1000).optional(),
    timing: z.string().trim().max(300).optional(),
  }).optional(),
  consent: z.literal(true),
  file: z.object({
    name: z.string().trim().min(1).max(180),
    type: z.enum(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]),
    base64: z.string().max(14_000_000),
  }).optional(),
  website: z.string().optional(),
  _formLoadedAt: z.number().optional(),
}).superRefine((value, ctx) => {
  if (value.route === "build-my-brief" && !value.discovery) ctx.addIssue({ code: "custom", message: "Discovery answers are required.", path: ["discovery"] });
  if (value.route === "know-what-i-need" && (value.projectDetails ?? "").length < 10) ctx.addIssue({ code: "custom", message: "Please add at least 10 characters of project detail.", path: ["projectDetails"] });
  if (value.route === "send-my-brief" && !value.file) ctx.addIssue({ code: "custom", message: "Please attach your brief, specification or ToR.", path: ["file"] });
});

export async function submitEnquiry({ data }: { data: z.infer<typeof enquirySchema> }) {
  const parsed = enquirySchema.parse(data);
  const d = parsed.discovery;
  const projectDetails = d
    ? [
        `Problem: ${d.problem}`,
        `People affected: ${d.people}`,
        `What needs to change: ${d.change}`,
        d.existing ? `Already in place: ${d.existing}` : "",
        d.timing ? `Timing: ${d.timing}` : "",
      ]
        .filter(Boolean)
        .join("\n\n")
        .slice(0, 5000)
    : (parsed.projectDetails && parsed.projectDetails.length >= 10
        ? parsed.projectDetails
        : `Document submitted: ${parsed.file?.name ?? "brief"}${parsed.projectDetails ? ` — ${parsed.projectDetails}` : ""}`
      ).slice(0, 5000);

  const response = await fetch("/api/quotes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: parsed.name,
      email: parsed.email,
      phone: parsed.organisation || "N/A",
      serviceType: parsed.route,
      projectDescription: projectDetails,
      website: parsed.website || "",
      _formLoadedAt: parsed._formLoadedAt,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.message || "Could not submit enquiry. Please check your details and try again.");
  }

  return { ok: true };
}

export async function recordJourneyEvent(_payload: any) {
  return { ok: true };
}
