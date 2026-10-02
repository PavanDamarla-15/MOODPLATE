import { useState, useMemo } from 'react';
import {
  Sparkles, RotateCcw, ArrowRight, Star, Clock, IndianRupee,
  Leaf, Drumstick, RefreshCw, Info, Flame,
} from 'lucide-react';
import type { Preferences, Dish } from '@/data/dishes';
import { recommendDishes } from '@/data/dishes';
import { FoodCard } from '@/components/FoodCard';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { Page } from '@/components/Navbar';

interface ResultPageProps {
  preferences: Preferences;
  onNavigate: (page: Page) => void;
  onChangeMood: () => void;
  onViewDish: (dish: Dish) => void;
}

export function ResultPage({ preferences, onNavigate, onChangeMood, onViewDish }: ResultPageProps) {
  const [excluded, setExcluded] = useState<string[]>([]);
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  const allMatches = useMemo(() => recommendDishes(preferences, [], 10), [preferences]);
  const featured = useMemo(() => recommendDishes(preferences, excluded, 1), [preferences, excluded]);
  const moreMatches = useMemo(() => recommendDishes(preferences, excluded, 4).slice(1, 4), [preferences, excluded]);

  const currentFeatured = featured[0];

  const handleFindAnother = () => {
    if (currentFeatured) {
      setExcluded((prev) => [...prev, currentFeatured.dish.id]);
    }
  };

  const allChips: string[] = [
    ...preferences.moods,
    ...preferences.cuisines,
    ...(preferences.budget ? [preferences.budget] : []),
    ...(preferences.time ? [preferences.time] : []),
  ];

  if (!currentFeatured) {
    return (
      <div className="pt-28 pb-20 section-pad">
        <div className="mx-auto max-w-2xl text-center">
          <div className="card p-12">
            <Flame className="mx-auto h-10 w-10 text-coral-400 mb-4" />
            <h2 className="text-2xl font-bold text-brown-900 mb-2">No more matches found</h2>
            <p className="text-brown-500 mb-6">
              We've shown you all the matches for your preferences. Try changing your mood to explore more options.
            </p>
            <button onClick={onChangeMood} className="btn-primary">
              <RotateCcw className="h-4 w-4" />
              Change My Mood
            </button>
          </div>
        </div>
      </div>
    );
  }

  const dish = currentFeatured.dish;

  return (
    <div className="pt-28 pb-20 section-pad">
      <div className="mx-auto max-w-5xl" ref={ref}>
        <div className={`reveal ${visible ? 'is-visible' : ''}`}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-coral-50 border border-coral-200 px-4 py-1.5 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-coral-500" />
              <span className="text-xs font-bold text-coral-600 tracking-wide">YOUR MATCH</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brown-900">YOUR PERFECT MATCH</h1>
            <p className="mt-3 text-brown-500 max-w-lg mx-auto">
              Based on your mood and preferences, we found something delicious for you.
            </p>
          </div>

          {/* SELECTED CHIPS */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {allChips.map((chip) => (
              <span key={chip} className="chip bg-coral-50 text-coral-600 border border-coral-200">
                {chip}
              </span>
            ))}
          </div>

          {/* FEATURED RECOMMENDATION */}
          <div className="card overflow-hidden mb-8 shadow-soft-lg">
            <div className="grid lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto overflow-hidden">
                <img src={dish.image} alt={dish.name} className="h-full w-full object-cover" />
                <div className="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 shadow-soft">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-brown-800">{dish.rating}</span>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h2 className="text-2xl font-extrabold text-brown-900 leading-tight">{dish.name}</h2>
                    <p className="text-sm text-brown-400 mt-1">
                      {dish.cuisine} · {dish.diet}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl bg-coral-50 px-3 py-2">
                    <IndianRupee className="h-4 w-4 text-coral-600" />
                    <span className="text-lg font-extrabold text-coral-600">{dish.price}</span>
                  </div>
                </div>

                <p className="text-sm text-brown-500 leading-relaxed mt-3">{dish.description}</p>

                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm font-medium text-brown-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-coral-500" />
                    {dish.prepTime} min
                  </span>
                  <span className="flex items-center gap-1">
                    {dish.diet === 'Non-Vegetarian' ? (
                      <Drumstick className="h-4 w-4 text-coral-500" />
                    ) : (
                      <Leaf className="h-4 w-4 text-sage-500" />
                    )}
                    {dish.diet}
                  </span>
                  {dish.spiceLevel > 0 && (
                    <span className="flex items-center gap-0.5">
                      {'🌶️'.repeat(Math.min(dish.spiceLevel, 3))}
                    </span>
                  )}
                </div>

                {/* WHY THIS MATCHES */}
                <div className="mt-5 rounded-2xl bg-cream-100 border border-cream-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-coral-500" />
                    <h3 className="text-sm font-bold text-brown-800">Why this matches you</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {currentFeatured.reasons.slice(0, 4).map((reason, i) => (
                      <li key={i} className="text-sm text-brown-500 flex items-start gap-2">
                        <span className="text-coral-400 mt-0.5">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-5 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => onViewDish(dish)}
                    className="btn-primary flex-1"
                  >
                    VIEW DISH
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleFindAnother}
                    className="btn-secondary flex-1"
                  >
                    <RefreshCw className="h-4 w-4" />
                    FIND ANOTHER
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* MORE MATCHES */}
          {moreMatches.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-brown-900 mb-5">More matches for you</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {moreMatches.map((match) => (
                  <FoodCard key={match.dish.id} dish={match.dish} onView={onViewDish} />
                ))}
              </div>
            </div>
          )}

          {/* CHANGE MOOD */}
          <div className="text-center">
            <button onClick={onChangeMood} className="btn-ghost text-base">
              <RotateCcw className="h-4 w-4" />
              CHANGE MY MOOD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
