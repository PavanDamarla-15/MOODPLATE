import { Sparkles, ArrowRight, Flame, TrendingUp } from 'lucide-react';
import { dishes, moodData } from '@/data/dishes';
import type { Mood } from '@/data/dishes';
import { FoodCard } from '@/components/FoodCard';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { Page } from '@/components/Navbar';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  onSelectMood: (mood: Mood) => void;
  onViewDish: (dish: typeof dishes[number]) => void;
}

export function HomePage({ onNavigate, onSelectMood, onViewDish }: HomePageProps) {
  const { ref: statsRef, visible: statsVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: trendingRef, visible: trendingVisible } = useScrollReveal<HTMLDivElement>();

  const popular = dishes
    .filter((d) => ['creamy-mushroom-pasta', 'paneer-tikka-wrap', 'butter-chicken-bowl'].includes(d.id));

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-cream-100 via-cream-50 to-cream-50" />
          <div className="absolute inset-0 bg-dots opacity-50" />
          <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-coral-200/40 blur-[100px]" />
          <div className="absolute bottom-20 left-10 h-72 w-72 rounded-full bg-amber-200/40 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-cream-200 px-4 py-1.5 mb-8 animate-fade-down shadow-soft">
            <Sparkles className="h-3.5 w-3.5 text-coral-500" />
            <span className="text-xs font-bold text-brown-600 tracking-wide">
              FOOD BY MOOD — PERSONALIZED DISCOVERY
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-brown-900 leading-[1.05] animate-fade-up" style={{ animationDelay: '100ms' }}>
            WHAT'S YOUR<br />
            <span className="text-gradient-coral">MOOD?</span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-lg text-brown-500 animate-fade-up" style={{ animationDelay: '250ms' }}>
            Your mood knows what you want to eat. Let us find it.
          </p>

          <button
            onClick={() => onNavigate('find')}
            className="mt-10 btn-primary text-base !px-8 !py-4 animate-fade-up glow-coral"
            style={{ animationDelay: '400ms' }}
          >
            <Sparkles className="h-5 w-5" />
            FIND MY FOOD
          </button>

          {/* MOOD CARDS */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 animate-fade-up" style={{ animationDelay: '550ms' }}>
            {moodData.map((mood) => (
              <button
                key={mood.id}
                onClick={() => onSelectMood(mood.id)}
                className="group card card-hover p-5 text-center cursor-pointer"
              >
                <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${mood.color} mb-3 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                  <span className="text-2xl">{mood.emoji}</span>
                </div>
                <p className="text-sm font-bold text-brown-900">{mood.label}</p>
                <p className="text-2xs text-brown-400 mt-0.5">{mood.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR NOW */}
      <section className="section-pad pt-12 pb-20">
        <div ref={trendingRef} className={`mx-auto max-w-7xl reveal ${trendingVisible ? 'is-visible' : ''}`}>
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-coral-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-coral-500">Trending This Week</span>
          </div>
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brown-900">Popular Right Now</h2>
            <button
              onClick={() => onNavigate('find')}
              className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-coral-600 hover:text-coral-700 transition-colors"
            >
              Find your match
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ transitionDelay: '100ms' }}>
            {popular.map((dish) => (
              <FoodCard key={dish.id} dish={dish} onView={onViewDish} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="section-pad pb-20">
        <div className="mx-auto max-w-4xl">
          <div ref={statsRef} className={`reveal ${statsVisible ? 'is-visible' : ''}`}>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-coral-500 to-coral-600 p-8 sm:p-12 text-center shadow-coral">
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <Flame className="mx-auto h-8 w-8 text-white/90 mb-4" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Not sure what to eat?
                </h2>
                <p className="mt-3 text-white/80 max-w-lg mx-auto">
                  Tell us your mood, cuisine, budget, and time — and we'll find your perfect dish in seconds.
                </p>
                <button
                  onClick={() => onNavigate('find')}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-coral-600 transition-all hover:scale-105 active:scale-95"
                >
                  <Sparkles className="h-4 w-4" />
                  Start Finding Food
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
