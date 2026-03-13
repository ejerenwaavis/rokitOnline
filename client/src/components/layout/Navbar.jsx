import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  // These pages have a light background at the top (no full-width dark hero),
  // so use dark nav links when the navbar is transparent.
  const lightTopPages = ['/auth/', '/portal'];
  const isLightTop = lightTopPages.some(p => location.pathname.startsWith(p));
  const isDark = scrolled;

  // Link colour tokens
  const linkBase = isDark
    ? 'text-gray-600 hover:text-rokit-dark'
    : !isLightTop
      ? 'text-white/80 hover:text-white'
      : 'text-rokit-dark/80 hover:text-rokit-dark';
  const linkActive = 'text-rokit-orange';
  const loginColor = isDark
    ? 'text-gray-500 hover:text-rokit-dark'
    : !isLightTop
      ? 'text-white/70 hover:text-white'
      : 'text-rokit-dark/70 hover:text-rokit-dark';
  const iconColor = isDark
    ? 'text-gray-600 hover:text-rokit-dark'
    : !isLightTop
      ? 'text-white/80 hover:text-white'
      : 'text-rokit-dark/80 hover:text-rokit-dark';
  const hamburgerColor = isDark
    ? 'text-gray-600 hover:text-rokit-dark'
    : !isLightTop
      ? 'text-white/80 hover:text-white'
      : 'text-rokit-dark/80 hover:text-rokit-dark';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isDark
          ? 'bg-white/95 backdrop-blur-sm shadow-sm border-gray-100 py-3'
          : 'bg-transparent border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo — white on dark-hero pages, coloured on light-top pages */}
        <Link to="/" className="flex items-center">
          <img
            src={(!isDark && !isLightTop) ? '/assets/images/rokit-logo-white.png' : '/assets/images/rokit-logo.png'}
            alt="Rokit Media"
            className="h-6 w-auto transition-all duration-300"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label} className="relative group">
                <button
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors tracking-wide ${linkBase}`}
                  onMouseEnter={() => setDropdown(link.label)}
                  onMouseLeave={() => setDropdown(null)}
                >
                  {link.label} <ChevronDown size={12} className="opacity-60" />
                </button>
                <div
                  className={`absolute top-full left-0 bg-rokit-dark/95 backdrop-blur-md min-w-48 shadow-2xl rounded-lg overflow-hidden ring-1 ring-white/10 transition-all duration-200 ${
                    dropdown === link.label ? 'opacity-100 visible translate-y-1' : 'opacity-0 invisible translate-y-0'
                  }`}
                  onMouseEnter={() => setDropdown(link.label)}
                  onMouseLeave={() => setDropdown(null)}
                >
                  {link.children.map((child) => (
                    <Link
                      key={child.to}
                      to={child.to}
                      className="block px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
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
                  `px-3 py-2 text-sm font-medium tracking-wide transition-colors ${isActive ? linkActive : linkBase}`
                }
              >
                {link.label}
              </NavLink>
            )
          )}
        </nav>

        {/* CTA buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="relative group">
              <button className={`flex items-center gap-2 text-sm transition-colors ${iconColor}`}>
                <User size={15} /> {user.name?.split(' ')[0] ?? 'Account'}
                <ChevronDown size={12} className="opacity-60" />
              </button>
              <div className="absolute right-0 top-full bg-rokit-dark/95 backdrop-blur-md min-w-44 shadow-2xl rounded-lg overflow-hidden ring-1 ring-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 mt-1">
                <Link to="/portal" className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                  <LayoutDashboard size={14} /> My Dashboard
                </Link>
                {isAdmin() && (
                  <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                    <ShieldCheck size={14} /> Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-white/60 hover:text-red-400 hover:bg-white/5 transition-colors">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/auth/login" className={`text-sm transition-colors tracking-wide ${loginColor}`}>Login</Link>
          )}
          <Link to="/portal/quotes/new" className="text-sm px-4 py-2 bg-rokit-orange hover:bg-rokit-orange/90 text-white rounded-lg font-medium tracking-wide transition-colors">
            Get a Quote
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`lg:hidden p-2 transition-colors ${hamburgerColor}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden bg-rokit-dark/95 backdrop-blur-md transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-screen pb-4' : 'max-h-0'}`}>
        <nav className="px-4 pt-4 space-y-0.5">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <div className="px-3 py-2 text-white/40 font-medium text-xs uppercase tracking-widest">{link.label}</div>
                {link.children.map((child) => (
                  <Link
                    key={child.to}
                    to={child.to}
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-2 text-sm text-white/60 hover:text-white transition-colors"
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
                  `block px-3 py-2 text-sm font-medium tracking-wide ${isActive ? 'text-rokit-orange' : 'text-white/80 hover:text-white'}`
                }
              >
                {link.label}
              </NavLink>
            )
          )}
          <div className="pt-4 space-y-2">
            {user ? (
              <>
                <Link to="/portal" onClick={() => setMenuOpen(false)} className="block text-sm text-white/60 hover:text-white px-3 py-2 transition-colors">My Dashboard</Link>
                {isAdmin() && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block text-sm text-white/60 hover:text-white px-3 py-2 transition-colors">Admin Panel</Link>}
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block text-sm text-red-400 px-3 py-2">Logout</button>
              </>
            ) : (
              <Link to="/auth/login" onClick={() => setMenuOpen(false)} className="block text-sm text-white/60 hover:text-white px-3 py-2 transition-colors">Login</Link>
            )}
            <Link to="/portal/quotes/new" onClick={() => setMenuOpen(false)} className="block text-center text-sm bg-rokit-orange hover:bg-rokit-orange/90 text-white rounded-lg px-4 py-2.5 font-medium mx-3 transition-colors">
              Get a Quote
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
