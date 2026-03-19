import { Trophy, Users, Smile, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] } }),
};

const stats = [
  { icon: Trophy, label: 'Projects Completed', value: 500, suffix: '+' },
  { icon: Users, label: 'Happy Clients', value: 350, suffix: '+' },
  { icon: Smile, label: 'Years Experience', value: 10, suffix: '+' },
  { icon: Clock, label: 'On-Time Delivery', value: 98, suffix: '%' },
];

export default function StatsSection() {
  return (
    <section className="bg-rokit-cream-dark py-20 border-y border-rokit-orange/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => {
          const StatIcon = stat.icon;
          return (
            <motion.div key={stat.label} className="text-center"
              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={i * 0.8}
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 flex items-center justify-center bg-rokit-orange/10 text-rokit-orange">
                  <StatIcon size={22} />
                </div>
              </div>
              <span className="font-display text-5xl md:text-6xl font-light text-rokit-orange">
                <CountUp end={stat.value} suffix={stat.suffix} enableScrollSpy scrollSpyOnce duration={2} />
              </span>
              <p className="text-rokit-body text-sm mt-2">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
