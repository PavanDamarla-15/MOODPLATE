export type Mood = 'Hungry' | 'Comfort' | 'Spicy' | 'Celebrating' | 'Healthy' | 'Late Night';
export type Cuisine = 'Indian' | 'Italian' | 'Asian' | 'Mexican' | 'Healthy' | 'Fast Food';
export type BudgetRange = 'Under ₹150' | '₹150–₹250' | '₹250–₹400' | '₹400+';
export type TimeRange = 'Under 20 min' | '20–30 min' | '30–60 min' | '1 hour+';
export type DietType = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan';

export interface Dish {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  prepTime: number;
  cuisine: Cuisine;
  moods: Mood[];
  diet: DietType;
  description: string;
  spiceLevel: number;
  popularity: number;
}

export const dishes: Dish[] = [
  {
    id: 'creamy-mushroom-pasta',
    name: 'Creamy Mushroom Pasta',
    image: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 289,
    rating: 4.6,
    prepTime: 25,
    cuisine: 'Italian',
    moods: ['Comfort', 'Hungry'],
    diet: 'Vegetarian',
    description: 'Silky fettuccine in a rich cream sauce with sautéed mushrooms, garlic, and fresh parmesan. A cozy bowl that wraps you in warmth.',
    spiceLevel: 0,
    popularity: 85,
  },
  {
    id: 'paneer-tikka-wrap',
    name: 'Paneer Tikka Wrap',
    image: 'https://images.pexels.com/photos/30858420/pexels-photo-30858420.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 189,
    rating: 4.7,
    prepTime: 20,
    cuisine: 'Indian',
    moods: ['Spicy', 'Hungry', 'Late Night'],
    diet: 'Vegetarian',
    description: 'Char-grilled paneer in spicy tikka marinade, wrapped in a soft roti with mint chutney and crunchy onions. Bold, filling, and fast.',
    spiceLevel: 3,
    popularity: 92,
  },
  {
    id: 'butter-chicken-bowl',
    name: 'Butter Chicken Bowl',
    image: 'https://images.pexels.com/photos/10615283/pexels-photo-10615283.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 349,
    rating: 4.8,
    prepTime: 35,
    cuisine: 'Indian',
    moods: ['Comfort', 'Celebrating', 'Hungry'],
    diet: 'Non-Vegetarian',
    description: 'Tender chicken in a velvety tomato-butter gravy served over fragrant basmati rice. The ultimate comfort-food crowd pleaser.',
    spiceLevel: 2,
    popularity: 95,
  },
  {
    id: 'margherita-pizza',
    name: 'Wood-Fired Margherita Pizza',
    image: 'https://images.pexels.com/photos/31596394/pexels-photo-31596394.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 399,
    rating: 4.5,
    prepTime: 30,
    cuisine: 'Italian',
    moods: ['Comfort', 'Celebrating', 'Hungry'],
    diet: 'Vegetarian',
    description: 'Classic Neapolitan pizza with San Marzano tomato, fresh mozzarella, and basil on a charred wood-fired crust. Simple perfection.',
    spiceLevel: 0,
    popularity: 88,
  },
  {
    id: 'spicy-ramen-bowl',
    name: 'Spicy Tonkotsu Ramen',
    image: 'https://images.pexels.com/photos/16671586/pexels-photo-16671586.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 329,
    rating: 4.7,
    prepTime: 30,
    cuisine: 'Asian',
    moods: ['Spicy', 'Comfort', 'Late Night'],
    diet: 'Non-Vegetarian',
    description: 'Rich pork-bone broth with chewy noodles, soft-boiled egg, and a fiery chili oil kick. Deep, bold, and soul-warming.',
    spiceLevel: 4,
    popularity: 87,
  },
  {
    id: 'veggie-quinoa-bowl',
    name: 'Garden Quinoa Buddha Bowl',
    image: 'https://images.pexels.com/photos/6978186/pexels-photo-6978186.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 249,
    rating: 4.4,
    prepTime: 15,
    cuisine: 'Healthy',
    moods: ['Healthy'],
    diet: 'Vegan',
    description: 'Protein-packed quinoa with roasted vegetables, avocado, chickpeas, and a zesty tahini dressing. Clean eating that actually tastes great.',
    spiceLevel: 0,
    popularity: 72,
  },
  {
    id: 'loaded-beef-burger',
    name: 'Loaded Cheeseburger',
    image: 'https://images.pexels.com/photos/38896819/pexels-photo-38896819.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 299,
    rating: 4.6,
    prepTime: 20,
    cuisine: 'Fast Food',
    moods: ['Hungry', 'Late Night'],
    diet: 'Non-Vegetarian',
    description: 'Juicy beef patty stacked with melted cheddar, caramelized onions, and house sauce on a brioche bun. Served with crispy fries.',
    spiceLevel: 1,
    popularity: 90,
  },
  {
    id: 'mexican-taco-platter',
    name: 'Street-Style Taco Platter',
    image: 'https://images.pexels.com/photos/27365271/pexels-photo-27365271.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 279,
    rating: 4.5,
    prepTime: 25,
    cuisine: 'Mexican',
    moods: ['Spicy', 'Celebrating', 'Hungry'],
    diet: 'Non-Vegetarian',
    description: 'Three soft corn tacos with seasoned chicken, fresh salsa, guacamole, and a squeeze of lime. A fiesta in every bite.',
    spiceLevel: 3,
    popularity: 83,
  },
  {
    id: 'steamed-momo-platter',
    name: 'Steamed Veg Momos',
    image: 'https://images.pexels.com/photos/18803177/pexels-photo-18803177.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 149,
    rating: 4.5,
    prepTime: 20,
    cuisine: 'Asian',
    moods: ['Hungry', 'Healthy', 'Late Night'],
    diet: 'Vegetarian',
    description: 'Six handmade dumplings filled with seasoned vegetables, served with a fiery red chutney. Light, satisfying, and addictive.',
    spiceLevel: 2,
    popularity: 78,
  },
  {
    id: 'chocolate-lava-cake',
    name: 'Chocolate Lava Cake',
    image: 'https://images.pexels.com/photos/12927134/pexels-photo-12927134.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 199,
    rating: 4.9,
    prepTime: 15,
    cuisine: 'Italian',
    moods: ['Celebrating', 'Comfort'],
    diet: 'Vegetarian',
    description: 'Warm chocolate cake with a molten center, served with vanilla bean ice cream and fresh strawberries. Pure indulgence.',
    spiceLevel: 0,
    popularity: 89,
  },
  {
    id: 'paneer-butter-masala',
    name: 'Paneer Butter Masala',
    image: 'https://images.pexels.com/photos/5127316/pexels-photo-5127316.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 259,
    rating: 4.7,
    prepTime: 30,
    cuisine: 'Indian',
    moods: ['Comfort', 'Celebrating', 'Hungry'],
    diet: 'Vegetarian',
    description: 'Soft paneer cubes simmered in a creamy tomato-cashew gravy with butter and fenugreek. Rich, mild, and deeply satisfying.',
    spiceLevel: 1,
    popularity: 86,
  },
  {
    id: 'vietnamese-pho',
    name: 'Vietnamese Beef Pho',
    image: 'https://images.pexels.com/photos/6646072/pexels-photo-6646072.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 319,
    rating: 4.6,
    prepTime: 40,
    cuisine: 'Asian',
    moods: ['Comfort', 'Healthy'],
    diet: 'Non-Vegetarian',
    description: 'Aromatic beef broth with rice noodles, thinly sliced beef, and fresh herbs. Light yet deeply flavorful — comfort in a bowl.',
    spiceLevel: 1,
    popularity: 75,
  },
  {
    id: 'grilled-chicken-salad',
    name: 'Grilled Chicken Power Salad',
    image: 'https://images.pexels.com/photos/17597485/pexels-photo-17597485.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 229,
    rating: 4.3,
    prepTime: 15,
    cuisine: 'Healthy',
    moods: ['Healthy'],
    diet: 'Non-Vegetarian',
    description: 'Crisp greens topped with grilled chicken, avocado, quinoa, and a light lemon-herb dressing. Nutritious, filling, and fresh.',
    spiceLevel: 0,
    popularity: 68,
  },
  {
    id: 'spicy-veg-tacos',
    name: 'Black Bean Veg Tacos',
    image: 'https://images.pexels.com/photos/7613563/pexels-photo-7613563.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 189,
    rating: 4.4,
    prepTime: 18,
    cuisine: 'Mexican',
    moods: ['Spicy', 'Healthy', 'Hungry'],
    diet: 'Vegan',
    description: 'Crunchy corn tacos loaded with spiced black beans, corn salsa, avocado, and pickled onions. Bold, plant-based, and satisfying.',
    spiceLevel: 2,
    popularity: 70,
  },
];

