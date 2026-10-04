import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, ArrowRight, Lightbulb, UtensilsCrossed } from 'lucide-react';
import { dishes, scoreDish, recommendDishes } from '@/data/dishes';
import type { Dish, Preferences, Mood, Cuisine, BudgetRange } from '@/data/dishes';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { Page } from '@/components/Navbar';

interface MoodAIPageProps {
  onNavigate: (page: Page) => void;
  onViewDish: (dish: Dish) => void;
}

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  dishes?: Dish[];
}

const quickChips = [
  'Something spicy 🌶️',
  'Comfort food 😌',
  'Under ₹200 💰',
  'Healthy 🥗',
  'Late night 🌙',
];

function analyzeMessage(text: string): { prefs: Preferences; detected: string[] } {
  const q = text.toLowerCase();
  const moods: Mood[] = [];
  const cuisines: Cuisine[] = [];
  const detected: string[] = [];

  if (/spic|hot|chili|chilli|fire/.test(q)) { moods.push('Spicy'); detected.push('spicy'); }
  if (/comfort|cozy|warm|home|tired|sad|stress/.test(q)) { moods.push('Comfort'); detected.push('comfort'); }
  if (/health|fit|clean|light|nutrit|salad|protein/.test(q)) { moods.push('Healthy'); detected.push('healthy'); }
  if (/hungry|starv|quick|fast|filling|satisfy/.test(q)) { moods.push('Hungry'); detected.push('hungry'); }
  if (/celebr|party|special|treat|birthday/.test(q)) { moods.push('Celebrating'); detected.push('celebrating'); }
  if (/late night|midnight|night|craving|2am|3am/.test(q)) { moods.push('Late Night'); detected.push('late night'); }

  if (/indian|curry|paneer|tikka|biryani|naan/.test(q)) { cuisines.push('Indian'); detected.push('Indian'); }
  if (/italian|pasta|pizza|risotto/.test(q)) { cuisines.push('Italian'); detected.push('Italian'); }
  if (/asian|noodle|ramen|pho|dumpling|momo|chinese|japanese|thai/.test(q)) { cuisines.push('Asian'); detected.push('Asian'); }
  if (/mexican|taco|burrito|quesadilla/.test(q)) { cuisines.push('Mexican'); detected.push('Mexican'); }
  if (/fast food|burger|fries|junk/.test(q)) { cuisines.push('Fast Food'); detected.push('fast food'); }

  let budget: BudgetRange | null = null;
  if (/under 150|cheap|budget/.test(q)) { budget = 'Under ₹150'; detected.push('under ₹150'); }
  else if (/under 200|under 250/.test(q)) { budget = '₹150–₹250'; detected.push('under ₹250'); }
  else if (/under 300|under 350|under 400/.test(q)) { budget = '₹250–₹400'; detected.push('under ₹400'); }
  else if (/400|expensive|premium|fancy/.test(q)) { budget = '₹400+'; detected.push('premium'); }

  const prefs: Preferences = { moods, cuisines, budget, time: null };

  if (/vegetarian|veggie|veg /.test(q) && !/non.?veg/.test(q)) {
    detected.push('vegetarian');
  }
  if (/vegan/.test(q)) {
    detected.push('vegan');
  }
  if (/quick|fast|under 20|10 min|15 min/.test(q)) {
    detected.push('quick');
  }

  return { prefs, detected };
}

