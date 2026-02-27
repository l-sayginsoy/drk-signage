
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/admin/AdminPanel';
import LandingPage from './pages/LandingPage';
import { AppData, Meal } from './types';
import { initialData } from './data/mockData';

function loadState(): AppData {
  try {
    const storedData = localStorage.getItem('drkMelmData');
    if (storedData) {
      const parsed = JSON.parse(storedData);
      
      // MIGRATION: Remove 'Mittagessen' from the generic meals list
      let loadedMeals = Array.isArray(parsed.meals) ? parsed.meals : initialData.meals;
      loadedMeals = loadedMeals.filter((m: Meal) => m.name !== 'Mittagessen');

      // Safely merge parsed data with initial data
      return {
        currentTheme: parsed.currentTheme || initialData.currentTheme,
        urgentMessage: { ...initialData.urgentMessage, ...(parsed.urgentMessage || {}) },
        meals: loadedMeals,
        lunchMenu: {
            ...initialData.lunchMenu,
            ...(parsed.lunchMenu || {})
        },
        slideshow: {
          ...initialData.slideshow,
          ...(parsed.slideshow || {}),
          durationPerSlide: (parsed.slideshow && parsed.slideshow.durationPerSlide) 
              ? parsed.slideshow.durationPerSlide 
              : initialData.slideshow.durationPerSlide,
          images: (parsed.slideshow && Array.isArray(parsed.slideshow.images))
            ? parsed.slideshow.images
            : initialData.slideshow.images,
        },
        weeklySchedule: parsed.weeklySchedule || initialData.weeklySchedule,
        quotes: Array.isArray(parsed.quotes) ? parsed.quotes : initialData.quotes,
        locations: Array.isArray(parsed.locations) ? parsed.locations : initialData.locations,
        eventTitles: Array.isArray(parsed.eventTitles) ? parsed.eventTitles : initialData.eventTitles,
        menuPlanUrl: parsed.menuPlanUrl || initialData.menuPlanUrl,
        residents: Array.isArray(parsed.residents) ? parsed.residents : initialData.residents,
      };
    }
  } catch (error) {
    console.error("Could not parse localStorage data, using initial data.", error);
  }
  return initialData;
}

const App: React.FC = () => {
  const [appData, setAppData] = useState<AppData>(() => loadState());

  useEffect(() => {
    try {
      localStorage.setItem('drkMelmData', JSON.stringify(appData));
    } catch (error: any) {
      console.error("Could not save data to localStorage.", error);
      if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
        alert("Speicher voll! Bilder konnten nicht gespeichert werden. Bitte löschen Sie alte Bilder aus der Diashow.");
      }
    }
  }, [appData]);

  return (
    <div className="w-full min-h-screen bg-[#f2f2f7]">
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/display" element={<Dashboard appData={appData} />} />
          <Route path="/admin" element={<AdminPanel appData={appData} setAppData={setAppData} />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;
