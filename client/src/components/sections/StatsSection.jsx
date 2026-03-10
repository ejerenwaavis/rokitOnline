import { useEffect, useState, useRef } from 'react';
import { Trophy, Users, Smile, Clock } from 'lucide-react';

const stats = [
  { icon: Trophy, label: 'Projects Completed', value: 500, suffix: '+' },
  { icon: Users, label: 'Happy Clients', value: 350, suffix: '+' },
  { icon: Smile, label: 'Years Experience', value: 10, suffix: '+' },
  { icon: Clock, label: 'On-Time Delivery', value: 98, suffix: '%' },
];

function Counter({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const duration = 2000;
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(start);
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="text-5xl font-black text-rokit-orange">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-rokit-dark py-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => {
          const StatIcon = stat.icon;
          return (
            <div key={stat.label} className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 flex items-center justify-center border-2 border-rokit-orange/30 text-rokit-orange">
                  <StatIcon size={28} />
                </div>
              </div>
              <Counter target={stat.value} suffix={stat.suffix} />
              <p className="text-gray-400 text-sm mt-2 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
