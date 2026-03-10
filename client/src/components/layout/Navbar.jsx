import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  {
    label: 'Services', to: '/services',
    children: [
      { label: 'Large Format Prints', to: '/services/large-format' },
      { label: 'Graphic Design', to: '/services/graphic-design' },
      { label: 'Branding', to: '/services/branding' },
      { label: 'Web Design', to: '/services/web-design' },
      { label: 'Idea Creation', to: '/services/idea-creation' },
      { label: 'Roll-Up Banners', to: '/services/roll-up-banners' },
    ]
  },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Tutorials', to: '/tutorials' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-rokit-dark shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/assets/images/rokit-logo-white.png"
            alt="Rokit Media"
            className="h-10 w-auto"
            onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
          />
          <span className="hidden text-2xl font-black text-white tracking-widest">
            r<span className="text-rokit-orange">OK</span>It
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label} className="relative group">
                <button
                  className="flex items-center gap-1 px-3 py-2 text-white text-sm font-medium hover:text-rokit-orange transition-colors"
                  onMouseEnter={() => setDropdown(link.label)}
                  onMouseLeave={() => setDropdown(null)}
                >
                  {link.label} <ChevronDown size={14} />
                </button>
                <div
                  className={`absolute top-full left-0 bg-rokit-dark min-w-48 shadow-xl border-t-2 border-rokit-orange transition-all duration-200 ${
                    dropdown === link.label ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}
                  onMouseEnter={() => setDropdown(link.label)}
                  onMouseLeave={() => setDropdown(null)}
                >
                  {link.children.map((child) => (
                    <Link
                      key={child.to}
                      to={child.to}
                      className="block px-4 py-2.5 text-sm text-gray-300 hover:text-rokit-orange hover:bg-rokit-mid-dark transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-rokit-orange' : 'text-white hover:text-rokit-orange'
                  }`
                }
              >
                {link.label}
              </NavLink>
            )
          )}
        </nav>

        {/* CTA buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 text-white text-sm hover:text-rokit-orange transition-colors">
                <User size={16} /> {user.name.split(' ')[0]}
                <ChevronDown size={14} />
              </button>
              <div className="absolute right-0 top-full bg-rokit-dark min-w-44 shadow-xl border-t-2 border-rokit-orange opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link to="/portal" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-rokit-orange">
                  <LayoutDashboard size={14} /> My Dashboard
                </Link>
                {isAdmin() && (
                  <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-rokit-orange">
                    <ShieldCheck size={14} /> Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-300 hover:text-red-400">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/auth/login" className="text-sm text-white hover:text-rokit-orange transition-colors">Login</Link>
          )}
          <Link to="/portal/quotes/new" className="btn-primary text-sm px-4 py-2">
            Get a Quote
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden bg-rokit-dark border-t border-rokit-mid-dark transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-screen pb-4' : 'max-h-0'}`}>
        <nav className="px-4 pt-4 space-y-1">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <div className="px-3 py-2 text-white font-medium text-sm">{link.label}</div>
                {link.children.map((child) => (
                  <Link
                    key={child.to}
                    to={child.to}
                    onClick={() => setMenuOpen(false)}
                    className="block px-6 py-2 text-sm text-gray-400 hover:text-rokit-orange"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 text-sm font-medium ${isActive ? 'text-rokit-orange' : 'text-white hover:text-rokit-orange'}`
                }
              >
                {link.label}
              </NavLink>
            )
          )}
          <div className="pt-4 border-t border-rokit-mid-dark space-y-2">
            {user ? (
              <>
                <Link to="/portal" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-300 hover:text-rokit-orange px-3 py-2">My Dashboard</Link>
                {isAdmin() && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-300 hover:text-rokit-orange px-3 py-2">Admin Panel</Link>}
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block text-sm text-red-400 px-3 py-2">Logout</button>
              </>
            ) : (
              <Link to="/auth/login" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-300 hover:text-rokit-orange px-3 py-2">Login</Link>
            )}
            <Link to="/portal/quotes/new" onClick={() => setMenuOpen(false)} className="btn-primary w-full text-center text-sm">
              Get a Quote
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
