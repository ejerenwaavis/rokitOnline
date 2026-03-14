import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Youtube, Instagram, Twitter, MapPin, Phone, Mail, Clock } from 'lucide-react';

const services = [
  { label: 'Large Format Prints', to: '/services/large-format' },
  { label: 'Graphic Design', to: '/services/graphic-design' },
  { label: 'Branding', to: '/services/branding' },
  { label: 'Web Design', to: '/services/web-design' },
  { label: 'Roll-Up Banners', to: '/services/roll-up-banners' },
];

const quickLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Our Gallery', to: '/gallery' },
  { label: 'Tutorials', to: '/tutorials' },
  { label: 'Contact', to: '/contact' },
  { label: 'Get a Quote', to: '/portal/quotes/new' },
  { label: 'Place an Order', to: '/portal/orders/new' },
];

export default function Footer() {
  return (
    <footer>
      {/* Main footer */}
      <div className="bg-gray-50 border-t border-gray-100">
        {/* Top accent */}
        <div className="flex h-1">
          <div className="flex-1 bg-rokit-orange" />
          <div className="flex-1 bg-rokit-gold" />
          <div className="flex-1 bg-rokit-green" />
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-rokit-orange" />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/">
              <img src="/assets/images/rokit-logo.png" alt="Rokit Media" className="h-10 mb-4"
                onError={(e) => { e.target.style.display='none'; }}
              />
            </Link>
            <p className="text-sm leading-relaxed text-rokit-body mb-6">
              Nigeria's leading print, branding, and design company based in Osogbo, Lagos & Port Harcourt. Quality, creativity, and integrity since 2016.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: 'http://facebook.com/Rokitonline' },
                { icon: Instagram, href: 'http://instagram.com/rokitonline' },
                { icon: Twitter, href: 'http://twitter.com/rokitonline' },
                { icon: Linkedin, href: 'http://linkedin.com/rokitonline' },
                { icon: Youtube, href: 'http://youtube.com/rokitonline' },
              ].map((item) => {
                const SocialIcon = item.icon;
                return (
                  <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center border border-gray-200 text-rokit-body rounded-full hover:border-rokit-orange hover:text-rokit-orange hover:bg-rokit-orange/10 transition-all duration-300"
                  >
                    <SocialIcon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-rokit-dark font-semibold text-sm uppercase tracking-widest mb-5 border-b border-gray-200 pb-2">
              Our Services
            </h4>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.to}>
                  <Link to={s.to} className="text-sm text-rokit-body hover:text-rokit-orange transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-rokit-orange/60 rounded-full" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-rokit-dark font-semibold text-sm uppercase tracking-widest mb-5 border-b border-gray-200 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-rokit-body hover:text-rokit-orange transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-rokit-orange/60 rounded-full" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-rokit-dark font-semibold text-sm uppercase tracking-widest mb-5 border-b border-gray-200 pb-2">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-rokit-body">
                <MapPin size={16} className="text-rokit-orange mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <div>
                    <span className="text-xs font-semibold text-rokit-dark block">Abuja</span>
                    6 Jama Are Close, Garki 2, Abuja, Nigeria
                  </div>
                  <div className="pt-1">
                    <span className="text-xs font-semibold text-rokit-dark block">United Kingdom</span>
                    25 James Street, Bradford, West Yorkshire, UK
                  </div>
                </div>
              </li>
              <li className="flex gap-3 text-sm text-rokit-body">
                <Phone size={16} className="text-rokit-orange mt-0.5 shrink-0" />
                <a href="tel:+2347031616075" className="hover:text-rokit-orange">+234 703 161 6075</a>
              </li>
              <li className="flex gap-3 text-sm text-rokit-body">
                <Mail size={16} className="text-rokit-orange mt-0.5 shrink-0" />
                <a href="mailto:rokitnow@gmail.com" className="hover:text-rokit-orange">rokitnow@gmail.com</a>
              </li>
              <li className="flex gap-3 text-sm text-rokit-body">
                <Clock size={16} className="text-rokit-orange mt-0.5 shrink-0" />
                <div>
                  <div>Mon–Fri: 09:00 – 21:00</div>
                  <div>Saturday: 12:00 – 22:00</div>
                  <div>Sunday: Closed</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-white border-t border-gray-100 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-rokit-body/70">
          <p>© {new Date().getFullYear()} Rokit Media. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-rokit-orange transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-rokit-orange transition-colors">Terms & Conditions</Link>
            <Link to="/cookies" className="hover:text-rokit-orange transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
