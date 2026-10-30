import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, FileUp } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const choices = [
  {
    id: 'know-what-i-need',
    number: '01',
    title: 'I know what I need.',
    copy: 'Tell us what needs to happen and what you already know.',
  },
  {
    id: 'build-my-brief',
    number: '02',
    title: "I'm still working it out.",
    copy: 'Answer a few plain questions with rOKIt Discovery.',
  },
  {
    id: 'send-my-brief',
    number: '03',
    title: 'I already have a brief / specification / ToR.',
    copy: 'Upload it privately. No need to retype what is already written.',
  },
];

const discoverySteps = [
  {
    key: 'problem',
    label: 'What are you trying to make happen?',
    hint: 'Describe the situation in your own words. Rough is fine.',
    min: 10,
    rows: 4,
  },
  {
    key: 'people',
    label: 'Who is it for, or who is affected?',
    hint: 'Customers, staff, members, funders — whoever needs this to work.',
    min: 3,
    rows: 3,
  },
  {
    key: 'change',
    label: 'What should be different when it works?',
    hint: 'What would people notice, do or understand afterwards?',
    min: 10,
    rows: 3,
  },
  {
    key: 'existing',
    label: 'What already exists? (optional)',
    hint: 'A name, a logo, a website, a document, an earlier attempt.',
    min: 0,
    rows: 3,
  },
  {
    key: 'timing',
    label: 'Is there a date or moment this is working towards? (optional)',
    hint: 'A launch, an event, a funding round — or no fixed date yet.',
    min: 0,
    rows: 2,
  },
];

