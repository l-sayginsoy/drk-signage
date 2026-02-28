
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTime } from '../hooks/useTime';
import { UrgentMessage, Meal, SlideshowData, WeeklyScheduleData, Resident, LunchMenu } from '../types';
import Slideshow from './Slideshow';
import BirthdayView from './BirthdayView';
import { Clock, MapPin } from 'lucide-react';

interface MenuPlanViewProps {
    imageUrl: string;
}

// Props for the main component
interface FocusViewProps {
  urgentMessage: UrgentMessage;
  meals: Meal[];
  lunchMenu: LunchMenu;
  slideshow: SlideshowData;
  weeklySchedule: WeeklyScheduleData;
  menuPlanUrl: string;
  residents?: Resident[]; 
}

// Reusable container with animation
interface ContentContainerProps {
    children?: React.ReactNode;
    imageUrl?: string;
    className?: string;
    style?: React.CSSProperties;
    showFallback?: boolean;
    mode?: 'cover' | 'contain'; // New prop to control image scaling
}

export const ContentContainer = React.forwardRef<HTMLDivElement, ContentContainerProps>(({ 
    children, 
    imageUrl, 
    className = "", 
    style = {}, 
    showFallback = false,
    mode = 'cover'
}, ref) => {
    const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error' | 'empty'>('empty');

    useEffect(() => {
        if (!imageUrl) {
            setImageStatus('empty');
            return;
        }

        setImageStatus('loading');
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => setImageStatus('loaded');
        img.onerror = () => setImageStatus('error');
    }, [imageUrl]);

    // Use fallback if requested AND (image is missing, broken, or still loading to prevent white flash)
    const useFallback = showFallback && (imageStatus === 'error' || imageStatus === 'empty' || imageStatus === 'loading');

    let finalStyle: React.CSSProperties = { ...style };
    // Base class
    let finalClassName = `absolute inset-0 flex flex-col items-center justify-center ${className}`;

    // If we are in 'cover' mode (default), we use background-image for easy centering/covering
    // UNLESS we want 'contain' mode for sharp text (Menu Plans).
    // However, to fix the pixelation issue reported, we should prefer <img> tags generally if possible,
    // but background-image is robust for "cover". 
    // For "contain", <img> is definitely better.

    let imageElement = null;

    if (useFallback) {
        finalStyle.backgroundImage = "url('/assets/drk-logo.png')";
        finalStyle.backgroundSize = "30%"; // Moderate size, don't fill screen
        finalStyle.backgroundRepeat = "no-repeat";
        finalStyle.backgroundPosition = "center";
        finalStyle.backgroundColor = "#f3f4f6"; // Light gray background
    } else if (imageStatus === 'loaded') {
        if (mode === 'contain') {
            // Render as real image for best quality (no pixelation) and full visibility
            imageElement = (
                <img 
                    src={imageUrl} 
                    alt="Content" 
                    className="w-full h-full object-contain pointer-events-none" 
                />
            );
            finalClassName += " bg-gray-100"; // Background for letterboxing
        } else {
            // 'cover' mode - stick to background image for now as it handles "filling" divs nicely,
            // or switch to object-cover img. Let's stick to background for cover to minimize regression on mood images,
            // unless we want to fix pixelation there too. 
            // The user specifically complained about "Speiseplan" (Menu Plan).
            finalStyle.backgroundImage = `url(${imageUrl})`;
            finalClassName += " bg-cover bg-center";
        }
    }

    return (
        <motion.div
          ref={ref}
          className={finalClassName}
          style={finalStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "linear" }}
        >
          {imageElement}
          {children}
        </motion.div>
    );
});

ContentContainer.displayName = 'ContentContainer';

// --- Sub-components ---

const UrgentMessageView: React.FC<{ message: UrgentMessage }> = ({ message }) => (
    <ContentContainer imageUrl={message.imageUrl} showFallback={true} mode="cover">
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-8">
            <h1 className="font-black text-red-500 drop-shadow-lg mb-4" style={{ fontSize: 'clamp(2.5rem, 6vmin, 4.5rem)' }}>{message.title}</h1>
            <p className="text-white drop-shadow-lg font-bold leading-relaxed" style={{ fontSize: 'clamp(1.5rem, 4vmin, 2.5rem)' }}>{message.text}</p>
        </div>
    </ContentContainer>
);

const EventAlertView: React.FC<{ title: string; location: string; time: string; minutesLeft: number }> = ({ title, location, time, minutesLeft }) => (
    <ContentContainer showFallback={true} mode="cover">
         <div className="absolute inset-0 bg-blue-900/90 flex flex-col items-center justify-center text-center p-8 text-white">
            <div className="text-3xl font-bold mb-4 uppercase tracking-widest">Nächster Termin</div>
            <h1 className="font-black text-6xl mb-6">{title}</h1>
            <div className="text-4xl mb-4 flex items-center gap-3">
                <Clock className="w-10 h-10" /> {time}
            </div>
            <div className="text-3xl flex items-center gap-3 opacity-80">
                <MapPin className="w-8 h-8" /> {location}
            </div>
            <div className="mt-12 text-2xl bg-white/20 px-6 py-2 rounded-full">
                Startet in {minutesLeft} min
            </div>
        </div>
    </ContentContainer>
);

const MealView: React.FC<{ imageUrl: string }> = ({ imageUrl }) => (
    // Meals (Lunch/Dinner) are often Menu Plans or Food images. 
    // Given the user complaint about "Speiseplan", we should default to 'contain' 
    // or at least 'contain' for the Lunch Menu which is the main "Speiseplan".
    <ContentContainer imageUrl={imageUrl} showFallback={true} mode="contain" />
);

// ...

