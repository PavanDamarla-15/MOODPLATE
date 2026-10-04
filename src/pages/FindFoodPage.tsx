import { useState } from 'react';
import { Check, Sparkles, RotateCcw, UtensilsCrossed } from 'lucide-react';
import {
  moodData, cuisineData, budgetData, timeData,
} from '@/data/dishes';
import type { Mood, Cuisine, BudgetRange, TimeRange, Preferences } from '@/data/dishes';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { Page } from '@/components/Navbar';

interface FindFoodPageProps {
  onNavigate: (page: Page) => void;
  onFind: (prefs: Preferences) => void;
  initialMood?: Mood | null;
}

export function FindFoodPage({ onNavigate, onFind, initialMood }: FindFoodPageProps) {
  const [mood, setMood] = useState<Mood | null>(initialMood ?? null);
  const [cuisine, setCuisine] = useState<Cuisine | null>(null);
  const [budget, setBudget] = useState<BudgetRange | null>(null);
  const [time, setTime] = useState<TimeRange | null>(null);
  const [finding, setFinding] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  const isComplete = Boolean(mood && cuisine && budget && time);
  const hasAnySelection = Boolean(mood || cuisine || budget || time);

  const handleFind = () => {
    if (finding) return;
    if (!isComplete) {
      setValidationMessage('Choose your mood, cuisine, budget and time so we can find your perfect match.');
      return;
    }
    setValidationMessage('');
    setFinding(true);

    const selectedMood = mood;
    const selectedCuisine = cuisine;
    const selectedBudget = budget;
    const selectedTime = time;

    window.setTimeout(() => {
      if (!selectedMood || !selectedCuisine || !selectedBudget || !selectedTime) return;
      onFind({
        moods: [selectedMood],
        cuisines: [selectedCuisine],
        budget: selectedBudget,
        time: selectedTime,
      });
    }, 350);
  };

  const handleReset = () => {
    setMood(null);
    setCuisine(null);
    setBudget(null);
    setTime(null);
    setValidationMessage('');
    setFinding(false);
  };

  return (
    <div className="pt-28 pb-20 section-pad">
      <div className="mx-auto max-w-3xl">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-coral-50 border border-coral-200 px-4 py-1.5 mb-4">
              <UtensilsCrossed className="h-3.5 w-3.5 text-coral-500" />
              <span className="text-xs font-bold text-coral-600 tracking-wide">PERSONALIZED DISCOVERY</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brown-900">What are you craving?</h1>
            <p className="mt-3 text-brown-500 max-w-lg mx-auto">
              Tell us how you feel and we'll find something delicious.
            </p>
          </div>
        </div>

        {/* YOUR MOOD */}
        <Section title="Your Mood" subtitle="How are you feeling right now?">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {moodData.map((moodOption) => {
              const selected = mood === moodOption.id;
              return (
                <button
                  key={moodOption.id}
                  onClick={() => { setMood(moodOption.id); setValidationMessage(''); }}
                  className={`relative rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                    selected
                      ? 'border-coral-400 bg-coral-50 shadow-coral-sm'
                      : 'border-cream-200 bg-white hover:border-coral-200 hover:bg-cream-50'
                  }`}
                >
                  {selected && (
                    <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-coral-500 text-white shadow-soft">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{moodOption.emoji}</span>
                    <div>
                      <p className={`text-sm font-bold ${selected ? 'text-coral-700' : 'text-brown-800'}`}>{moodOption.label}</p>
                      <p className="text-2xs text-brown-400">{moodOption.desc}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Section>

        {/* CUISINE */}
        <Section title="Cuisine" subtitle="What type of food sounds good?">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {cuisineData.map((c) => {
              const selected = cuisine === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => { setCuisine(c.id); setValidationMessage(''); }}
                  className={`relative rounded-2xl border-2 p-4 text-center transition-all duration-300 ${
                    selected
                      ? 'border-coral-400 bg-coral-50 shadow-coral-sm'
                      : 'border-cream-200 bg-white hover:border-coral-200 hover:bg-cream-50'
                  }`}
                >
                  {selected && (
                    <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-coral-500 text-white shadow-soft">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </div>
                  )}
                  <span className="text-2xl block mb-1">{c.emoji}</span>
                  <p className={`text-sm font-bold ${selected ? 'text-coral-700' : 'text-brown-800'}`}>{c.id}</p>
                </button>
              );
            })}
          </div>
        </Section>

        {/* BUDGET */}
        <Section title="Budget" subtitle="How much do you want to spend?">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {budgetData.map((b) => {
              const selected = budget === b;
              return (
                <button
                  key={b}
                  onClick={() => { setBudget(selected ? null : b); setValidationMessage(''); }}
                  className={`relative rounded-2xl border-2 p-3.5 text-center transition-all duration-300 ${
                    selected
                      ? 'border-coral-400 bg-coral-50 shadow-coral-sm'
                      : 'border-cream-200 bg-white hover:border-coral-200 hover:bg-cream-50'
                  }`}
                >
                  {selected && (
                    <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-coral-500 text-white shadow-soft">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </div>
                  )}
                  <p className={`text-sm font-bold ${selected ? 'text-coral-700' : 'text-brown-800'}`}>{b}</p>
                </button>
              );
            })}
          </div>
        </Section>

        {/* TIME */}
        <Section title="Time" subtitle="How long can you wait?">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {timeData.map((t) => {
              const selected = time === t;
              return (
                <button
                  key={t}
                  onClick={() => { setTime(selected ? null : t); setValidationMessage(''); }}
                  className={`relative rounded-2xl border-2 p-3.5 text-center transition-all duration-300 ${
                    selected
                      ? 'border-coral-400 bg-coral-50 shadow-coral-sm'
                      : 'border-cream-200 bg-white hover:border-coral-200 hover:bg-cream-50'
                  }`}
                >
                  {selected && (
                    <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-coral-500 text-white shadow-soft">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </div>
                  )}
                  <p className={`text-sm font-bold ${selected ? 'text-coral-700' : 'text-brown-800'}`}>{t}</p>
                </button>
              );
            })}
          </div>
        </Section>

        {/* ACTIONS */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleFind}
            disabled={finding}
            className="btn-primary w-full sm:w-auto text-base !px-10 !py-4"
          >
            {finding ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Finding...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                FIND MY FOOD
              </>
            )}
          </button>
          {validationMessage && (
            <p role="alert" className="w-full text-center text-sm font-medium text-coral-600 sm:absolute sm:mt-24">{validationMessage}</p>
          )}
          {hasAnySelection && (
            <button onClick={handleReset} className="btn-ghost">
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-brown-900">{title}</h2>
        <p className="text-sm text-brown-400">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
