import { useState } from 'react';
import { HeartPulse, Menu, X } from 'lucide-react';

export type NavSectionId = 'home' | 'about' | 'prediction' | 'analytics' | 'methodology';

interface NavbarProps {
  activeSection: NavSectionId;
  onNavigate: (sectionId: NavSectionId) => void;
}

const NAV_ITEMS: Array<{ id: NavSectionId; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'prediction', label: 'Prediction' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'methodology', label: 'Methodology' },
];

export default function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: NavSectionId) => {
    setMobileMenuOpen(false);
    onNavigate(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Title */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-navy-950 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
        >
          <HeartPulse className="h-5 w-5 text-teal-700 shrink-0" aria-hidden="true" />
          <span>CardioPredict AI</span>
        </a>

        {/* Zone 2: Single-line Text Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                className={`relative py-1 transition-colors duration-150 whitespace-nowrap shrink-0 hover:text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700 ${
                  isActive ? 'text-navy-950 font-semibold' : 'text-slate-600'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-teal-700"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick('prediction')}
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Start Assessment
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 md:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-navy-950 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-navy-950'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <button
              type="button"
              onClick={() => handleNavClick('prediction')}
              className="mt-2 w-full rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 cursor-pointer"
            >
              Start Assessment
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
