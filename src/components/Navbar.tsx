import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, UtensilsCrossed } from 'lucide-react';

export type Page = 'home' | 'find' | 'ai';

interface NavbarProps {
  current: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { id: Page; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'find', label: 'Find My Food' },
  { id: 'ai', label: 'Mood AI' },
];

export function Navbar({ current, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-cream-50/90 backdrop-blur-xl shadow-soft py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 group"
            aria-label="MOODPLATE home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-coral-500 transition-transform group-hover:rotate-6 group-hover:scale-105">
              <UtensilsCrossed className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-extrabold tracking-tight text-brown-900">
                MOOD<span className="text-coral-500">PLATE</span>
              </span>
              <span className="text-2xs font-medium text-brown-400">Food by Mood</span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`relative px-4 py-2 text-sm font-semibold transition-all ${
                  current === item.id
                    ? 'text-coral-600'
                    : 'text-brown-500 hover:text-coral-600'
                }`}
              >
                {item.label}
                {current === item.id && (
                  <span className="absolute bottom-0 left-1/2 h-1 w-1.5 -translate-x-1/2 rounded-full bg-coral-500" />
                )}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNav('ai')}
              className="btn-primary !py-2.5 !px-5"
            >
              <Sparkles className="h-4 w-4" />
              Mood AI
            </button>
          </div>

          <button
            className="md:hidden rounded-xl p-2 text-brown-600 hover:bg-cream-200"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-brown-900/30 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-cream-50 p-6 pt-24 shadow-soft-lg animate-slide-up">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-all ${
                    current === item.id
                      ? 'bg-coral-50 text-coral-600 border border-coral-200'
                      : 'text-brown-500 hover:bg-cream-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => handleNav('ai')}
                className="mt-2 btn-primary w-full"
              >
                <Sparkles className="h-4 w-4" />
                Mood AI
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
