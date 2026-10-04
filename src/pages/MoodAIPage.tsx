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

function analyzeMessage(text: string): {
  prefs: Preferences;
  detected: string[];
} {
  const q = text.toLowerCase();

  const moods: Mood[] = [];
  const cuisines: Cuisine[] = [];
  const detected: string[] = [];

  // -----------------------------
  // MOOD
  // -----------------------------

  if (/spic|hot|chili|chilli|fire/.test(q)) {
    moods.push('Spicy');
    detected.push('spicy');
  }

  if (/comfort|cozy|warm|home|tired|sad|stress/.test(q)) {
    moods.push('Comfort');
    detected.push('comfort');
  }

  if (/health|fit|clean|light|nutrit|salad|protein/.test(q)) {
    moods.push('Healthy');
    detected.push('healthy');
  }

  if (/hungry|starv|filling|satisfy/.test(q)) {
    moods.push('Hungry');
    detected.push('hungry');
  }

  if (/celebr|party|special|treat|birthday/.test(q)) {
    moods.push('Celebrating');
    detected.push('celebrating');
  }

  if (/late.?night|midnight|2am|3am|night craving/.test(q)) {
    moods.push('Late Night');
    detected.push('late night');
  }

  // -----------------------------
  // CUISINE
  // -----------------------------

  if (/indian|curry|paneer|tikka|biryani|naan/.test(q)) {
    cuisines.push('Indian');
    detected.push('Indian');
  }

  if (/italian|pasta|pizza|risotto/.test(q)) {
    cuisines.push('Italian');
    detected.push('Italian');
  }

  if (/asian|noodle|ramen|pho|dumpling|momo|chinese|japanese|thai/.test(q)) {
    cuisines.push('Asian');
    detected.push('Asian');
  }

  if (/mexican|taco|burrito|quesadilla/.test(q)) {
    cuisines.push('Mexican');
    detected.push('Mexican');
  }

  if (/fast food|burger|fries|junk/.test(q)) {
    cuisines.push('Fast Food');
    detected.push('Fast Food');
  }

  // -----------------------------
  // DIET
  // -----------------------------

  let diet: Preferences['diet'] = null;

  if (/vegan/.test(q)) {
    diet = 'Vegan';
    detected.push('vegan');
  } else if (
    /vegetarian|veggie|veg\b/.test(q) &&
    !/non.?veg/.test(q)
  ) {
    diet = 'Vegetarian';
    detected.push('vegetarian');
  } else if (/non.?veg|nonvegetarian|chicken|mutton|beef|fish|seafood/.test(q)) {
    diet = 'Non-Vegetarian';
    detected.push('non-vegetarian');
  }

  // -----------------------------
  // EXACT BUDGET
  // -----------------------------

  let budget: BudgetRange | null = null;
  let maxPrice: number | null = null;

  const budgetMatch = q.match(
    /(?:under|below|less than|max(?:imum)?|within)\s*₹?\s*(\d+)/
  );

  if (budgetMatch) {
    maxPrice = Number(budgetMatch[1]);

    if (maxPrice < 150) {
      budget = 'Under ₹150';
    } else if (maxPrice < 250) {
      budget = '₹150–₹250';
    } else if (maxPrice < 400) {
      budget = '₹250–₹400';
    } else {
      budget = '₹400+';
    }

    detected.push(`under ₹${maxPrice}`);
  } else if (/cheap|budget/.test(q)) {
    maxPrice = 200;
    budget = '₹150–₹250';
    detected.push('budget-friendly');
  } else if (/premium|expensive|fancy/.test(q)) {
    budget = '₹400+';
    detected.push('premium');
  }

  // -----------------------------
  // EXACT PREPARATION TIME
  // -----------------------------

  let maxPrepTime: number | null = null;
  let exactTimeAllowed = false;

  const strictTimeMatch = q.match(
    /(?:under|below|less than)\s*(\d+)\s*(?:min|mins|minutes)/
  );

  const inclusiveTimeMatch = q.match(
    /(?:within|in|maximum of|up to|at most)\s*(\d+)\s*(?:min|mins|minutes)/
  );

  const exactTimeMatch = q.match(
    /(?:exactly|around)\s*(\d+)\s*(?:min|mins|minutes)/
  );

  if (strictTimeMatch) {
    maxPrepTime = Number(strictTimeMatch[1]);
    exactTimeAllowed = false;
    detected.push(`under ${maxPrepTime} minutes`);
  } else if (inclusiveTimeMatch) {
    maxPrepTime = Number(inclusiveTimeMatch[1]);
    exactTimeAllowed = true;
    detected.push(`within ${maxPrepTime} minutes`);
  } else if (exactTimeMatch) {
    maxPrepTime = Number(exactTimeMatch[1]);
    exactTimeAllowed = true;
    detected.push(`around ${maxPrepTime} minutes`);
  } else if (/quick|fast|in a hurry/.test(q)) {
    maxPrepTime = 20;
    exactTimeAllowed = false;
    detected.push('quick');
  }

  // -----------------------------
  // SPICE LEVEL
  // -----------------------------

  let minSpiceLevel: number | null = null;

  if (/extremely spicy|very spicy|extra spicy|super spicy/.test(q)) {
    minSpiceLevel = 3;
    detected.push('very spicy');
  } else if (/spicy|hot|chili|chilli|fire/.test(q)) {
    minSpiceLevel = 2;
  }

  // -----------------------------
  // BUILD PREFERENCES
  // -----------------------------

  const prefs: Preferences = {
    moods,
    cuisines,
    budget,
    time: null,
    diet,
    maxPrice,
    maxPrepTime,
    exactTimeAllowed,
    minSpiceLevel,
  };

  return {
    prefs,
    detected,
  };
}

