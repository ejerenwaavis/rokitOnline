import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] } }),
};

export default function CTABand() {
  return (
    <section
      className="relative py-24 bg-fixed bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/images/strip-1.jpg')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-rokit-dark/80" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.p className="text-rokit-orange text-xs font-medium uppercase tracking-[0.15em] mb-4"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUp} custom={0}
        >
          Ready to Get Started?
        </motion.p>
        <motion.h2 className="font-display text-5xl md:text-6xl font-light text-white leading-tight mb-6"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUp} custom={1}
        >
          Our Jobs Are Constantly<br />
          <span className="text-rokit-orange">Under Construction</span>
        </motion.h2>
        <motion.p className="text-gray-300 text-base max-w-xl mx-auto mb-10"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUp} custom={2}
        >
          From large format banners to complete brand identities — we bring your ideas to life,
          fast and flawlessly. Let's build something great together.
        </motion.p>
        <motion.div className="flex flex-wrap justify-center gap-4"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUp} custom={3}
        >
          <Link to="/contact" className="btn-primary">Talk to Us</Link>
          <Link to="/portal/quote" className="btn-white">Request a Quote</Link>
        </motion.div>
      </div>
    </section>
  );
}
