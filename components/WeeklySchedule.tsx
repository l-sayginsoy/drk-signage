
import React from 'react';
import { useTime } from '../hooks/useTime';
import { WeeklyScheduleData, Event } from '../types';

interface WeeklyScheduleProps {
  weeklySchedule: WeeklyScheduleData;
}

const dayNames = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ weeklySchedule }) => {
  const { calendarWeek, dayOfWeekIndex, getShortDate, now } = useTime();
  
  const currentWeekSchedule = weeklySchedule[calendarWeek] || [];

  const getDayDate = (index: number): string => {
    const today = now;
    const dayDiff = index - dayOfWeekIndex;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + dayDiff);
    return getShortDate(targetDate);
  }

  // Common styles to ensure perfect alignment between Date and Location
  // We match the height of the "First Line" (Day vs Title) so the "Second Line" (Date vs Location) aligns.
  const primaryTextSize = 'clamp(1rem, 1.8vmin, 1.6rem)'; // Slightly smaller
  const secondaryTextSize = 'clamp(0.8rem, 1.4vmin, 1.1rem)'; 
  const secondaryTextColor = 'text-slate-400';
  const accentColor = 'text-slate-600';

  return (
    <div className="w-full h-full bg-white rounded-3xl shadow-md border border-gray-200/80 flex flex-col overflow-hidden font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center px-[3vmin] py-[2vmin] border-b border-slate-100 bg-white z-20">
        <h2 className="font-bold text-slate-800 tracking-tight" style={{ fontSize: 'clamp(1.2rem, 2.5vmin, 2rem)' }}>
          Wochenplan
        </h2>
        <div className="bg-slate-50 text-slate-500 border border-slate-100 font-semibold px-[1.2vmin] py-[0.4vmin] rounded-md" style={{ fontSize: 'clamp(0.7rem, 1.4vmin, 1rem)' }}>
          KW {calendarWeek}
        </div>
      </div>

      {/* Schedule Rows */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {dayNames.map((dayName, index) => {
          const isToday = index === dayOfWeekIndex;
          const dayData = currentWeekSchedule.find(d => d.day === dayName) || { day: dayName, events: [] };
          
          let eventToShow: Event | null = null;
          if (dayData.events.length > 0) {
            const sortedEvents = [...dayData.events].sort((a, b) => a.time.localeCompare(b.time));
            if (isToday) {
              const currentTime = now.getHours() * 60 + now.getMinutes();
              const upcomingEvent = sortedEvents.find(event => {
                const [eventHour, eventMinute] = event.time.split(':').map(Number);
                return eventHour * 60 + eventMinute >= currentTime;
              });
              eventToShow = upcomingEvent || sortedEvents[sortedEvents.length - 1];
            } else {
              eventToShow = sortedEvents[0];
            }
          }

          // Row Styling
          const rowClasses = isToday 
            ? "bg-slate-50/50" 
            : "bg-white hover:bg-slate-50/20";

          const borderClasses = "border-b border-slate-50 last:border-0";
          
          return (
            <div 
                key={dayName} 
                className={`relative flex items-center px-[2vmin] transition-colors ${rowClasses} ${borderClasses}`}
                style={{ flex: '1 1 0%', minHeight: '10%' }}
            >
                {/* Active Day Highlight */}
                {isToday && (
                    <>
                        <div className="absolute inset-y-0 left-0 w-[0.4vmin] bg-slate-400 z-10" />
                        <div className="absolute top-0 left-[2.5vmin] -translate-y-1/2 bg-slate-800 text-white text-[clamp(0.5rem,0.9vmin,0.7rem)] font-bold px-[0.8vmin] py-[0.1vmin] rounded shadow-sm tracking-wider z-20 uppercase">
                           Heute
                        </div>
                    </>
                )}

                {/* Column 1: Day Name (MO) & Date */}
                <div className="w-[15%] flex flex-col justify-center flex-shrink-0">
                    <span className="font-bold tracking-tight leading-tight text-slate-800 uppercase" style={{fontSize: primaryTextSize}}>
                        {dayName.substring(0, 2)}
                    </span>
                    <span className={`font-medium mt-[0.2vmin] leading-tight ${secondaryTextColor}`} style={{fontSize: secondaryTextSize}}>
                        {getDayDate(index)}
                    </span>
                </div>

                {/* Column 2: Time */}
                <div className="w-[18%] flex justify-center items-center flex-shrink-0">
                     {eventToShow ? (
                         <span className="font-bold text-slate-700 tracking-tight" style={{ fontSize: 'clamp(1.4rem, 3vmin, 2.4rem)' }}>
                            {eventToShow.time}
                        </span>
                    ) : (
                        <span className="text-slate-100 font-bold select-none" style={{ fontSize: 'clamp(1.2rem, 2.5vmin, 2rem)' }}>--:--</span>
                    )}
                </div>

                {/* Column 3: Event Title & Location */}
                <div className="flex-1 min-w-0 pl-[2vmin] flex flex-col justify-center">
                    {eventToShow ? (
                        <>
                            <p className="font-semibold text-slate-800 leading-tight truncate" title={eventToShow.title} style={{ fontSize: primaryTextSize }}>
                                {eventToShow.title}
                            </p>
                            <p className={`font-medium truncate mt-[0.2vmin] leading-tight ${secondaryTextColor}`} style={{ fontSize: secondaryTextSize }}>
                                {eventToShow.location}
                            </p>
                        </>
                    ) : (
                        <p className="text-slate-200 font-medium italic" style={{ fontSize: secondaryTextSize }}>Keine Termine</p>
                    )}
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklySchedule;
