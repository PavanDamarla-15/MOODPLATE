import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import type { Page } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DishDetailModal } from '@/components/DishDetailModal';
import { HomePage } from '@/pages/HomePage';
import { FindFoodPage } from '@/pages/FindFoodPage';
import { ResultPage } from '@/pages/ResultPage';
import { MoodAIPage } from '@/pages/MoodAIPage';
import type { Mood, Preferences, Dish } from '@/data/dishes';

type AppPage = Page | 'result';

function App() {
  const [page, setPage] = useState<AppPage>('home');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const handleNavigate = (target: Page) => {
    setPage(target);
  };

  const handleSelectMood = (mood: Mood) => {
    setSelectedMood(mood);
    setPage('find');
  };

  const handleFind = (prefs: Preferences) => {
    setPreferences(prefs);
    setPage('result');
  };

  const handleChangeMood = () => {
    setSelectedMood(null);
    setPage('find');
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [page]);

  return (
    <div className="min-h-screen bg-cream-50 relative flex flex-col">
      <Navbar current={page === 'result' ? 'find' : page} onNavigate={handleNavigate} />

      <main className="relative flex-1">
        {page === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectMood={handleSelectMood}
            onViewDish={setSelectedDish}
          />
        )}
        {page === 'find' && (
          <FindFoodPage
            onNavigate={handleNavigate}
            onFind={handleFind}
            initialMood={selectedMood}
          />
        )}
        {page === 'result' && preferences && (
          <ResultPage
            preferences={preferences}
            onNavigate={handleNavigate}
            onChangeMood={handleChangeMood}
            onViewDish={setSelectedDish}
          />
        )}
        {page === 'ai' && (
          <MoodAIPage
            onNavigate={handleNavigate}
            onViewDish={setSelectedDish}
          />
        )}
      </main>

      {page !== 'ai' && <Footer onNavigate={handleNavigate} />}

      <DishDetailModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
    </div>
  );
}

export default App;
