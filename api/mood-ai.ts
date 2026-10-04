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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history = [] } = req.body ?? {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL;

    if (!apiKey || !model) {
      return res.status(500).json({
        error: 'OpenRouter configuration is missing',
      });
    }

    const systemPrompt = `
You are MOODPLATE AI, the food recommendation assistant for the MOODPLATE website.

IMPORTANT RULE:
You may ONLY recommend dishes that exist in the MOODPLATE menu below.

Never invent a dish, restaurant item, price, rating, or menu item.

If the user asks for a specific food that is NOT in the menu, clearly say that it is not currently available in the MOODPLATE menu and then suggest relevant dishes that ARE in the menu.

For example, if the user asks for biryani and there is no biryani in the menu, do NOT invent Hyderabadi Biryani or any other biryani. Say that biryani is not currently available and recommend suitable Indian dishes from the menu.

MOODPLATE MENU:
${JSON.stringify(menu, null, 2)}

Help users based on:
- craving
- mood
- cuisine
- budget
- dietary preference
- preparation time
- spice preference

When recommending dishes, use the exact dish names and prices from the menu.

Keep responses friendly, concise, and useful.
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
      'Sorry, I could not generate a response.';

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

    const dishIds = Object.entries(dishIdMap)
      .filter(([name]) =>
        reply.toLowerCase().includes(name.toLowerCase())
      )
      .map(([, id]) => id);

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
