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
      <div className="bg-rokit-dark text-gray-300">
        {/* Colour strip */}
        <div className="flex h-2">
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
              <img src="/assets/images/rokit-logo-white.png" alt="Rokit Media" className="h-12 mb-4"
                onError={(e) => { e.target.style.display='none'; }}
              />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
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
                    className="w-9 h-9 flex items-center justify-center border border-gray-600 text-rokit-gold hover:border-rokit-orange hover:text-rokit-orange hover:bg-rokit-orange/10 transition-all duration-300"
                  >
                    <SocialIcon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5 border-b border-rokit-orange pb-2">
              Our Services
            </h4>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.to}>
                  <Link to={s.to} className="text-sm text-gray-400 hover:text-rokit-orange transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-rokit-orange rounded-full" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5 border-b border-rokit-orange pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-400 hover:text-rokit-orange transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-rokit-orange rounded-full" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5 border-b border-rokit-orange pb-2">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-gray-400">
                <MapPin size={16} className="text-rokit-orange mt-0.5 shrink-0" />
                <span>4 Gbogan-Ibadan Road, beside Sterling Bank, Ogo-Oluwa, Osogbo, Osun State</span>
              </li>
              <li className="flex gap-3 text-sm text-gray-400">
                <Phone size={16} className="text-rokit-orange mt-0.5 shrink-0" />
                <div>
                  <a href="tel:+2347069035095" className="hover:text-rokit-orange block">0706 903 5095</a>
                  <a href="tel:+2349095503422" className="hover:text-rokit-orange block">0909 550 3422</a>
                </div>
              </li>
              <li className="flex gap-3 text-sm text-gray-400">
                <Mail size={16} className="text-rokit-orange mt-0.5 shrink-0" />
                <a href="mailto:rokitnow@gmail.com" className="hover:text-rokit-orange">rokitnow@gmail.com</a>
              </li>
              <li className="flex gap-3 text-sm text-gray-400">
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
      <div className="bg-[#111] py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
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
