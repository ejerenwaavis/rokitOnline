import { Zap, Star, HeartHandshake, Award, Clock, Shield } from 'lucide-react';

const reasons = [
  { icon: Zap, title: 'Speed & Efficiency', body: 'We meet deadlines without compromising quality — every time.' },
  { icon: Star, title: 'Premium Quality', body: 'Every product we deliver exceeds industry standards and client expectations.' },
  { icon: HeartHandshake, title: 'Customer First', body: 'We work closely with you from concept to completion, every step of the way.' },
  { icon: Award, title: '10+ Years Experience', body: 'Decades of expertise in design, branding, and large-format printing.' },
  { icon: Clock, title: 'On-Time Delivery', body: 'Nationwide logistics and delivery you can count on.' },
  { icon: Shield, title: 'Trusted by Brands', body: 'Hundreds of businesses across Nigeria rely on Rokit Media for their visual needs.' },
];

export default function WhyUsSection() {
  return (
    <section className="bg-rokit-tan py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-rokit-orange font-semibold uppercase tracking-widest text-sm mb-2">Why Choose Us</p>
          <h2 className="section-title">The Rokit Difference</h2>
          <div className="section-divider" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((item) => {
            const ItemIcon = item.icon;
            return (
              <div key={item.title} className="flex gap-5">
                <div className="shrink-0 w-12 h-12 bg-rokit-orange flex items-center justify-center text-white mt-1">
                  <ItemIcon size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-rokit-dark text-lg mb-1">{item.title}</h4>
                  <p className="text-rokit-body text-sm leading-relaxed">{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