export default function NewQuote() {
  const [searchParams] = useSearchParams();
  const [selectedRoute, setSelectedRoute] = useState(
    searchParams.get('route') || 'know-what-i-need'
  );
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    problem: '',
    people: '',
    change: '',
    existing: '',
    timing: '',
  });
  const [details, setDetails] = useState('');
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    organisation: '',
    consent: false,
  });
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const stepHeadingRef = useRef(null);

  const discoveryStep =
    selectedRoute === 'build-my-brief' && step < discoverySteps.length
      ? discoverySteps[step]
      : null;
  const onDetailsStep =
    selectedRoute !== 'build-my-brief' || step >= discoverySteps.length;

  const nextStep = () => {
    if (!discoveryStep) return;
    const value = answers[discoveryStep.key].trim();
    if (discoveryStep.min > 0 && value.length < discoveryStep.min) {
      setError(`Please add at least ${discoveryStep.min} characters so we can understand properly.`);
      return;
    }
    setError('');
    setStep(step + 1);
    requestAnimationFrame(() => stepHeadingRef.current?.focus());
  };

  const prevStep = () => {
    setError('');
    setStep(Math.max(0, step - 1));
    requestAnimationFrame(() => stepHeadingRef.current?.focus());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (discoveryStep) {
      nextStep();
      return;
    }

    if (!contact.name || !contact.email) {
      setError('Please provide your name and email address.');
      return;
    }

    if (!contact.consent) {
      setError('Please confirm that rOKIt may use these details to respond.');
      return;
    }

    if (selectedRoute === 'send-my-brief' && !file) {
      setError('Please attach your brief, specification, or ToR document.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      data.append('name', contact.name);
      data.append('email', contact.email);
      data.append('phone', contact.phone || contact.organisation || 'N/A');

      // Map serviceType
      let serviceType = 'Custom Brief';
      if (selectedRoute === 'build-my-brief') serviceType = 'Discovery Session';
      if (selectedRoute === 'send-my-brief') serviceType = 'Specification / ToR';
      data.append('serviceType', serviceType);

      // Build unified project description
      let description = '';
      if (selectedRoute === 'build-my-brief') {
        description = [
          `[rOKIt Discovery Submission]`,
          `Problem: ${answers.problem}`,
          `Target People: ${answers.people}`,
          `Desired Change: ${answers.change}`,
          answers.existing ? `Existing Assets: ${answers.existing}` : '',
          answers.timing ? `Timing / Deadline: ${answers.timing}` : '',
          contact.organisation ? `Organisation: ${contact.organisation}` : '',
        ]
          .filter(Boolean)
          .join('\n\n');
      } else if (selectedRoute === 'send-my-brief') {
        description = [
          `[Direct Brief Document Submission]`,
          details ? `Notes: ${details}` : 'Document attached.',
          contact.organisation ? `Organisation: ${contact.organisation}` : '',
        ]
          .filter(Boolean)
          .join('\n\n');
      } else {
        description = [
          details,
          contact.organisation ? `Organisation: ${contact.organisation}` : '',
        ]
          .filter(Boolean)
          .join('\n\n');
      }

      data.append('projectDescription', description);

      if (file) {
        data.append('files', file);
      }

      await api.post('/quotes', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSent(true);
      toast.success('Your enquiry has been received.');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Could not submit enquiry. Please check details and try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Start a Project — rOKIt</title>
        <meta
          name="description"
          content="Start with what you have. Tell rOKIt what you are trying to make happen, explore with rOKIt Discovery, or send your brief privately."
        />
        <meta property="og:title" content="Start With What You Have. — rOKIt" />
        <meta
          property="og:description"
          content="Three ways to start a project with rOKIt."
        />
      </Helmet>

      <div className="font-v4-body text-paper">
        {/* Header */}
        <section className="mx-auto max-w-site px-gutter pt-16 pb-12 border-b border-paper/15">
          <p className="v4-section-label">Start a Project</p>
          <h1 className="mt-4 font-v4-display text-4xl md:text-6xl">Start With What You Have.</h1>
          <p className="mt-4 max-w-[50ch] text-base leading-relaxed text-paper/70">
            We’ll help work out what it needs next.
          </p>
        </section>

        <section className="mx-auto max-w-site px-gutter py-section">
          {sent ? (
            <div className="border-l-2 border-signal pl-6 py-6" role="status">
              <Check className="size-8 text-signal mb-4" aria-hidden="true" />
              <h2 className="font-v4-display text-3xl text-paper">WE’VE GOT IT.</h2>
              <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-paper/75">
                Your enquiry{selectedRoute === 'send-my-brief' ? ' and document have' : ' has'} been received and stored securely for rOKIt to review. This confirms receipt, not a quote or an agreed deadline. We’ll review and be in touch promptly.
              </p>
              <div className="mt-8 flex gap-6">
                <Link
                  to="/"
                  className="v4-action-link min-h-12 border border-signal px-6 text-xs uppercase font-mono tracking-wider text-signal hover:bg-signal hover:text-night transition-colors"
                >
                  Return to Home
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setStep(0);
                    setDetails('');
                    setFile(null);
                    setFileName('');
                  }}
                  className="v4-action-link min-h-12 text-paper hover:text-signal text-xs uppercase font-mono tracking-wider"
                >
                  Submit Another Enquiry
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="mb-8 font-v4-display text-2xl text-paper">
                What are you trying to make happen?
              </h2>

              {/* Three route choices */}
              <fieldset className="grid border-t border-paper/15 md:grid-cols-3">
                <legend className="sr-only">Choose how you want to start</legend>
                {choices.map((choice) => (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => {
                      setSelectedRoute(choice.id);
                      setStep(0);
                      setError('');
                    }}
                    aria-pressed={selectedRoute === choice.id}
                    className={`h-auto min-h-48 flex flex-col items-start justify-start rounded-none border-b border-paper/15 p-6 text-left transition-colors md:border-r ${
                      selectedRoute === choice.id
                        ? 'bg-surface text-signal'
                        : 'text-paper hover:bg-surface/50'
                    }`}
                  >
                    <span className="text-xs font-mono uppercase tracking-wider text-signal">
                      {choice.number}
                    </span>
                    <span className="mt-6 font-v4-display text-xl text-paper">{choice.title}</span>
                    <span className="mt-3 text-sm leading-relaxed text-paper/70 font-normal">
                      {choice.copy}
                    </span>
                  </button>
                ))}
              </fieldset>

              {/* Active Route Form */}
              <form onSubmit={handleSubmit} className="mt-12 grid gap-6 md:grid-cols-2">
                {selectedRoute === 'build-my-brief' && (
                  <div className="col-span-full flex items-baseline justify-between gap-4 border-b border-paper/15 pb-4">
                    <h3 ref={stepHeadingRef} className="font-v4-display text-xl text-paper">
                      rOKIt Discovery
                    </h3>
                    <p className="text-xs uppercase font-mono tracking-wider text-signal" aria-live="polite">
                      {onDetailsStep ? 'Your details' : `Question ${step + 1} of ${discoverySteps.length}`}
                    </p>
                  </div>
                )}

                {discoveryStep && (
                  <label className="col-span-full space-y-2">
                    <span className="font-v4-display text-xl text-paper block">
                      {discoveryStep.label}
                    </span>
                    <textarea
                      value={answers[discoveryStep.key]}
                      onChange={(e) =>
                        setAnswers({ ...answers, [discoveryStep.key]: e.target.value })
                      }
                      rows={discoveryStep.rows}
                      className="w-full border border-paper/25 bg-transparent p-3 text-paper focus:outline-none focus:border-signal leading-relaxed"
                    />
                    <small className="text-xs text-neutral block font-mono">{discoveryStep.hint}</small>
                  </label>
                )}

                {selectedRoute === 'build-my-brief' && onDetailsStep && (
                  <div className="col-span-full border-l-2 border-signal pl-5 py-3 bg-surface/50">
                    <p className="text-xs uppercase font-mono tracking-wider text-signal">What you’ve shared</p>
                    <dl className="mt-4 grid gap-3 text-sm">
                      {discoverySteps
                        .filter((s) => answers[s.key].trim())
                        .map((s) => (
                          <div key={s.key}>
                            <dt className="text-neutral font-mono text-xs">{s.label.replace(' (optional)', '')}</dt>
                            <dd className="mt-1 text-paper whitespace-pre-line">{answers[s.key].trim()}</dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                )}

                {onDetailsStep && (
                  <>
                    {selectedRoute !== 'build-my-brief' && (
                      <label className="col-span-full space-y-2">
                        <span className="font-v4-display text-xl text-paper block">
                          {selectedRoute === 'send-my-brief'
                            ? 'Anything we should know alongside the document?'
                            : 'What are you trying to make happen?'}
                          {selectedRoute === 'send-my-brief' && (
                            <small className="text-neutral text-xs font-mono font-normal"> (optional)</small>
                          )}
                        </span>
                        <textarea
                          value={details}
                          onChange={(e) => setDetails(e.target.value)}
                          rows={selectedRoute === 'send-my-brief' ? 3 : 6}
                          required={selectedRoute !== 'send-my-brief'}
                          placeholder={
                            selectedRoute === 'send-my-brief'
                              ? 'A line or two is enough — deadline, key decision-maker, or main goal.'
                              : 'Describe the situation in your own words. Rough is fine.'
                          }
                          className="w-full border border-paper/25 bg-transparent p-3 text-paper focus:outline-none focus:border-signal leading-relaxed"
                        />
                      </label>
                    )}

                    <label className="space-y-2">
                      <span className="text-xs uppercase font-mono tracking-wider text-neutral block">
                        Full Name *
                      </span>
                      <input
                        value={contact.name}
                        onChange={(e) => setContact({ ...contact, name: e.target.value })}
                        required
                        className="w-full min-h-[3rem] border border-paper/25 bg-transparent p-3 text-paper focus:outline-none focus:border-signal"
                        placeholder="Your name"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-xs uppercase font-mono tracking-wider text-neutral block">
                        Email Address *
                      </span>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => setContact({ ...contact, email: e.target.value })}
                        required
                        className="w-full min-h-[3rem] border border-paper/25 bg-transparent p-3 text-paper focus:outline-none focus:border-signal"
                        placeholder="you@domain.com"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-xs uppercase font-mono tracking-wider text-neutral block">
                        Phone <small className="text-neutral/60">(optional)</small>
                      </span>
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                        className="w-full min-h-[3rem] border border-paper/25 bg-transparent p-3 text-paper focus:outline-none focus:border-signal"
                        placeholder="+234..."
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-xs uppercase font-mono tracking-wider text-neutral block">
                        Organisation <small className="text-neutral/60">(optional)</small>
                      </span>
                      <input
                        value={contact.organisation}
                        onChange={(e) => setContact({ ...contact, organisation: e.target.value })}
                        className="w-full min-h-[3rem] border border-paper/25 bg-transparent p-3 text-paper focus:outline-none focus:border-signal"
                        placeholder="Company, organisation, or group"
                      />
                    </label>

                    {selectedRoute === 'send-my-brief' && (
                      <div className="col-span-full space-y-2">
                        <span className="text-xs uppercase font-mono tracking-wider text-neutral block">
                          Brief, Specification, or ToR Document *
                        </span>
                        <label className="flex min-h-28 cursor-pointer items-center justify-center gap-3 border border-dashed border-paper/30 p-5 text-sm text-neutral hover:border-signal transition-colors bg-surface/30">
                          <FileUp className="size-6 text-signal" aria-hidden="true" />
                          <span className="font-mono text-xs">
                            {fileName || 'Choose a PDF or Word file (.pdf, .doc, .docx up to 10 MB)'}
                          </span>
                          <input
                            type="file"
                            className="sr-only"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                setFile(f);
                                setFileName(f.name);
                              }
                            }}
                          />
                        </label>
                        <small className="text-xs text-neutral font-mono block">
                          Stored securely on encrypted servers. Only rOKIt can view it.
                        </small>
                      </div>
                    )}

                    <label className="col-span-full flex items-start gap-3 text-sm text-neutral pt-2">
                      <input
                        type="checkbox"
                        checked={contact.consent}
                        onChange={(e) => setContact({ ...contact, consent: e.target.checked })}
                        required
                        className="mt-1 size-4 accent-signal"
                      />
                      <span>I agree that rOKIt may use these details to review and respond to this enquiry.</span>
                    </label>
                  </>
                )}

                {error && (
                  <p className="col-span-full border-l-2 border-signal pl-4 text-sm text-signal font-mono">
                    {error}
                  </p>
                )}

                <div className="col-span-full flex items-center gap-4 pt-4">
                  {selectedRoute === 'build-my-brief' && step > 0 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="v4-action-link min-h-12 border border-paper/30 px-6 text-xs uppercase font-mono tracking-wider text-paper hover:border-signal hover:text-signal transition-colors"
                    >
                      <ArrowLeft className="size-4 mr-2" aria-hidden="true" /> Back
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="v4-action-link min-h-12 border border-signal bg-signal px-8 text-xs uppercase font-mono tracking-wider text-night font-semibold hover:bg-paper transition-colors disabled:opacity-50"
                  >
                    {discoveryStep
                      ? 'Next'
                      : submitting
                      ? 'Sending…'
                      : selectedRoute === 'send-my-brief'
                      ? 'Send Document'
                      : 'Send Enquiry'}
                    <ArrowRight className="size-4 ml-2" aria-hidden="true" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
