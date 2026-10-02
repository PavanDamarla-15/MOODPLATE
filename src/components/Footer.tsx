import { UtensilsCrossed, Sparkles, Heart } from 'lucide-react';
import type { Page } from './Navbar';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-brown-900 text-cream-100 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-coral-500">
                <UtensilsCrossed className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-extrabold tracking-tight text-cream-50">
                  MOOD<span className="text-coral-400">PLATE</span>
                </span>
                <span className="text-2xs font-medium text-cream-300/60">Food by Mood</span>
              </div>
            </div>
            <p className="text-sm text-cream-200/60 max-w-xs leading-relaxed">
              Tell us your mood. We'll find your food. Personalized food discovery powered by how you feel.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cream-200/40 mb-3">Explore</h4>
            <div className="flex flex-col gap-2">
              {(['home', 'find', 'ai'] as Page[]).map((p) => (
                <button
                  key={p}
                  onClick={() => onNavigate(p)}
                  className="text-sm text-cream-200/60 hover:text-coral-400 transition-colors text-left"
                >
                  {p === 'home' ? 'Home' : p === 'find' ? 'Find My Food' : 'Mood AI'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cream-200/40 mb-3">Moods</h4>
            <div className="flex flex-wrap gap-2">
              {['😋 Hungry', '😌 Comfort', '🔥 Spicy', '🥳 Celebrating', '💪 Healthy', '🌙 Late Night'].map((m) => (
                <span key={m} className="text-2xs text-cream-200/50">{m}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cream-200/40 mb-3">Theme</h4>
            <p className="text-sm text-cream-200/60">
              Food by Mood — Personalized Food Discovery Platform
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-cream-200/10 pt-6 text-center">
          <p className="text-sm italic text-cream-200/40">
            "Tell us your mood. We'll find your food."
          </p>
          <p className="mt-2 text-2xs text-cream-200/30">
            MOODPLATE — A student competition project. All dish data is fictional for demonstration.
          </p>
        </div>
      </div>
    </footer>
  );
}
