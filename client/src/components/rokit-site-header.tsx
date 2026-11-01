import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDownRight, ChevronDown, LayoutDashboard, LogOut, Menu, Shield, User, X } from "lucide-react";

import logoAsset from "@/assets/rokit-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const serviceLinks = [
  { label: "Brand & Identity", description: "Make it recognisable.", to: "/services/brand-identity" as const },
  { label: "Websites & Digital Solutions", description: "Give it somewhere to work.", to: "/services/websites-digital" as const },
  { label: "Marketing & Growth", description: "Help it reach people.", to: "/services/marketing-growth" as const },
  { label: "Communication & Content", description: "Make it understood.", to: "/services/communication-content" as const },
  { label: "Physical Brand & Production", description: "Bring it into the real world.", to: "/services/physical-production" as const },
] as const;

const navigation = [
  { label: "Made by rOKIt", to: "/work" as const },
  { label: "Shop", to: "/shop" as const },
  { label: "Ideas", to: "/ideas" as const },
  { label: "About", to: "/about" as const },
];

export function RokitSiteHeader() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const loggedIn = isLoggedIn();
  const admin = isAdmin();
  const firstName = user?.name ? String(user.name).trim().split(/\s+/)[0] : "Account";

  useEffect(() => {
    if (!servicesOpen && !mobileOpen && !accountOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setServicesOpen(false);
        setAccountOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [servicesOpen, mobileOpen, accountOpen]);

  return (
    <header
      ref={headerRef}
      className="site-header relative z-20 border-b border-paper/15 bg-night text-paper"
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setServicesOpen(false);
          setAccountOpen(false);
          setMobileOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && (servicesOpen || mobileOpen || accountOpen)) {
          setServicesOpen(false);
          setAccountOpen(false);
          setMobileOpen(false);
          headerRef.current
            ?.querySelector<HTMLButtonElement>(
              mobileOpen ? "[aria-controls='primary-menu']" : "[aria-controls='services-menu']"
            )
            ?.focus();
        }
      }}
    >
      <div className="mx-auto grid min-w-0 max-w-site grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 px-gutter py-3 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-4 md:py-4">
        <Link to="/" aria-label="rOKIt home" className="min-w-0 md:col-start-1 md:row-start-1">
          <img src={logoAsset.url} alt="rOKIt" className="h-10 w-auto max-w-[185px] object-contain object-left" />
        </Link>

        <div className="hidden items-center gap-2.5 md:col-start-3 md:row-start-1 md:flex">
          {!loggedIn ? (
            <Link
              to={"/auth/login" as any}
              aria-label="Sign in to your rOKIt account"
              className="group action-link min-h-11 border border-paper/25 px-3.5 text-neutral hover:border-signal hover:text-signal"
              activeProps={{ className: "border-signal text-signal" }}
            >
              <User className="size-3.5 text-paper/80 transition-colors group-hover:text-signal" aria-hidden="true" />
              <span className="h-3.5 w-px bg-paper/20 transition-colors group-hover:bg-signal/50" aria-hidden="true" />
              <span>Sign in</span>
            </Link>
          ) : (
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                aria-label="Account menu"
                aria-controls="account-menu"
                aria-expanded={accountOpen}
                onClick={() => {
                  setAccountOpen((open) => !open);
                  setServicesOpen(false);
                }}
                className="group min-h-11 gap-2 rounded-none border border-paper/25 px-3.5 text-xs font-normal text-paper hover:border-signal hover:bg-transparent hover:text-signal aria-expanded:border-signal aria-expanded:text-signal"
              >
                <span className="relative flex items-center justify-center">
                  <User className="size-3.5" aria-hidden="true" />
                  <span className=" -right-0.5 -top-0.5 absolute size-1.5 bg-signal" aria-hidden="true" />
                </span>
                <span className="h-3.5 w-px bg-paper/20 transition-colors group-hover:bg-signal/50" aria-hidden="true" />
                <span className="max-w-[7rem] truncate">{firstName}</span>
                <ChevronDown className={`size-3 transition-transform ${accountOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </Button>
              {accountOpen && (
                <div
                  id="account-menu"
                  className="absolute right-0 top-full z-30 mt-px w-56 border border-paper/20 bg-night p-1.5 shadow-xl"
                >
                  <div className="border-b border-paper/15 px-3 py-2.5">
                    <p className="truncate font-display text-xs text-paper">{user?.name || "rOKIt Account"}</p>
                    <p className="mt-0.5 truncate text-[11px] text-neutral">{user?.email}</p>
                    {admin && <span className="mt-1.5 inline-block text-[10px] uppercase text-signal">Admin Studio</span>}
                  </div>
                  <Link
                    to={"/portal" as any}
                    onClick={() => setAccountOpen(false)}
                    className="flex min-h-10 items-center gap-2.5 px-3 text-xs text-paper transition-colors hover:bg-surface hover:text-signal"
                  >
                    <LayoutDashboard className="size-3.5 text-signal" aria-hidden="true" />
                    Client Portal
                  </Link>
                  {admin && (
                    <Link
                      to={"/admin" as any}
                      onClick={() => setAccountOpen(false)}
                      className="flex min-h-10 items-center gap-2.5 px-3 text-xs text-paper transition-colors hover:bg-surface hover:text-signal"
                    >
                      <Shield className="size-3.5 text-signal" aria-hidden="true" />
                      Admin Console
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setAccountOpen(false);
                    }}
                    className="mt-1 flex min-h-10 w-full cursor-pointer items-center gap-2.5 border-t border-paper/15 px-3 pt-1 text-left text-xs text-neutral transition-colors hover:bg-surface hover:text-signal"
                  >
                    <LogOut className="size-3.5" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}

          <Link
            to="/start-a-project"
            className="action-link min-h-11 border border-paper/25 px-4 hover:border-signal hover:text-signal"
          >
            Start a Project <ArrowDownRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        <Button
          type="button"
          variant="ghost"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-controls="primary-menu"
          aria-expanded={mobileOpen}
          onClick={() => {
            setMobileOpen(!mobileOpen);
            setServicesOpen(false);
            setAccountOpen(false);
          }}
          className="size-11 rounded-none text-paper hover:bg-surface hover:text-signal md:hidden"
        >
          {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>

        <nav
          id="primary-menu"
          aria-label="Primary navigation"
          className={`col-span-2 ${mobileOpen ? "flex" : "hidden"} min-w-0 flex-col flex-wrap items-stretch gap-x-5 border-t border-paper/10 pt-2 text-xs text-neutral md:col-span-1 md:col-start-2 md:row-start-1 md:flex md:flex-row md:items-center md:justify-end md:gap-x-6 md:border-0 md:pt-0`}
        >
          {navigation.map((item, index) => (
            <div key={item.label} className="contents">
              <Link
                to={item.to}
                onClick={() => {
                  setMobileOpen(false);
                  setServicesOpen(false);
                }}
                className="flex min-h-11 shrink-0 items-center transition-colors hover:text-paper"
                activeProps={{ className: "text-signal" }}
              >
                {item.label}
              </Link>
              {index === 0 && (
                <div
                  className="services-nav"
                  onMouseEnter={() => {
                    if (window.matchMedia("(hover: hover) and (min-width: 768px)").matches) setServicesOpen(true);
                  }}
                  onMouseLeave={(event) => {
                    if (!event.currentTarget.contains(document.activeElement)) setServicesOpen(false);
                  }}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    aria-label="Services menu"
                    aria-controls="services-menu"
                    aria-expanded={servicesOpen}
                    onClick={() =>
                      setServicesOpen((open) =>
                        window.matchMedia("(hover: hover) and (min-width: 768px)").matches ? true : !open
                      )
                    }
                    onFocus={() => {
                      if (window.matchMedia("(hover: hover) and (min-width: 768px)").matches) setServicesOpen(true);
                    }}
                    className="min-h-11 justify-start gap-1 rounded-none px-0 text-xs font-normal text-neutral hover:bg-transparent hover:text-paper aria-expanded:text-signal"
                  >
                    Services <ChevronDown className={`size-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                  </Button>
                  {servicesOpen && (
                    <div
                      id="services-menu"
                      className="services-menu relative z-30 border-y border-paper/20 bg-night shadow-xl md:absolute md:inset-x-0 md:left-auto md:right-gutter md:top-full md:w-[min(46rem,calc(100vw-2*var(--spacing-gutter)))]"
                      onMouseLeave={(event) => {
                        if (!event.currentTarget.contains(document.activeElement)) setServicesOpen(false);
                      }}
                    >
                      <div className="grid max-h-[min(70vh,36rem)] overflow-y-auto px-gutter py-3 md:grid-cols-2 md:gap-x-8 md:px-7">
                        {serviceLinks.map((service) => (
                          <Link
                            key={service.label}
                            to={service.to}
                            onClick={() => {
                              setServicesOpen(false);
                              setMobileOpen(false);
                            }}
                            className="group flex min-h-14 flex-col justify-center border-b border-paper/15 py-2 text-paper hover:text-signal"
                          >
                            <span className="font-display text-sm">{service.label}</span>
                            <span className="mt-1 text-xs text-neutral group-hover:text-paper">{service.description}</span>
                          </Link>
                        ))}
                        <Link
                          to="/what-we-do"
                          onClick={() => {
                            setServicesOpen(false);
                            setMobileOpen(false);
                          }}
                          className="action-link min-h-14 justify-start text-signal hover:text-paper"
                        >
                          Explore all services <ArrowDownRight aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          <div className="border-t border-paper/15 pt-2 md:hidden">
            {!loggedIn ? (
              <Link
                to={"/auth/login" as any}
                onClick={() => setMobileOpen(false)}
                className="action-link min-h-12 justify-start text-paper hover:text-signal"
              >
                <User className="size-3.5 text-signal" aria-hidden="true" /> Sign in
              </Link>
            ) : (
              <div className="grid gap-1 py-1">
                <Link
                  to={"/portal" as any}
                  onClick={() => setMobileOpen(false)}
                  className="action-link min-h-11 justify-start text-paper hover:text-signal"
                >
                  <LayoutDashboard className="size-3.5 text-signal" aria-hidden="true" /> Client Portal ({firstName})
                </Link>
                {admin && (
                  <Link
                    to={"/admin" as any}
                    onClick={() => setMobileOpen(false)}
                    className="action-link min-h-11 justify-start text-paper hover:text-signal"
                  >
                    <Shield className="size-3.5 text-signal" aria-hidden="true" /> Admin Console
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="action-link min-h-11 justify-start text-neutral hover:text-signal"
                >
                  <LogOut className="size-3.5" aria-hidden="true" /> Sign out
                </button>
              </div>
            )}
          </div>

          <Link
            to="/start-a-project"
            onClick={() => setMobileOpen(false)}
            className="action-link min-h-14 justify-start border-t border-paper/20 text-signal md:hidden"
          >
            Start a Project <ArrowDownRight aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
