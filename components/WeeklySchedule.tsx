
import { type FC } from 'react';
import { useTime } from '../hooks/useTime';
import { WeeklyScheduleData, Event } from '../types';

interface WeeklyScheduleProps {
  weeklySchedule: WeeklyScheduleData;
}

const dayNames = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const WeeklySchedule: FC<WeeklyScheduleProps> = ({ weeklySchedule }) => {
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
  const primaryTextSize = 'clamp(1.1rem, 2.1vmin, 2.0rem)'; // Same size for MO and Event Title
  const secondaryTextSize = 'clamp(0.85rem, 1.6vmin, 1.3rem)'; // Same size for Date and Location
  const secondaryTextColor = 'text-gray-500';

  return (
    <div className="w-full h-full bg-white rounded-3xl shadow-md border border-gray-200/80 flex flex-col overflow-hidden font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center px-[3vmin] py-[2vmin] border-b border-gray-100 bg-white z-20">
        <h2 className="font-black text-gray-900 tracking-tight" style={{ fontSize: 'clamp(1.5rem, 3vmin, 2.5rem)' }}>
          Wochenplan
        </h2>
        <div className="bg-red-50 text-red-600 border border-red-100 font-bold px-[1.5vmin] py-[0.5vmin] rounded-lg shadow-sm" style={{ fontSize: 'clamp(0.8rem, 1.6vmin, 1.2rem)' }}>
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
            ? "bg-red-50/40" 
            : "bg-white hover:bg-gray-50/30";

          const borderClasses = "border-b border-gray-100 last:border-0";
          
          return (
            <div 
                key={dayName} 
                className={`relative flex items-center px-[2vmin] transition-colors ${rowClasses} ${borderClasses}`}
                style={{ flex: '1 1 0%', minHeight: '10%' }}
            >
                {/* Active Day Highlight */}
                {isToday && (
                    <>
                        <div className="absolute inset-0 border-[0.25vmin] border-red-200/80 pointer-events-none z-10" />
                        <div className="absolute top-0 left-[2.5vmin] -translate-y-1/2 bg-red-100 text-red-600 border border-red-200 text-[clamp(0.6rem,1vmin,0.8rem)] font-extrabold px-[1vmin] py-[0.1vmin] rounded-full shadow-sm tracking-wide z-20 uppercase">
                           Heute
                        </div>
                    </>
                )}

                {/* Column 1: Day Name (MO) & Date */}
                <div className="w-[18%] flex flex-col justify-center flex-shrink-0">
                    <span className="font-black tracking-tight leading-tight text-gray-900 uppercase" style={{fontSize: primaryTextSize}}>
                        {dayName.substring(0, 2)}
                    </span>
                    <span className={`font-medium mt-[0.3vmin] leading-tight ${secondaryTextColor}`} style={{fontSize: secondaryTextSize}}>
                        {getDayDate(index)}
                    </span>
                </div>

                {/* Column 2: Time */}
                <div className="w-[20%] flex justify-center items-center flex-shrink-0">
                     {eventToShow ? (
                         <span className="font-black text-gray-900 tracking-tighter" style={{ fontSize: 'clamp(1.8rem, 3.8vmin, 3.2rem)' }}>
                            {eventToShow.time}
                        </span>
                    ) : (
                        <span className="text-gray-200 font-bold select-none" style={{ fontSize: 'clamp(1.5rem, 3vmin, 2.5rem)' }}>--:--</span>
                    )}
                </div>

                {/* Column 3: Event Title & Location */}
                <div className="flex-1 min-w-0 pl-[2vmin] flex flex-col justify-center">
                    {eventToShow ? (
                        <>
                            <p className="font-bold text-gray-900 leading-tight truncate" title={eventToShow.title} style={{ fontSize: primaryTextSize }}>
                                {eventToShow.title}
                            </p>
                            <p className={`font-medium truncate mt-[0.3vmin] leading-tight ${secondaryTextColor}`} style={{ fontSize: secondaryTextSize }}>
                                {eventToShow.location}
                            </p>
                        </>
                    ) : (
                        <p className="text-gray-300 font-medium italic" style={{ fontSize: secondaryTextSize }}>Keine Termine</p>
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
