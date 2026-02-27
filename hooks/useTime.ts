
import { useState, useEffect } from 'react';
import { getCalendarWeek } from '../utils/dateUtils';

export const useTime = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const dateString = now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
  const dayOfWeekIndex = (now.getDay() + 6) % 7; // 0 = Monday, 6 = Sunday
  const calendarWeek = getCalendarWeek(now);
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  const getShortDate = (date: Date) => date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });

  const getGreeting = () => {
    if (hour >= 5 && hour < 11) return "Guten Morgen";
    if (hour >= 11 && hour < 14) return "Es ist Mittagszeit";
    if (hour >= 14 && hour < 18) return "Es ist Nachmittag";
    if (hour >= 18 && hour < 22) return "Guten Abend";
    return "Gute Nacht";
  };

  return { now, timeString, dateString, dayOfWeekIndex, calendarWeek, hour, minute, getShortDate, greeting: getGreeting() };
};