export const moodData: { id: Mood; emoji: string; label: string; desc: string; color: string }[] = [
  { id: 'Hungry', emoji: '😋', label: 'Hungry', desc: 'Quick & satisfying', color: 'from-coral-400 to-coral-500' },
  { id: 'Comfort', emoji: '😌', label: 'Comfort', desc: 'Warm & comforting', color: 'from-amber-400 to-orange-400' },
  { id: 'Spicy', emoji: '🔥', label: 'Spicy', desc: 'Bring the heat', color: 'from-red-400 to-rose-500' },
  { id: 'Celebrating', emoji: '🥳', label: 'Celebrating', desc: 'Something special', color: 'from-purple-400 to-fuchsia-400' },
  { id: 'Healthy', emoji: '💪', label: 'Healthy', desc: 'Feel-good choices', color: 'from-sage-400 to-sage-500' },
  { id: 'Late Night', emoji: '🌙', label: 'Late Night', desc: 'Midnight cravings', color: 'from-indigo-400 to-blue-500' },
];

export const cuisineData: { id: Cuisine; emoji: string }[] = [
  { id: 'Indian', emoji: '🇮🇳' },
  { id: 'Italian', emoji: '🇮🇹' },
  { id: 'Asian', emoji: '🥢' },
  { id: 'Mexican', emoji: '🌮' },
  { id: 'Healthy', emoji: '🥗' },
  { id: 'Fast Food', emoji: '🍔' },
];

