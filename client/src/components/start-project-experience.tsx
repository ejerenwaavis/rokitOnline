import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, FileUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { recordJourneyEvent, submitEnquiry } from "@/lib/enquiries.functions";

export type RouteChoice = "know-what-i-need" | "build-my-brief" | "send-my-brief";

const choices = [
  { id: "know-what-i-need" as const, number: "01", title: "I know what I need.", copy: "Tell us what needs to happen and what you already know." },
  { id: "build-my-brief" as const, number: "02", title: "I’m still working it out.", copy: "Answer a few plain questions. rOKIt Discovery shapes them into a starting point." },
  { id: "send-my-brief" as const, number: "03", title: "I already have a brief/spec/ToR.", copy: "Upload it privately. No need to retype what is already written." },
];

const discoverySteps = [
  { key: "problem", label: "What are you trying to make happen?", hint: "Describe the situation in your own words. Rough is fine.", min: 10, max: 1500, rows: 5, required: true },
  { key: "people", label: "Who is it for, or who is affected?", hint: "Customers, staff, members, funders — whoever needs this to work.", min: 3, max: 1000, rows: 4, required: true },
  { key: "change", label: "What should be different when it works?", hint: "What would people notice, do or understand afterwards?", min: 10, max: 1500, rows: 4, required: true },
  { key: "existing", label: "What already exists? (optional)", hint: "A name, a logo, a website, a document, an earlier attempt.", min: 0, max: 1000, rows: 3, required: false },
  { key: "timing", label: "Is there a date or moment this is working towards? (optional)", hint: "A launch, an event, a funding round — or no fixed date yet.", min: 0, max: 300, rows: 2, required: false },
] as const;

type DiscoveryKey = (typeof discoverySteps)[number]["key"];
type AllowedType = "application/pdf" | "application/msword" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const allowedTypes: readonly AllowedType[] = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const MAX_BYTES = 10_000_000;

function sessionId() {
  const key = "rokit-anonymous-session";
  const current = window.sessionStorage.getItem(key);
  if (current) return current;
  const created = crypto.randomUUID();
  window.sessionStorage.setItem(key, created);
  return created;
}

function track(stage: "Viewed" | "Route selected" | "Form started" | "Progressed" | "Submitted", eventName: string) {
  void recordJourneyEvent({ data: { anonymousSessionId: sessionId(), journey: "start-project", stage, eventName, route: window.location.pathname } }).catch(() => undefined);
}

function friendlyError(caught: unknown) {
  const message = caught instanceof Error ? caught.message : "";
  if (message && message.length < 160 && !message.includes("{")) return message;
  return "Your enquiry could not be sent. Nothing was lost on this page — please check your details and try again.";
}

