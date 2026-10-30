import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ArrowDownRight, ChevronDown, Menu, X, User, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const serviceLinks = [
  { label: "Brand & Identity", description: "Make it recognisable.", to: "/services/branding" },
  { label: "Websites & Digital Solutions", description: "Give it somewhere to work.", to: "/services/web-design" },
  { label: "Marketing & Growth", description: "Help it reach people.", to: "/services/idea-creation" },
  { label: "Communication & Content", description: "Make it understood.", to: "/services/graphic-design" },
  { label: "Physical Brand & Production", description: "Bring it into the real world.", to: "/services/large-format" },
];

const navigation = [
  { label: "Made by rOKIt", to: "/gallery" },
  { label: "About", to: "/about" },
  { label: "Tutorials", to: "/tutorials" },
  { label: "Photo Enhancer", to: "/photo-enhancer" },
  { label: "Contact", to: "/contact" },
];

export default function RokitSiteHeader() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const headerRef = useRef(null);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!servicesOpen && !mobileOpen && !accountOpen) return;
    const closeOutside = (event) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setServicesOpen(false);
        setMobileOpen(false);
        setAccountOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [servicesOpen, mobileOpen, accountOpen]);

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header
      ref={headerRef}
      className="site-header sticky top-0 left-0 right-0 z-50 border-b border-paper/15 bg-night text-paper font-v4-body"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setServicesOpen(false);
          setMobileOpen(false);
          setAccountOpen(false);
        }
      }}
    >
      <div className="mx-auto grid min-w-0 max-w-site grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 px-gutter py-3 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-4 md:py-4">
        {/* Brand Logo */}
        <Link to="/" aria-label="rOKIt home" className="min-w-0 md:col-start-1 md:row-start-1 flex items-center">
          <img
            src="/assets/images/rokit-logo-white.png"
            alt="rOKIt"
            className="h-9 md:h-10 w-auto max-w-[185px] object-contain object-left"
          />
        </Link>

        {/* Action Button Desktop */}
        <div className="hidden md:flex items-center gap-4 md:col-start-3 md:row-start-1">
          {/* User Account / Auth */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-1.5 text-xs text-neutral hover:text-paper py-2 uppercase tracking-wider"
              >
                <User size={14} className="text-signal" />
                <span>{user.name?.split(' ')[0] ?? 'Account'}</span>
                <ChevronDown size={12} className={`transition-transform ${accountOpen ? "rotate-180" : ""}`} />
              </button>
              {accountOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 border border-paper/20 bg-night p-2 shadow-xl z-50">
                  <Link
                    to="/portal"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-paper hover:bg-surface hover:text-signal"
                  >
                    <LayoutDashboard size={14} /> My Dashboard
                  </Link>
                  {isAdmin && isAdmin() && (
                    <Link
                      to="/admin"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-paper hover:bg-surface hover:text-signal"
                    >
                      <ShieldCheck size={14} /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-surface text-left"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="text-xs uppercase tracking-wider text-neutral hover:text-paper px-2 py-2 transition-colors"
            >
              Login
            </Link>
          )}

          <Link
            to="/portal/quotes/new"
            className="v4-action-link min-h-11 border border-paper/25 px-4 text-xs uppercase tracking-wider text-paper hover:border-signal hover:text-signal transition-colors"
          >
            Start a Project <ArrowDownRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          onClick={() => {
            setMobileOpen(!mobileOpen);
            setServicesOpen(false);
          }}
          className="size-11 flex items-center justify-center rounded-none text-paper hover:bg-surface hover:text-signal md:hidden"
        >
          {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>

        {/* Desktop Navigation */}
        <nav
          id="primary-menu"
          aria-label="Primary navigation"
          className="hidden md:flex md:flex-row min-w-0 flex-wrap items-center gap-x-5 text-xs text-neutral md:col-span-1 md:col-start-2 md:row-start-1 md:justify-end md:gap-x-6"
        >
          {/* Made by rOKIt */}
          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              `flex min-h-11 shrink-0 items-center transition-colors hover:text-paper ${isActive ? "text-signal" : ""}`
            }
          >
            Made by rOKIt
          </NavLink>

          {/* Services dropdown */}
          <div
            className="services-nav relative"
            onMouseEnter={() => {
              if (window.matchMedia("(hover: hover) and (min-width: 768px)").matches) setServicesOpen(true);
            }}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              aria-label="Services menu"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen(!servicesOpen)}
              className="flex min-h-11 items-center gap-1 px-0 text-xs text-neutral hover:text-paper transition-colors"
            >
              Services <ChevronDown className={`size-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
            </button>
            {servicesOpen && (
              <div
                className="services-menu absolute right-0 top-full z-40 border border-paper/20 bg-night shadow-2xl w-[min(46rem,calc(100vw-2*var(--v4-spacing-gutter)))]"
              >
                <div className="grid max-h-[min(70vh,36rem)] overflow-y-auto px-gutter py-4 md:grid-cols-2 md:gap-x-8 md:px-7">
                  {serviceLinks.map((service) => (
                    <Link
                      key={service.label}
                      to={service.to}
                      onClick={() => setServicesOpen(false)}
                      className="group flex min-h-14 flex-col justify-center border-b border-paper/15 py-3 text-paper hover:text-signal transition-colors"
                    >
                      <span className="font-v4-display text-sm font-medium">{service.label}</span>
                      <span className="mt-1 text-xs text-neutral group-hover:text-paper transition-colors">{service.description}</span>
                    </Link>
                  ))}
                  <Link
                    to="/services"
                    onClick={() => setServicesOpen(false)}
                    className="v4-action-link min-h-14 justify-start text-signal hover:text-paper text-xs uppercase tracking-wider"
                  >
                    Explore all services <ArrowDownRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Other Navigation Links */}
          {navigation.slice(1).map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex min-h-11 shrink-0 items-center transition-colors hover:text-paper ${isActive ? "text-signal" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-paper/15 bg-night px-gutter py-4 space-y-3">
          <Link
            to="/gallery"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm text-neutral hover:text-signal"
          >
            Made by rOKIt
          </Link>
          <div className="border-t border-paper/10 pt-2">
            <span className="block text-[10px] uppercase tracking-wider text-neutral/70 mb-2">Services</span>
            {serviceLinks.map((service) => (
              <Link
                key={service.label}
                to={service.to}
                onClick={() => setMobileOpen(false)}
                className="block py-1.5 text-sm text-paper hover:text-signal"
              >
                {service.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-paper/10 pt-2 space-y-2">
            {navigation.slice(1).map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="block py-1.5 text-sm text-neutral hover:text-signal"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-paper/10 pt-3">
            {user ? (
              <div className="space-y-2 mb-3">
                <Link
                  to="/portal"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm text-paper hover:text-signal"
                >
                  My Dashboard ({user.name?.split(' ')[0]})
                </Link>
                {isAdmin && isAdmin() && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm text-paper hover:text-signal"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block text-sm text-red-400 py-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-paper hover:text-signal py-1 mb-2"
              >
                Login
              </Link>
            )}

            <Link
              to="/portal/quotes/new"
              onClick={() => setMobileOpen(false)}
              className="v4-action-link w-full min-h-12 border border-signal bg-signal text-night font-medium justify-center uppercase tracking-wider text-xs"
            >
              Start a Project <ArrowDownRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
