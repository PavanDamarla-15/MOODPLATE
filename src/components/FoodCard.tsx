import { Star, Clock, IndianRupee, Leaf, Drumstick } from 'lucide-react';
import type { Dish } from '@/data/dishes';

interface FoodCardProps {
  dish: Dish;
  onView?: (dish: Dish) => void;
  compact?: boolean;
}

export function FoodCard({ dish, onView, compact }: FoodCardProps) {
  return (
    <div className="card card-hover overflow-hidden group">
      <div className="relative h-44 overflow-hidden">
        <img
          src={dish.image}
          alt={dish.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 shadow-soft">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-brown-800">{dish.rating}</span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 shadow-soft">
          {dish.diet === 'Vegetarian' || dish.diet === 'Vegan' ? (
            <Leaf className="h-3 w-3 text-sage-500" />
          ) : (
            <Drumstick className="h-3 w-3 text-coral-500" />
          )}
          <span className="text-2xs font-semibold text-brown-600">
            {dish.diet === 'Non-Vegetarian' ? 'Non-Veg' : dish.diet === 'Vegan' ? 'Vegan' : 'Veg'}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-base font-bold text-brown-900 leading-tight">{dish.name}</h3>
          <p className="text-xs text-brown-400 mt-0.5">{dish.cuisine} · {dish.diet}</p>
        </div>

        {!compact && (
          <p className="text-sm text-brown-500 line-clamp-2 leading-relaxed">{dish.description}</p>
        )}

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 text-xs font-medium text-brown-500">
            <span className="flex items-center gap-0.5">
              <IndianRupee className="h-3.5 w-3.5" />
              {dish.price}
            </span>
            <span className="flex items-center gap-0.5">
              <Clock className="h-3.5 w-3.5" />
              {dish.prepTime} min
            </span>
          </div>
        </div>

        <button
          onClick={() => onView?.(dish)}
          className="w-full rounded-full bg-cream-100 py-2.5 text-sm font-bold text-coral-600 transition-all hover:bg-coral-50 hover:text-coral-700"
        >
          View Dish
        </button>
      </div>
    </div>
  );
}
