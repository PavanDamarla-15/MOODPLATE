import type { VercelRequest, VercelResponse } from '@vercel/node';

const menu = [
  {
    name: 'Creamy Mushroom Pasta',
    price: 289,
    cuisine: 'Italian',
    diet: 'Vegetarian',
    moods: ['Comfort', 'Hungry'],
    prepTime: 25,
    description: 'Creamy pasta with mushrooms, garlic, and parmesan.',
  },
  {
    name: 'Paneer Tikka Wrap',
    price: 189,
    cuisine: 'Indian',
    diet: 'Vegetarian',
    moods: ['Spicy', 'Hungry', 'Late Night'],
    prepTime: 20,
    description: 'Spicy grilled paneer wrapped with mint chutney and onions.',
  },
  {
    name: 'Butter Chicken Bowl',
    price: 349,
    cuisine: 'Indian',
    diet: 'Non-Vegetarian',
    moods: ['Comfort', 'Celebrating', 'Hungry'],
    prepTime: 35,
    description: 'Chicken in tomato-butter gravy with basmati rice.',
  },
  {
    name: 'Wood-Fired Margherita Pizza',
    price: 399,
    cuisine: 'Italian',
    diet: 'Vegetarian',
    moods: ['Comfort', 'Celebrating', 'Hungry'],
    prepTime: 30,
    description: 'Classic pizza with tomato, mozzarella, and basil.',
  },
  {
    name: 'Spicy Tonkotsu Ramen',
    price: 329,
    cuisine: 'Asian',
    diet: 'Non-Vegetarian',
    moods: ['Spicy', 'Comfort', 'Late Night'],
    prepTime: 30,
    description: 'Rich ramen with chili oil, noodles, and soft-boiled egg.',
  },
  {
    name: 'Garden Quinoa Buddha Bowl',
    price: 249,
    cuisine: 'Healthy',
    diet: 'Vegan',
    moods: ['Healthy'],
    prepTime: 15,
    description: 'Quinoa, roasted vegetables, avocado, chickpeas, and tahini.',
  },
  {
    name: 'Loaded Cheeseburger',
    price: 299,
    cuisine: 'Fast Food',
    diet: 'Non-Vegetarian',
    moods: ['Hungry', 'Late Night'],
    prepTime: 20,
    description: 'Beef burger with cheddar, onions, sauce, and fries.',
  },
  {
    name: 'Street-Style Taco Platter',
    price: 279,
    cuisine: 'Mexican',
    diet: 'Non-Vegetarian',
    moods: ['Spicy', 'Celebrating', 'Hungry'],
    prepTime: 25,
    description: 'Chicken tacos with salsa, guacamole, and lime.',
  },
  {
    name: 'Steamed Veg Momos',
    price: 149,
    cuisine: 'Asian',
    diet: 'Vegetarian',
    moods: ['Hungry', 'Healthy', 'Late Night'],
    prepTime: 20,
    description: 'Steamed vegetable dumplings with spicy chutney.',
  },
  {
    name: 'Chocolate Lava Cake',
    price: 199,
    cuisine: 'Italian',
    diet: 'Vegetarian',
    moods: ['Celebrating', 'Comfort'],
    prepTime: 15,
    description: 'Warm chocolate cake with a molten chocolate center.',
  },
  {
    name: 'Paneer Butter Masala',
    price: 259,
    cuisine: 'Indian',
    diet: 'Vegetarian',
    moods: ['Comfort', 'Celebrating', 'Hungry'],
    prepTime: 30,
    description: 'Paneer in creamy tomato-cashew gravy with butter.',
  },
  {
    name: 'Vietnamese Beef Pho',
    price: 319,
    cuisine: 'Asian',
    diet: 'Non-Vegetarian',
    moods: ['Comfort', 'Healthy'],
    prepTime: 40,
    description: 'Beef broth with rice noodles, sliced beef, and herbs.',
  },
  {
    name: 'Grilled Chicken Power Salad',
    price: 229,
    cuisine: 'Healthy',
    diet: 'Non-Vegetarian',
    moods: ['Healthy'],
    prepTime: 15,
    description: 'Greens with grilled chicken, avocado, quinoa, and lemon dressing.',
  },
  {
    name: 'Black Bean Veg Tacos',
    price: 189,
    cuisine: 'Mexican',
    diet: 'Vegan',
    moods: ['Spicy', 'Healthy', 'Hungry'],
    prepTime: 18,
    description: 'Black bean tacos with corn salsa, avocado, and pickled onions.',
  },
];

