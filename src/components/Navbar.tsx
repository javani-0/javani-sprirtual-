import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import PrimaryButton from "./PrimaryButton";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Courses", path: "/courses" },
  { label: "Grading System", path: "/grading" },
  { label: "Gallery", path: "/gallery" },
  { label: "Products", path: "/products" },
  { label: "Guru Bandhu", path: "/guru-bandhu" },
  { label: "Contact", path: "/contact" },
];

const GoldDiamond = ({ size = 8 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" className="text-gold">
    <path d="M10 0L12.5 7.5L20 10L12.5 12.5L10 20L7.5 12.5L0 10L7.5 7.5L10 0Z" fill="currentColor" />
  </svg>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setClosing(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setMobileOpen(false);
      setClosing(false);
    }, 300);
  }, []);

  const isSolid = scrolled;

  const navBgClass = isSolid
    ? "backdrop-blur-xl shadow-card"
    : "bg-[#1A0A0A]/40 backdrop-blur-sm";

  const navBgStyle = isSolid
    ? { backgroundColor: "rgba(245, 237, 214, 0.97)" }
    : undefined;

  const textColor = isSolid ? "text-foreground" : "text-white/90";
  const activeColor = isSolid ? "text-gold border-b-2 border-gold" : "text-gold-light border-b-2 border-gold-light";
  const hoverColor = isSolid ? "hover:text-gold" : "hover:text-gold-light";
  const brandColor = isSolid ? "text-primary" : "text-white";
  const subtitleColor = isSolid ? "text-muted-foreground" : "text-white/70";

  const showMobile = mobileOpen || closing;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${navBgClass}`}
        style={{ height: "80px", ...navBgStyle }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex flex-col">
            <span className={`font-accent text-[1.2rem] sm:text-[1.4rem] leading-tight transition-colors duration-300 ${brandColor}`}>JAVNI</span>
            <span className={`font-display text-[0.6rem] sm:text-[0.7rem] tracking-[0.25em] transition-colors duration-300 ${subtitleColor}`}>SPIRITUAL ARTS</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body font-medium text-[0.85rem] xl:text-[0.9rem] relative pb-1 transition-colors duration-300 ${
                  location.pathname === link.path
                    ? activeColor
                    : `${textColor} ${hoverColor}`
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:block">
            <Link to="/contact">
              <PrimaryButton compact>Enquire Now</PrimaryButton>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`lg:hidden p-2 transition-colors ${textColor}`}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Premium Mobile Menu */}
      {showMobile && createPortal(
        <div
          className="fixed inset-0 z-[10000] flex flex-col"
          style={{
            background: "linear-gradient(165deg, hsl(0 68% 18%) 0%, hsl(0 44% 7%) 50%, hsl(0 30% 5%) 100%)",
            animation: closing ? "menuFadeOut 0.3s ease-in forwards" : "menuFadeIn 0.4s ease-out forwards",
          }}
        >
          {/* Header: Brand + Close */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div className="flex flex-col">
              <span className="font-accent text-[1.3rem] text-gold tracking-wide">JAVNI</span>
              <span className="font-display text-[0.6rem] tracking-[0.3em] text-white/50 mt-0.5">SPIRITUAL ARTS</span>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full border border-transparent hover:border-gold/40 transition-all duration-300 group"
              aria-label="Close menu"
            >
              <X className="w-7 h-7 text-white/70 group-hover:text-gold transition-colors duration-300" />
            </button>
          </div>

          {/* Gold accent line */}
          <div className="mx-6 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

          {/* Nav Links */}
          <div className="flex-1 flex flex-col items-center justify-center gap-1 px-6">
            {navLinks.map((link, i) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300"
                  style={{
                    opacity: 0,
                    animation: closing
                      ? "none"
                      : `menuItemSlideIn 0.5s ease-out ${0.15 + i * 0.06}s forwards`,
                  }}
                >
                  {/* Active diamond indicator */}
                  <span className={`transition-all duration-300 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}>
                    <GoldDiamond size={7} />
                  </span>
                  <span
                    className={`font-display text-[1.5rem] sm:text-[1.7rem] tracking-wide transition-all duration-300 ${
                      isActive
                        ? "text-gold font-semibold"
                        : "text-white/80 group-hover:text-gold group-hover:translate-x-1"
                    }`}
                    style={{ letterSpacing: "0.04em" }}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}

            {/* Gold divider before CTA */}
            <div
              className="flex items-center gap-3 mt-4 mb-2 w-48"
              style={{
                opacity: 0,
                animation: closing
                  ? "none"
                  : `menuItemSlideIn 0.5s ease-out ${0.15 + navLinks.length * 0.06}s forwards`,
              }}
            >
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/30" />
              <GoldDiamond size={6} />
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/30" />
            </div>

            {/* CTA */}
            <div
              style={{
                opacity: 0,
                animation: closing
                  ? "none"
                  : `menuItemSlideIn 0.5s ease-out ${0.2 + navLinks.length * 0.06}s forwards`,
              }}
            >
              <Link to="/contact">
                <PrimaryButton className="mt-2 px-8">Enquire Now</PrimaryButton>
              </Link>
            </div>
          </div>

          {/* Bottom decorative accent */}
          <div className="flex flex-col items-center pb-8 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-gold/20" />
              <GoldDiamond size={5} />
              <div className="w-8 h-px bg-gold/20" />
            </div>
            <span className="font-display text-[0.55rem] tracking-[0.4em] text-white/20 uppercase">Est. 2012</span>
          </div>
        </div>,
        document.body
      )}

      {/* Keyframe animations injected once */}
      <style>{`
        @keyframes menuFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes menuFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes menuItemSlideIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