function generateResponse(text: string): ChatMessage {
  const { prefs, detected } = analyzeMessage(text);

  if (detected.length === 0) {
    return {
      role: 'ai',
      content: "I'd love to help you find something delicious! Could you tell me a bit more — what mood are you in (spicy, comfort, healthy, hungry), what cuisine you prefer (Indian, Italian, Asian, Mexican), your budget (under ₹200, under ₹400), or how much time you have? For example: 'I want something spicy and vegetarian under ₹200.'",
    };
  }

  const isVeg = /vegetarian|veggie|vegan/.test(text.toLowerCase()) && !/non.?veg/.test(text.toLowerCase());
  const isVegan = /vegan/.test(text.toLowerCase());

  let filteredDishes = dishes;
  if (isVegan) {
    filteredDishes = dishes.filter((d) => d.diet === 'Vegan');
  } else if (isVeg) {
    filteredDishes = dishes.filter((d) => d.diet === 'Vegetarian' || d.diet === 'Vegan');
  }

  const scored = filteredDishes
    .map((d) => {
      const { score, reasons } = scoreDish(d, prefs);
      return { dish: d, score, reasons };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    const fallback = recommendDishes(prefs, [], 3);
    if (fallback.length > 0) {
      return {
        role: 'ai',
        content: `I couldn't find a perfect match for everything, but based on what you said, here are some options you might enjoy:`,
        dishes: fallback.map((f) => f.dish),
      };
    }
    return {
      role: 'ai',
      content: "I'd love to help! Could you tell me more about what you're in the mood for? Try something like: 'I want something spicy and vegetarian under ₹200' or 'comfort food, Italian, under 30 minutes.'",
    };
  }

  const top = scored[0];
  const moreOptions = scored.slice(1, 3).map((s) => s.dish);

  const detectedStr = detected.slice(0, 4).join(', ');
  let content = `Got you! 🍽️\n\nYou're looking for something ${detectedStr}.\n\nMy top match for you is:\n\n**${top.dish.name}**\n₹${top.dish.price} · ⭐ ${top.dish.rating} · ${top.dish.prepTime} min\n\n${top.reasons.slice(0, 2).join('. ')}.\n\nWant to explore more options?`;

  return { role: 'ai', content, dishes: [top.dish, ...moreOptions] };
}

export function MoodAIPage({ onNavigate, onViewDish }: MoodAIPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ai',
      content: "Hey! I'm MOODPLATE AI. Tell me what you're craving — your mood, budget, dietary preferences, or how much time you have — and I'll find your perfect dish. Try one of the suggestions below or type your own!",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setInput('');
    setTyping(true);

    try {
      const history = messages.map((msg) => ({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.content,
      }));

      const response = await fetch('/api/mood-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          history,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'AI request failed');
      }

      const recommendedDishes: Dish[] = Array.isArray(data.dishIds)
        ? data.dishIds
            .map((id: string): Dish | undefined =>
              dishes.find((dish: Dish) => dish.id === id)
            )
            .filter((dish: Dish | undefined): dish is Dish => Boolean(dish))
        : [];

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: data.message || 'Sorry, I could not generate a response.',
          dishes: recommendedDishes,
        },
      ]);
    } catch (error) {
      console.error('MOODPLATE AI error:', error);

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: 'Sorry, something went wrong while connecting to MOODPLATE AI. Please try again.',
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="pt-28 pb-20 section-pad min-h-screen flex flex-col">
      <div className="mx-auto max-w-3xl w-full flex-1 flex flex-col">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-coral-50 border border-coral-200 px-4 py-1.5 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-coral-500" />
              <span className="text-xs font-bold text-coral-600 tracking-wide">MOODPLATE AI</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brown-900">Tell me what you're craving.</h1>
            <p className="mt-3 text-brown-500 max-w-lg mx-auto">
              Describe your mood, cravings, budget, dietary preferences, or how much time you have.
            </p>
          </div>
        </div>

        {/* CHAT CONTAINER */}
        <div className="flex-1 card flex flex-col overflow-hidden" style={{ minHeight: '400px', maxHeight: 'calc(100vh - 320px)' }}>
          <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`}>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0 ${
                  msg.role === 'ai'
                    ? 'bg-gradient-to-br from-coral-400 to-coral-600'
                    : 'bg-gradient-to-br from-brown-500 to-brown-700'
                }`}>
                  {msg.role === 'ai' ? <Sparkles className="h-4 w-4 text-white" /> : <span className="text-xs font-bold text-white">You</span>}
                </div>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                  {msg.role === 'ai' && (
                    <p className="text-xs font-bold text-coral-600 mb-1">MOODPLATE AI</p>
                  )}
                  <div className={`rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-coral-500/10 border border-coral-200'
                      : 'bg-cream-100 border border-cream-200'
                  }`}>
                    <p className="text-sm text-brown-700 whitespace-pre-line">{msg.content}</p>
                  </div>

                  {msg.dishes && msg.dishes.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.dishes.map((d) => (
                        <div key={d.id} className="group flex items-center gap-3 rounded-2xl bg-white border border-cream-200 p-2.5 transition-all hover:border-coral-300 hover:shadow-soft">
                          <div className="h-11 w-11 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={d.image} alt={d.name} className="h-full w-full object-cover" loading="lazy" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-brown-900 truncate">{d.name}</p>
                            <p className="text-2xs text-brown-400">₹{d.price} · ⭐ {d.rating} · {d.prepTime} min</p>
                          </div>
                          <button
                            onClick={() => onViewDish(d)}
                            className="rounded-lg bg-coral-50 p-1.5 text-coral-600 transition-all hover:bg-coral-100"
                          >
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => onNavigate('find')} className="btn-secondary !py-2 !px-3 text-xs">
                          <UtensilsCrossed className="h-3 w-3" />
                          Explore More
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-3 animate-fade-in">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-coral-400 to-coral-600 flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-coral-600 mb-1">MOODPLATE AI</p>
                  <div className="rounded-2xl bg-cream-100 border border-cream-200 px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-coral-400 animate-typing-dot" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 rounded-full bg-coral-400 animate-typing-dot" style={{ animationDelay: '200ms' }} />
                      <span className="h-2 w-2 rounded-full bg-coral-400 animate-typing-dot" style={{ animationDelay: '400ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {messages.length <= 1 && !typing && (
            <div className="border-t border-cream-200 p-3 sm:p-4">
              <p className="flex items-center gap-1.5 text-xs text-brown-400 mb-2 px-1">
                <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                Try asking:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSend(chip)}
                    className="rounded-full border border-cream-200 bg-white px-3 py-1.5 text-xs font-medium text-brown-500 transition-all hover:border-coral-300 hover:bg-coral-50 hover:text-coral-600"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-cream-200 p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Tell me what you're craving..."
                className="input-field !py-2.5 text-sm"
                disabled={typing}
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || typing}
                className="rounded-xl bg-gradient-to-br from-coral-500 to-coral-600 p-2.5 text-white transition-all hover:shadow-coral active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
