import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dishes, parseMenuQuery } from '../src/data/dishes';
import type { Dish } from '../src/data/dishes';

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
      queryType,
    } = req.body ?? {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required',
      });
    }

    const trimmedMessage = message.trim();
    const parsedQuery = parseMenuQuery(trimmedMessage, dishes);
    const isDirectAvailability = queryType === 'availability' || parsedQuery.isDirectDishQuery;

    // If the user is asking about the availability of a specific dish and it's not on the menu:
    if (isDirectAvailability && parsedQuery.matches.length === 0) {
      const requestedName = parsedQuery.requestedItem || trimmedMessage;
      return res.status(200).json({
        message: `Sorry, **${requestedName}** is not available on our menu. We do not currently serve this item.`,
        dishIds: [],
      });
    }

    // Resolve candidates using actual dish data from src/data/dishes.ts
    let candidateMenu: Dish[] = [];

    if (Array.isArray(candidateDishNames) && candidateDishNames.length > 0) {
      candidateMenu = candidateDishNames
        .filter((name: unknown): name is string => typeof name === 'string' && name.trim().length > 0)
        .map((name: string) => {
          const lower = name.trim().toLowerCase();
          return dishes.find(
            (dish) => dish.name.toLowerCase() === lower || dish.id.toLowerCase() === lower
          );
        })
        .filter((dish): dish is Dish => Boolean(dish));
    }

    // If no candidates were passed from frontend, derive them from parsed query
    if (candidateMenu.length === 0) {
      if (parsedQuery.isDirectDishQuery && parsedQuery.matches.length > 0) {
        candidateMenu = parsedQuery.matches.slice(0, 4);
      }
    }

    // If still no valid dishes can be found:
    if (candidateMenu.length === 0) {
      if (isDirectAvailability) {
        const requestedName = parsedQuery.requestedItem || trimmedMessage;
        return res.status(200).json({
          message: `Sorry, **${requestedName}** is not available on our menu. We do not currently serve this item.`,
          dishIds: [],
        });
      }

      return res.status(200).json({
        message:
          "I couldn't find a dish that matches all of those requirements. 😕 Try relaxing one requirement, such as increasing your budget, allowing more preparation time, or choosing another cuisine.",
        dishIds: [],
      });
    }

    const candidatePromptData = candidateMenu.map((d) => ({
      id: d.id,
      name: d.name,
      price: d.price,
      cuisine: d.cuisine,
      diet: d.diet,
      moods: d.moods,
      prepTime: d.prepTime,
      description: d.description,
      rating: d.rating,
      spiceLevel: d.spiceLevel,
    }));

    const systemPrompt = `
You are MOODPLATE AI, the intelligent food recommendation and menu assistant for the MOODPLATE restaurant.

IMPORTANT MENU AVAILABILITY RULES:
- The actual restaurant menu dishes available for this request are listed below in CANDIDATE DISHES.
- You MUST NOT recommend or invent dishes outside the CANDIDATE DISHES list.
- Do NOT suggest unrelated dishes if the user is asking about the availability of a specific item.
- If the user asks whether a specific dish is available and it is in CANDIDATE DISHES, confirm enthusiastically that it is available on our menu, and share its details (price in ₹, description, preparation time).
- If the user asks for suggestions or recommendations, recommend from the CANDIDATE DISHES list explaining why they match the user's mood or request.
- Keep responses friendly, concise, and appetizing.
- Always use the exact dish names and prices in ₹ (Rupees) as provided.

CANDIDATE DISHES:
${JSON.stringify(candidatePromptData, null, 2)}

RESPONSE GUIDELINES:
- Do NOT use Markdown links, image URLs, or HTML.
- Mention dish names and prices naturally.
- The website will display interactive dish cards for these dishes automatically.
`;

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL;

    // Helper for generating deterministic fallback response if OpenRouter is unreachable
    const generateFallbackReply = (): string => {
      if (isDirectAvailability) {
        if (candidateMenu.length === 1) {
          const item = candidateMenu[0];
          return `Yes! We have **${item.name}** available on our menu for ₹${item.price}. ${item.description}`;
        }
        return `Yes! We have the following matching options available on our menu:\n\n${candidateMenu
          .map((d) => `• **${d.name}** (₹${d.price}) — ${d.description}`)
          .join('\n')}`;
      }

      const top = candidateMenu[0];
      const others = candidateMenu.slice(1);
      let reply = `Here are some great options matching your preferences:\n\n**${top.name}** (₹${top.price}) — ${top.description}`;
      if (others.length > 0) {
        reply += `\n\nOther delicious choices: ${others.map((d) => `**${d.name}** (₹${d.price})`).join(', ')}.`;
      }
      return reply;
    };

    if (!apiKey || !model) {
      return res.status(200).json({
        message: generateFallbackReply(),
        dishIds: candidateMenu.map((d) => d.id),
      });
    }

    try {
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
                content: trimmedMessage,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        console.warn('OpenRouter API returned error, falling back to deterministic response');
        return res.status(200).json({
          message: generateFallbackReply(),
          dishIds: candidateMenu.map((d) => d.id),
        });
      }

      const data = await response.json();
      const reply =
        data?.choices?.[0]?.message?.content ||
        generateFallbackReply();

      return res.status(200).json({
        message: reply,
        dishIds: candidateMenu.map((d) => d.id),
      });
    } catch (fetchErr) {
      console.warn('Failed to call OpenRouter, falling back to deterministic response:', fetchErr);
      return res.status(200).json({
        message: generateFallbackReply(),
        dishIds: candidateMenu.map((d) => d.id),
      });
    }
  } catch (error) {
    console.error('MOODPLATE AI error:', error);
    return res.status(500).json({
      error: 'Something went wrong while contacting the AI.',
    });
  }
}
