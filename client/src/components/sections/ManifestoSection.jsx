import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] } }),
};

const tags = [
  'Large Format',
  'Graphic Design',
  'Branding',
  'Web Design',
  'Roll-Up Banners',
  'Idea Creation',
];

export default function ManifestoSection() {
  return (
    <section className="bg-rokit-cream-dark py-24 border-t border-rokit-orange/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-16 items-start">

          {/* Left: opening quote */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0}
          >
            <span
              aria-hidden
              className="font-display text-[7rem] leading-none text-rokit-orange/15 select-none block -mb-6"
            >"</span>
            <blockquote className="font-display text-3xl md:text-4xl font-light text-rokit-dark leading-snug">
              We don&apos;t just print.{' '}
              <span className="text-rokit-orange italic">We make your brand</span>{' '}
              impossible to ignore.
            </blockquote>
          </motion.div>

          {/* Right: body + tags */}
          <motion.div className="space-y-5 pt-4"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={1}
          >
            <p className="text-rokit-body leading-relaxed font-light">
              From Abuja to Bradford, we&apos;ve delivered large-scale visibility for brands
              that refuse to blend in. Our work spans government ministries, NGOs,
              corporations, and startups — all with the same obsession for craft and detail.
            </p>
            <p className="text-rokit-body leading-relaxed font-light">
              We combine premium print production with sharp brand thinking. The result is
              work that doesn&apos;t just look good — it earns trust, communicates authority,
              and endures.
            </p>
            <div className="flex flex-wrap gap-2 pt-4">
              {tags.map((tag, i) => (
                <motion.span
                  key={tag}
                  className="font-mono text-[10px] uppercase tracking-[0.15em] text-rokit-dark border border-rokit-orange/20 px-3 py-1.5 hover:border-rokit-orange hover:text-rokit-orange transition-colors duration-200 cursor-default"
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.6}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