function generateResponse(text: string): ChatMessage {
  const { prefs, detected } = analyzeMessage(text);

  if (detected.length === 0) {
    return {
      role: 'ai',
      content:
        "I'd love to help you find something delicious! Tell me your mood, cuisine, dietary preference, budget, spice level, or preparation time. For example: \"I want spicy vegetarian food under ₹200.\"",
    };
  }

  // Use the new recommendation engine.
  const recommendations = recommendDishes(
    prefs,
    [],
    3
  );

  // No exact matches.
  if (recommendations.length === 0) {
    return {
      role: 'ai',
      content:
        `I couldn't find a dish that satisfies all of those requirements. 😕\n\nYou asked for: ${detected.slice(0, 6).join(', ')}.\n\nTry relaxing one requirement, such as increasing your budget or preparation time.`,
    };
  }

  const top = recommendations[0];

  const moreOptions = recommendations
    .slice(1)
    .map((item) => item.dish);

  const detectedStr = detected
    .slice(0, 6)
    .join(', ');

  const reasons = top.reasons
    .slice(0, 3)
    .join('. ');

  const content =
    `Got you! 🍽️\n\n` +
    `You're looking for: ${detectedStr}.\n\n` +
    `My top match is:\n\n` +
    `**${top.dish.name}**\n` +
    `₹${top.dish.price} · ⭐ ${top.dish.rating} · ${top.dish.prepTime} min\n\n` +
    `${reasons}.\n\n` +
    `Here are some more matching options:`;

  return {
    role: 'ai',
    content,
    dishes: [
      top.dish,
      ...moreOptions,
    ],
  };
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

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: trimmed },
    ]);

    setInput('');
    setTyping(true);

    try {
      /*
       * STEP 1:
       * Understand the user's request locally.
       *
       * This gives us hard constraints such as:
       * - vegetarian
       * - vegan
       * - maximum price
       * - maximum preparation time
       * - minimum spice level
       * - cuisine
       * - mood
       */
      const { prefs, detected } =
        analyzeMessage(trimmed);

      /*
       * STEP 2:
       * Let our deterministic recommendation engine
       * choose the valid dishes.
       *
       * The AI will NOT make this decision.
       */
      const recommendations = recommendDishes(
        prefs,
        [],
        3
      );

      const candidateDishes =
        recommendations.map(
          (recommendation) =>
            recommendation.dish
        );

      const candidateDishNames =
        candidateDishes.map(
          (dish) => dish.name
        );

      /*
       * STEP 3:
       * Prepare conversation history.
       */
      const history = messages.map((msg) => ({
        role:
          msg.role === 'ai'
            ? 'assistant'
            : 'user',
        content: msg.content,
      }));

      /*
       * STEP 4:
       * Send the selected candidates to the AI.
       *
       * The API is instructed to explain ONLY these dishes.
       */
      const response = await fetch(
        '/api/mood-ai',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            message: trimmed,
            history,
            candidateDishNames,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            'AI request failed'
        );
      }

      /*
       * STEP 5:
       * Use the candidate dishes selected
       * by our recommendation engine.
       *
       * We no longer depend on the AI's
       * response text to discover dishes.
       */
      const recommendedDishes: Dish[] =
        candidateDishes;

      /*
       * If there are no valid candidates,
       * show a clear message instead of
       * allowing the AI to invent alternatives.
       */
      let aiContent =
        data.message ||
        'Sorry, I could not generate a response.';

      if (
        recommendations.length === 0
      ) {
        aiContent =
          `I couldn't find a dish that satisfies all of your requirements. 😕\n\n` +
          `You asked for: ${
            detected.length > 0
              ? detected
                  .slice(0, 6)
                  .join(', ')
              : trimmed
          }.\n\n` +
          `Try relaxing one requirement, such as increasing your budget or preparation time.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: aiContent,
          dishes:
            recommendedDishes,
        },
      ]);
    } catch (error) {
      console.error(
        'MOODPLATE AI error:',
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content:
            'Sorry, something went wrong while connecting to MOODPLATE AI. Please try again.',
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
			                   <p className="text-sm text-brown-700 whitespace-pre-line">
			  {msg.content.split(/(\*\*.*?\*\*)/g).map((part, i) =>
			    part.startsWith('**') && part.endsWith('**') ? (
			      <strong key={i}>{part.slice(2, -2)}</strong>
			    ) : (
			      part
			    )
			  )}
	</p>
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