const dishIdMap: Record<string, string> = {
  'Creamy Mushroom Pasta': 'creamy-mushroom-pasta',
  'Paneer Tikka Wrap': 'paneer-tikka-wrap',
  'Butter Chicken Bowl': 'butter-chicken-bowl',
  'Wood-Fired Margherita Pizza': 'margherita-pizza',
  'Spicy Tonkotsu Ramen': 'spicy-ramen-bowl',
  'Garden Quinoa Buddha Bowl': 'veggie-quinoa-bowl',
  'Loaded Cheeseburger': 'loaded-beef-burger',
  'Street-Style Taco Platter': 'mexican-taco-platter',
  'Steamed Veg Momos': 'steamed-momo-platter',
  'Chocolate Lava Cake': 'chocolate-lava-cake',
  'Paneer Butter Masala': 'paneer-butter-masala',
  'Vietnamese Beef Pho': 'vietnamese-pho',
  'Grilled Chicken Power Salad': 'grilled-chicken-salad',
  'Black Bean Veg Tacos': 'spicy-veg-tacos',
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  try {
    const {
      message,
      history = [],
      candidateDishNames = [],
    } = req.body ?? {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required',
      });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL;

    if (!apiKey || !model) {
      return res.status(500).json({
        error: 'OpenRouter configuration is missing',
      });
    }

    /*
     * IMPORTANT:
     * The frontend recommendation engine has already selected
     * the dishes that satisfy the user's requirements.
     *
     * The AI is NOT allowed to select different dishes.
     */
    const candidates = Array.isArray(candidateDishNames)
      ? candidateDishNames
          .filter((name: unknown): name is string =>
            typeof name === 'string'
          )
          .map((name: string) =>
            menu.find((dish) => dish.name === name)
          )
          .filter((dish): dish is (typeof menu)[number] =>
            Boolean(dish)
          )
      : [];

    const candidateMenu = candidates;

    // No valid dishes means the user's hard constraints cannot be satisfied.
    // Do not call the AI or allow it to invent an alternative.
    if (candidateMenu.length === 0) {
      return res.status(200).json({
        message:
          "I couldn't find a dish that matches all of those requirements. 😕 Try relaxing one requirement, such as increasing your budget, allowing more preparation time, or choosing another cuisine.",
        dishIds: [],
      });
    }

    const systemPrompt = `
You are MOODPLATE AI, the food recommendation assistant.

IMPORTANT:
The recommendation engine has already selected the valid dishes.

You MUST NOT choose a different dish.

You MUST NOT invent dishes.

You MUST NOT recommend dishes outside the CANDIDATE DISHES list below.

Your job is ONLY to explain the candidate dishes and respond naturally to the user's request.

If candidate dishes are provided, recommend only from those candidates.

If the user asks for a dish that is not available, explain that it is not currently available.

CANDIDATE DISHES:
${JSON.stringify(candidateMenu, null, 2)}

Keep responses friendly, concise, and useful.

Use exact dish names and prices.

IMPORTANT RESPONSE FORMAT:
- Do NOT use Markdown links.
- Do NOT include image URLs.
- Do NOT include HTML.
- Do NOT create buttons or links.
- Do NOT repeat the full dish card information.
- Do NOT include ratings, image URLs, or extra metadata unless specifically asked.
- Mention dish names and prices naturally in your response.
- The MOODPLATE website will display the dish cards separately.
`;

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer':
            process.env.APP_URL || 'http://localhost:3000',
          'X-Title': 'MOODPLATE AI',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            ...history,
            {
              role: 'user',
              content: message,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      return res.status(response.status).json({
        error: 'OpenRouter request failed',
        details: errorText,
      });
    }

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      'Here are some dishes that match your preferences.';

    /*
     * Return ONLY the candidate dish IDs.
     *
     * We no longer scan the AI's text looking for dish names.
     * This prevents the AI from accidentally adding another dish.
     */
    const dishIds = candidates
      .map((dish) => dishIdMap[dish.name])
      .filter(Boolean);

    return res.status(200).json({
      message: reply,
      dishIds,
    });
  } catch (error) {
    console.error('MOODPLATE AI error:', error);

    return res.status(500).json({
      error: 'Something went wrong while contacting the AI.',
    });
  }
}