export const budgetData: BudgetRange[] = ['Under ₹150', '₹150–₹250', '₹250–₹400', '₹400+'];
export const timeData: TimeRange[] = ['Under 20 min', '20–30 min', '30–60 min', '1 hour+'];

export function priceToBudget(price: number): BudgetRange {
  if (price < 150) return 'Under ₹150';
  if (price < 250) return '₹150–₹250';
  if (price < 400) return '₹250–₹400';
  return '₹400+';
}

export function prepTimeToRange(minutes: number): TimeRange {
  if (minutes < 20) return 'Under 20 min';
  if (minutes <= 30) return '20–30 min';
  if (minutes <= 60) return '30–60 min';
  return '1 hour+';
}

export interface Preferences {
  moods: Mood[];
  cuisines: Cuisine[];
  budget: BudgetRange | null;
  time: TimeRange | null;
}

export function scoreDish(dish: Dish, prefs: Preferences): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  prefs.moods.forEach((m) => {
    if (dish.moods.includes(m)) {
      score += 4;
      reasons.push(`Matches your "${m.toLowerCase()}" mood`);
    }
  });

  prefs.cuisines.forEach((c) => {
    if (dish.cuisine === c) {
      score += 3;
      reasons.push(`${c} cuisine — exactly what you picked`);
    }
  });

  if (prefs.budget) {
    const dishBudget = priceToBudget(dish.price);
    if (dishBudget === prefs.budget) {
      score += 2;
      reasons.push(`Fits your budget of ${prefs.budget}`);
    }
  }

  if (prefs.time) {
    const dishTime = prepTimeToRange(dish.prepTime);
    if (dishTime === prefs.time) {
      score += 2;
      reasons.push(`Ready in ${dishTime.toLowerCase()} — matches your time preference`);
    }
  }

  return { score, reasons };
}

export function recommendDishes(
  prefs: Preferences,
  exclude: string[] = [],
  count = 4
): { dish: Dish; reasons: string[]; score: number }[] {
  return dishes
    .filter((d) => !exclude.includes(d.id))
    .map((d) => {
      const { score, reasons } = scoreDish(d, prefs);
      return { dish: d, reasons, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
