import { Star, Clock, IndianRupee, Leaf, Drumstick, Flame, Info, X } from 'lucide-react';
import type { Dish } from '@/data/dishes';
import { Modal } from './Modal';

interface DishDetailModalProps {
  dish: Dish | null;
  onClose: () => void;
}

export function DishDetailModal({ dish, onClose }: DishDetailModalProps) {
  if (!dish) return null;

  return (
    <Modal open={!!dish} onClose={onClose} maxWidth="max-w-lg">
      <div className="relative h-56 overflow-hidden rounded-t-3xl">
        <img src={dish.image} alt={dish.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-cream-50 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-brown-900">{dish.name}</h2>
            <p className="text-sm text-brown-500">{dish.cuisine} · {dish.diet}</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 shadow-soft">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-brown-800">{dish.rating}</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <p className="text-sm text-brown-600 leading-relaxed">{dish.description}</p>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-cream-100 p-3 text-center">
            <IndianRupee className="mx-auto h-4 w-4 text-coral-500 mb-1" />
            <p className="text-2xs text-brown-400">Price</p>
            <p className="text-sm font-bold text-brown-800">₹{dish.price}</p>
          </div>
          <div className="rounded-2xl bg-cream-100 p-3 text-center">
            <Clock className="mx-auto h-4 w-4 text-coral-500 mb-1" />
            <p className="text-2xs text-brown-400">Prep Time</p>
            <p className="text-sm font-bold text-brown-800">{dish.prepTime} min</p>
          </div>
          <div className="rounded-2xl bg-cream-100 p-3 text-center">
            {dish.diet === 'Non-Vegetarian' ? (
              <Drumstick className="mx-auto h-4 w-4 text-coral-500 mb-1" />
            ) : (
              <Leaf className="mx-auto h-4 w-4 text-sage-500 mb-1" />
            )}
            <p className="text-2xs text-brown-400">Diet</p>
            <p className="text-sm font-bold text-brown-800">{dish.diet}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {dish.moods.map((m) => (
            <span key={m} className="chip bg-coral-50 text-coral-600 border border-coral-200">
              {m}
            </span>
          ))}
          {dish.spiceLevel > 0 && (
            <span className="chip bg-red-50 text-red-500 border border-red-200">
              {'🌶️'.repeat(Math.min(dish.spiceLevel, 3))} Spicy
            </span>
          )}
        </div>

        <div className="rounded-2xl bg-cream-100 border border-cream-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-coral-500" />
            <h3 className="text-sm font-bold text-brown-800">Good to know</h3>
          </div>
          <p className="text-sm text-brown-500">
            Rated {dish.rating} out of 5 by our community. {dish.popularity > 85 ? 'One of our most popular dishes.' : 'A solid choice that hits the spot.'}
          </p>
        </div>

        <button onClick={onClose} className="btn-primary w-full">
          Close
        </button>
      </div>
    </Modal>
  );
}