export function StartProjectExperience({ selected, onSelect, initialDetails = "" }: { selected: RouteChoice | null; onSelect: (route: RouteChoice) => void; initialDetails?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<DiscoveryKey, string>>({ problem: "", people: "", change: "", existing: "", timing: "" });
  const [fileName, setFileName] = useState("");
  const [details, setDetails] = useState(initialDetails);
  const [contact, setContact] = useState({ name: "", email: "", organisation: "", consent: false });
  const startedRef = useRef<string | null>(null);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => { track("Viewed", "start_project_viewed"); }, []);
  useEffect(() => { setError(""); setStatus("idle"); setStep(0); setFileName(""); }, [selected]);
  useEffect(() => { if (status === "sent") statusRef.current?.focus(); }, [status]);

  const markStarted = () => {
    if (selected && startedRef.current !== selected) { startedRef.current = selected; track("Form started", `start_project_${selected}_form_started`); }
  };

  if (status === "sent") {
    return <div ref={statusRef} tabIndex={-1} className="border-l-2 border-signal pl-6 outline-none" role="status">
      <Check className="size-6 text-signal" aria-hidden="true" />
      <h2 className="mt-5 font-display text-3xl">We’ve got it.</h2>
      <p className="mt-4 max-w-[58ch] text-paper/70">Your enquiry{selected === "send-my-brief" ? " and document have" : " has"} been stored privately for rOKIt to review. This confirms receipt, not a quote or an agreed deadline.</p>
    </div>;
  }

  const discoveryStep = selected === "build-my-brief" && step < discoverySteps.length ? discoverySteps[step] : null;
  const onDetailsStep = selected !== "build-my-brief" || step >= discoverySteps.length;

  const nextStep = () => {
    if (!discoveryStep) return;
    const value = answers[discoveryStep.key].trim();
    if (discoveryStep.required && value.length < discoveryStep.min) { setError(`Please add at least ${discoveryStep.min} characters so we can understand this properly.`); return; }
    setError("");
    track("Progressed", `start_project_discovery_step_${step + 1}_completed`);
    setStep(step + 1);
    requestAnimationFrame(() => stepHeading.current?.focus());
  };
  const previousStep = () => { setError(""); setStep(Math.max(0, step - 1)); requestAnimationFrame(() => stepHeading.current?.focus()); };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;
    if (discoveryStep) { nextStep(); return; }
    setError("");
    const form = new FormData(event.currentTarget);
    if (form.get("consent") !== "on") { setError("Please confirm that rOKIt may use these details to respond."); setStatus("error"); return; }

    let file: { name: string; type: AllowedType; base64: string } | undefined;
    if (selected === "send-my-brief") {
      const upload = form.get("document");
      if (!(upload instanceof File) || upload.size === 0) { setError("Please attach your brief, specification or ToR."); setStatus("error"); return; }
      if (upload.size > MAX_BYTES) { setError("Choose a PDF or Word document smaller than 10 MB."); setStatus("error"); return; }
      if (!allowedTypes.includes(upload.type as AllowedType)) { setError("Choose a PDF or Word document (.pdf, .doc or .docx)."); setStatus("error"); return; }
      setStatus("sending");
      const base64 = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(",")[1] ?? ""); reader.onerror = () => reject(reader.error); reader.readAsDataURL(upload); });
      file = { name: upload.name, type: upload.type as AllowedType, base64 };
    }

    setStatus("sending");
    try {
      await submitEnquiry({ data: {
        route: selected,
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        organisation: String(form.get("organisation") ?? ""),
        projectDetails: selected === "build-my-brief" ? undefined : String(form.get("projectDetails") ?? ""),
        discovery: selected === "build-my-brief" ? { problem: answers.problem, people: answers.people, change: answers.change, existing: answers.existing || undefined, timing: answers.timing || undefined } : undefined,
        consent: true,
        file,
      } });
      track("Submitted", `start_project_${selected}_submitted`);
      setStatus("sent");
    } catch (caught) {
      setError(friendlyError(caught));
      setStatus("error");
    }
  };

  return <div>
    {!selected && <h2 className="mb-7 font-display text-2xl">What are you trying to make happen?</h2>}
    <fieldset className="grid border-t border-paper/15 md:grid-cols-3">
      <legend className="sr-only">Choose how you want to start</legend>
      {choices.map((choice) => <Button key={choice.id} type="button" variant="ghost" onClick={() => { onSelect(choice.id); track("Route selected", `start_project_${choice.id}_selected`); }} aria-pressed={selected === choice.id} className="h-auto min-h-48 items-start justify-start rounded-none border-b border-paper/15 px-5 py-6 text-left text-paper hover:bg-surface hover:text-paper md:border-r aria-pressed:bg-surface aria-pressed:text-signal">
        <span className="flex h-full min-w-0 flex-col items-start whitespace-normal"><span className="text-xs font-normal text-signal">{choice.number}</span><span className="mt-8 font-display text-xl font-normal">{choice.title}</span><span className="mt-3 text-xs font-normal leading-relaxed text-neutral">{choice.copy}</span></span>
      </Button>)}
    </fieldset>

    {selected ? <form key={selected} onSubmit={handleSubmit} onFocus={markStarted} noValidate={Boolean(discoveryStep)} className="mt-10 grid gap-6 md:grid-cols-2" aria-label={selected === "send-my-brief" ? "Send your brief, specification or ToR" : selected === "build-my-brief" ? "rOKIt Discovery" : "Project enquiry"}>
      {selected === "build-my-brief" ? <div className="col-span-full flex items-baseline justify-between gap-4 border-b border-paper/15 pb-4">
        <h2 ref={stepHeading} tabIndex={-1} className="font-display text-2xl outline-none md:text-3xl">rOKIt Discovery</h2>
        <p className="text-xs uppercase text-neutral" aria-live="polite">{onDetailsStep ? "Your details" : `Question ${step + 1} of ${discoverySteps.length}`}</p>
      </div> : null}

      {discoveryStep ? <label className="form-field col-span-full">
        <span>{discoveryStep.label}</span>
        <textarea autoFocus={step > 0} value={answers[discoveryStep.key]} onChange={(e) => setAnswers({ ...answers, [discoveryStep.key]: e.target.value })} maxLength={discoveryStep.max} rows={discoveryStep.rows} aria-describedby="discovery-hint" aria-invalid={Boolean(error) || undefined} required={discoveryStep.required} />
        <small id="discovery-hint">{discoveryStep.hint}</small>
      </label> : null}

      {selected === "build-my-brief" && onDetailsStep ? <div className="col-span-full border-l-2 border-signal pl-5">
        <p className="text-xs uppercase text-neutral">What you’ve told us</p>
        <dl className="mt-4 grid gap-4 text-sm">
          {discoverySteps.filter((s) => answers[s.key].trim()).map((s) => <div key={s.key}><dt className="text-neutral">{s.label.replace(" (optional)", "")}</dt><dd className="mt-1 whitespace-pre-line break-words text-paper">{answers[s.key].trim()}</dd></div>)}
        </dl>
      </div> : null}

      {onDetailsStep ? <>
        {selected !== "build-my-brief" ? <label className="form-field col-span-full"><span>{selected === "send-my-brief" ? "Anything we should know alongside the document?" : "What are you trying to make happen?"}{selected === "send-my-brief" ? <small> (optional)</small> : null}</span><textarea name="projectDetails" value={details} onChange={event => setDetails(event.target.value)} required={selected !== "send-my-brief"} minLength={selected === "send-my-brief" ? undefined : 10} maxLength={5000} rows={selected === "send-my-brief" ? 3 : 6} aria-describedby="details-hint" /><small id="details-hint">{selected === "send-my-brief" ? "A line or two is enough — deadline, decision-maker, or what matters most. The document does the rest." : "Rough is fine. Include a budget range or timing if you have one. Minimum 10 characters."}</small></label> : null}
        <label className="form-field"><span>Name</span><input name="name" value={contact.name} onChange={event => setContact({ ...contact, name: event.target.value })} required minLength={2} maxLength={120} autoComplete="name" /></label>
        <label className="form-field"><span>Email</span><input name="email" value={contact.email} onChange={event => setContact({ ...contact, email: event.target.value })} required type="email" maxLength={254} autoComplete="email" /></label>
        <label className="form-field md:col-span-2"><span>Organisation <small>(optional)</small></span><input name="organisation" value={contact.organisation} onChange={event => setContact({ ...contact, organisation: event.target.value })} maxLength={160} autoComplete="organization" /></label>
        {selected === "send-my-brief" ? <label className="form-field md:col-span-2"><span>Brief, specification or ToR</span><span className="flex min-h-28 cursor-pointer items-center gap-3 border border-dashed border-paper/30 px-5 text-sm text-neutral focus-within:border-signal focus-within:outline focus-within:outline-2 focus-within:outline-signal hover:border-signal"><FileUp aria-hidden="true" /> <span className="min-w-0 break-words">{fileName || "Choose a PDF or Word file, up to 10 MB"}</span><input className="sr-only" name="document" type="file" required aria-describedby="upload-hint" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" /></span><small id="upload-hint">Stored privately. Only rOKIt can open it — it is never published or added to any public library.</small></label> : null}
        <label className="col-span-full flex min-h-11 items-start gap-3 text-sm text-neutral"><input name="consent" checked={contact.consent} onChange={event => setContact({ ...contact, consent: event.target.checked })} type="checkbox" required className="mt-1 size-4 accent-signal" /><span>I agree that rOKIt may use these details to review and respond to this enquiry.</span></label>
      </> : null}

      {error ? <p className="col-span-full border-l-2 border-signal pl-4 text-sm text-paper" role="alert">{error}</p> : null}

      <div className="col-span-full flex flex-wrap items-center gap-4">
        {selected === "build-my-brief" && step > 0 ? <Button type="button" variant="ghost" onClick={previousStep} className="min-h-12 rounded-none px-5 text-paper hover:bg-surface hover:text-paper"><ArrowLeft aria-hidden="true" /> Back</Button> : null}
        <Button type="submit" disabled={status === "sending"} className="min-h-12 rounded-none bg-signal px-7 text-night hover:bg-paper">
          {discoveryStep ? "Next" : status === "sending" ? "Sending…" : selected === "send-my-brief" ? "Send document" : "Send enquiry"}<ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </form> : null}
  </div>;
}