const MenuPlanView: React.FC<MenuPlanViewProps> = ({ imageUrl }) => {
    return (
        <ContentContainer key="menu-plan" imageUrl={imageUrl} showFallback={true} mode="contain" />
    );
};

// --- Main Component ---

const FocusView: React.FC<FocusViewProps> = ({ urgentMessage, meals, lunchMenu, slideshow, weeklySchedule, menuPlanUrl, residents = [] }) => {
  const { hour, minute, dayOfWeekIndex, calendarWeek, now } = useTime();

  // Helper: Convert "HH:mm" to minutes from midnight
  const getMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
  };

  // Improved Time Check: If time string is empty, treat as "valid/active" (e.g. no end time = forever)
  const isTimeActive = (activeUntil: string): boolean => {
      if (!activeUntil || !activeUntil.includes(':')) return true; // Treat empty as indefinitely active
      const currentMinutes = hour * 60 + minute;
      const endMinutes = getMinutes(activeUntil);
      return currentMinutes <= endMinutes;
  };

  // Check if current time is within a start/end range
  const isTimeInRange = (start: {hour: number, minute: number}, end: {hour: number, minute: number}) => {
      const currentMinutes = hour * 60 + minute;
      const startMinutes = start.hour * 60 + start.minute;
      const endMinutes = end.hour * 60 + end.minute;
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  };

  const getCurrentMeal = (): Meal | null => {
    // Check standard meals (Breakfast, Dinner, Coffee)
    for (const meal of meals) {
      if (isTimeInRange(meal.startTime, meal.endTime)) {
        return meal;
      }
    }
    return null;
  };

  const getUpcomingEvent = () => {
      const dayNames = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
      const todayName = dayNames[dayOfWeekIndex];
      const weekData = weeklySchedule[calendarWeek] || [];
      const dayData = weekData.find(d => d.day === todayName);
      
      if (!dayData || !dayData.events) return null;

      const currentMinutes = hour * 60 + minute;

      // Check all events for today
      for (const event of dayData.events) {
          const eventMinutes = getMinutes(event.time);
          
          // Logic: 
          // Show from 15 mins BEFORE (eventMinutes - 15)
          // Until 10 mins AFTER (eventMinutes + 10)
          
          const startDisplay = eventMinutes - 15;
          const endDisplay = eventMinutes + 10;

          if (currentMinutes >= startDisplay && currentMinutes < endDisplay) {
              return {
                  ...event,
                  minutesLeft: eventMinutes - currentMinutes
              };
          }
      }
      return null;
  };

  const getBirthdayResidents = (): Resident[] => {
      const todayMonth = now.getMonth() + 1; // JS months are 0-indexed
      const todayDay = now.getDate();

      return residents.filter(r => {
          if (!r.active) return false;
          const bDate = new Date(r.birthDate);
          return bDate.getDate() === todayDay && (bDate.getMonth() + 1) === todayMonth;
      });
  }
  
  const renderContent = () => {
    // PRIORITY SYSTEM:
    
    // 1. Eilmeldung (Admin Override) - Highest Priority
    if (urgentMessage.active && isTimeActive(urgentMessage.activeUntil)) {
      return <UrgentMessageView key="urgent" message={urgentMessage} />;
    }

    // 2. Event Notification (Automatic 15min warning)
    const upcomingEvent = getUpcomingEvent();
    if (upcomingEvent) {
        return (
            <EventAlertView 
                key={`event-${upcomingEvent.id}`} 
                title={upcomingEvent.title} 
                location={upcomingEvent.location}
                time={upcomingEvent.time}
                minutesLeft={upcomingEvent.minutesLeft}
            />
        );
    }

    // 3. Birthday Logic (Periodic Override)
    // Rule: Show for 2 minutes every 15 minutes (00-02, 15-17, 30-32, 45-47)
    // NOTE: It overrides slideshow and meals during this short window
    const birthdayResidents = getBirthdayResidents();
    if (birthdayResidents.length > 0) {
        const currentTotalMinutes = hour * 60 + minute;
        // Modulo 15. If result is 0 or 1, we are in the first 2 minutes of a 15 min block.
        const isBirthdaySlot = (currentTotalMinutes % 15) < 2; 
        
        if (isBirthdaySlot) {
            return <BirthdayView key="birthday" residents={birthdayResidents} />;
        }
    }

    // 4. LUNCH (Daily rotating image) - Time based
    if (lunchMenu && isTimeInRange(lunchMenu.startTime, lunchMenu.endTime)) {
        // dayOfWeekIndex: 0 = Mon, ..., 6 = Sun
        // Corresponds to the index in lunchMenu.images
        const lunchImage = lunchMenu.images[dayOfWeekIndex];
        // Use generic fallback if specific day image is empty, or use DRK fallback
        const img = lunchImage || menuPlanUrl; 
        return <MealView key={`lunch-${dayOfWeekIndex}`} imageUrl={img} />;
    }

    // 5. OTHER MEALS (Breakfast, Dinner) - Time based
    const currentMeal = getCurrentMeal();
    if (currentMeal) {
      return <MealView key={currentMeal.name} imageUrl={currentMeal.imageUrl} />;
    }
    
    // 6. SLIDESHOW (Fallback / Idle state)
    // As requested: "Between meals... show slideshow".
    // We check if slideshow is active in general settings
    if (slideshow.active && isTimeActive(slideshow.activeUntil)) {
      return <Slideshow key="slideshow" images={slideshow.images} />;
    }

    // 7. Last Resort Fallback (Menu Plan)
    return <MenuPlanView key="menu-plan" imageUrl={menuPlanUrl} />;
  };
  
  return (
    <div className="w-full h-full relative rounded-[18px] overflow-hidden shadow-inner bg-black">
        <AnimatePresence>
            {renderContent()}
        </AnimatePresence>
    </div>
  );
};

export default FocusView;
